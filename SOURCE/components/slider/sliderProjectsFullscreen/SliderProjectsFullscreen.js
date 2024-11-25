class SliderProjectsFullscreen extends Slider {
	constructor({
		parent,
		target,
		scope,
		hasAnimation = false
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
		this.hasAnimation = hasAnimation;
	}

	set() {
		// sliders
		this.$slider = this.$target;
		this.$sliderContent = this.$slider.find('.js-slider-projects-fullscreen__content');
		this.$sliderImages = this.$slider.find('.js-slider-projects-fullscreen__images');
		this.$sliderThumbs = this.$slider.find('.js-slider-projects-fullscreen__thumbs');

		// scrollbar
		this.$scrollBar = this.$slider.find('.js-slider-projects-fullscreen__scrollbar');

		// counter
		this.$sliderCounterCurrent = this.$target.find('.js-slider__counter-current');
		this.$sliderCounterTotal = this.$target.find('.js-slider__counter-total');

		// counter zeros amount to prepend
		this.sliderCounterZeros = this.$sliderImages.data('counter-add-zeros') || 0;

		// dynamic backgrounds slides
		this.$slidesBackground = this.$slider.find('[data-slide-background]');

		// content
		this.$heading = this.$target.find('.slider__heading');
		this.$subheading = this.$target.find('.slider__subheading');
		this.$description = this.$target.find('.slider__text');
		this.$link = this.$target.find('.slider__wrapper-button');
		this.$line = this.$target.find('.post-meta__divider');

		// params
		this.sliderSpeed = this.$sliderImages.data('speed') || 800;
		this.textTransitionsEnabled = this.$sliderContent.data('transition') === 'text' || false;
		this.textTransitionsDirection = this.$sliderContent.data('transition-direction') || this.$sliderImages.data('direction');

		// dragging
		this._setDragging({target: this.$sliderImages});

		// prefetch
		this.prefetcActiveSlideTransition = this.$sliderContent.data('prefetch-active-slide-transition') || true;
	}

	run() {
		this.sliderContent = this._getSliderContent();
		this.sliderImages = this._getSliderImages();
		this.sliderThumbs = this.$sliderThumbs.length ? this._getSliderThumbs() : null;

		// connect sliders
		this.sliderImages.controller.control.push(this.sliderContent);
		this.sliderContent.controller.control.push(this.sliderImages);

		// update slider dimensions before OS animation is started
		if (this.$parent.length) {
			this._setAutoplayAnimation({
				parent: this.$parent,
				slider: this.sliiderImages,
			});

			this.$parent.one('animation/start', () => {
				this.sliderContent.update();
				this.sliderImages.update();
			});
		}

		// slider drag
		if (typeof this.drag === 'object') {
			this._emitDragEvents($.extend(this.drag, {
				slider: this.sliderImages,
			}));
		}

		// text transitions
		if (this.textTransitionsEnabled) {
			this._setSliderTextTransitions();
		}

		// thumbs
		if (this.$sliderThumbs.length) {
			this._setThumbsNavigation();
			$(this.sliderThumbs.slides).eq(this.sliderThumbs.activeIndex).addClass('swiper-slide-thumb-active');
		}

		if (this.$slidesBackground.length) {
			this._setBackgrounds({
				target: this.$slider.closest('.js-slider-background'),
				slider: this.sliderImages,
				side: this.$slider.find('.js-slider-projects-fullscreen__sidebar'),
				header: window.$pageHeader
			});

			// initial backgrounds set
			if (this.sliderImages && typeof this.sliderImages.emit === 'function') {
				this.sliderImages.emit('slideChange');
			}
		}

		if (this.$scrollBar.length) {
			this._setScrollbar({
				slider: this.sliderImages,
				scrollbar: this.$scrollBar
			});
		}

		if (this.$sliderCounterCurrent.length && this.$sliderCounterTotal.length) {
			this._setCounter({
				slider: this.sliderImages,
				elementCurrent: this.$sliderCounterCurrent,
				elementTotal: this.$sliderCounterTotal,
				zeros: this.sliderCounterZeros
			})
		}

		// prefetch active slide transition
		if (this.sliderContent && this.prefetcActiveSlideTransition && window.kinsey.theme.ajax.enabled) {
			this._prefetchActiveSlideTransition(this.sliderContent);
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$sliderImages,
			slider: this.sliderImages
		});

		this._bindEvents();
	}

	_bindEvents() {

		window.$pageHeader
			.on('menuOpenStart', () => {
				this._setExternalControls({
					slider: this.sliderImages,
					enabled: false
				});
			})
			.on('menuCloseStart', () => {
				this._setExternalControls({
					slider: this.sliderImages,
					enabled: true
				});
			});

		if (this.$parent.length) {
			this.$parent
				.on('animation/start', () => {
					this._setExternalControls({
						slider: this.sliderImages,
						enabled: false
					});
				})
				.on('animation/complete', () => {
					this._setExternalControls({
						slider: this.sliderImages,
						enabled: true
					});
				});
		}

		this._updateOnResize([
			this.sliderImages,
			this.sliderContent,
			this.sliderThumbs
		]);

		this._updateOnTransitionEnd([
			this.sliderImages,
			this.sliderContent,
			this.sliderThumbs
		]);
	}

	_getSliderContent() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderContent
		});

		return new Swiper(this.$sliderContent[0], {
			allowTouchMove: false,
			watchSlidesVisibility: true,
			speed: this.sliderSpeed,
			slidesPerView: this.$sliderContent.data('slides-per-view') || 1,
			direction: this.textTransitionsEnabled ? 'horizontal' : this.$sliderContent.data('direction') || this.$sliderImages.data('direction'),
			centeredSlides: this.$sliderContent.data('centered-slides') || false,
			autoHeight: this.$sliderContent.data('auto-height') || false,
			controller: {
				control: [],
				by: 'container'
			},
			virtualTranslate: this.textTransitionsEnabled ? true : false,
			effect: this.textTransitionsEnabled ? 'fade' : 'slide',
			fadeEffect: {
				crossFade: true //this.textTransitionsEnabled ? false : true
			},
			parallax: true,
			breakpoints
		});
	}

	_getSliderImages() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderImages
		});

		return new Swiper(this.$sliderImages[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$sliderImages.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			grabCursor: true,
			watchSlidesVisibility: true,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$sliderImages.data('autoplay-enabled') || false,
				delay: this.$sliderImages.data('autoplay-delay') || 6000,
			},
			keyboard: this.$sliderImages.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			mousewheel: this.$sliderImages.data('mousewheel-enabled') ? {
				eventsTarged: this.$target.get(0),
				eventsTarget: this.$target.get(0),
				releaseOnEdges: true,
			} : false,
			speed: this.sliderSpeed,
			direction: this.$sliderImages.data('direction') || 'horizontal',
			slidesPerView: 1,
			navigation: {
				nextEl: this.$slider.find('.js-slider__arrow-next').get(0),
				prevEl: this.$slider.find('.js-slider__arrow-prev').get(0),
			},
			lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true
      },
			controller: {
				control: [],
				by: 'container'
			},
			thumbs: {
				swiper: this.sliderThumbs
			},
			parallax: true,
			scrollbar: {
				hide: false,
				el: this.$scrollBar.get(0),
				dragClass: 'slider__scrollbar-handle'
			},
			breakpoints,
		});
	}

	_getSliderThumbs() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderThumbs
		});

		return new Swiper(this.$sliderThumbs[0], {
			speed: this.sliderSpeed,
			slidesPerView: 3,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			simulateTouch: false,
			breakpoints
		});
	}

	_setSliderTextTransitions() {
		return new SliderTextTransitions({
			slider: this.sliderContent,
			direction: this.textTransitionsDirection,
			heading: this.$heading,
			subheading: this.$subheading,
			description: this.$description,
			line: this.$line,
			link: this.$link,
			hasAnimation: this.hasAnimation
		});
	}

	_setThumbsNavigation() {
		const self = this;

		this.sliderImages.thumbs.swiper = this.sliderThumbs;

		this.sliderThumbs.slides.each(function () {
			$(this).on('click', function () {
				self.sliderImages.slideTo($(this).index());
			});
		});
	}
}
