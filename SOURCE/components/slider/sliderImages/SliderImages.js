class SliderImages extends Slider {	
	constructor({
		parent,
		target,
		scope,
		captions
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
		this.$sliderCaptions = captions;
	}

	set() {
		// sliders
		this.$slider = this.$target;

		// params
		this.sliderSpeed = this.$slider.data('speed') || 800;

		// dots
		this.$sliderDots = this.$parent.find('.js-slider__dots');

		// arrows
		this.$arrowNext = this.$parent.find('.js-slider__arrow-next');
		this.$arrowPrev = this.$parent.find('.js-slider__arrow-prev');

		// underline
		this.$underline = this.$parent.find('.js-slider-images__underline');

		// scrollbar
		this.$scrollBar = this.$parent.find('.js-slider__scrollbar');

		// dragging
		this._setDragging({target: this.$target});
	}

	run() {
		this.slider = this._getSlider();
		this.sliderCaptions = this._getSliderCaptions();

		// dots
		if (this.$sliderDots.length) {
			this._getSliderDots({
				slider: this.slider,
				container: this.$sliderDots
			});
		}

		// slider drag
		if (typeof this.drag === 'object') {
			this._emitDragEvents($.extend(this.drag, {
				slider: this.slider,
			}));
		}

		// captions
		if (this.$sliderCaptions.length) {
			this._setCaptionsNavigation();

			if (this.$underline.length) {
				this._bindEvents();
			}
		}

		if (this.$parent.length) {
			this._setAutoplayAnimation({
				parent: this.$parent,
				slider: this.slider,
			});
		}

		// initial backgrounds set
		if (this.slider && typeof this.slider.emit === 'function') {
			setTimeout(() => {
				this.slider.emit('slideChange');
			}, 250);
		}

		if (this.$scrollBar.length) {
			this._setScrollbar({
				slider: this.slider,
				scrollbar: this.$scrollBar
			});
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$slider,
			slider: this.slider
		});

		this._updateOnTransitionEnd([
			this.slider,
			this.sliderCaptions
		]);
	}

	_bindEvents() {
		const self = this;

		// update line position on window resize
		window.$window.on('resize', debounce(() => {
			const
				currentIndex = this.slider.realIndex,
				$targetSlide = $(this.sliderCaptions.slides[currentIndex]),
				duration = this.sliderSpeed / 1000;

			setTimeout(() => {
				self._updateLinePosition($targetSlide, duration);
			}, 750);
			self._updateLinePosition($targetSlide, duration);
		}, 250));

		this.$sliderCaptions
			.on('mouseenter', '.swiper-slide', function () {
				self._updateLinePosition($(this), self.sliderSpeed / 1500);
			})
			.on('mouseleave', '.swiper-slide', function () {
				self._updateLinePosition($(self.sliderCaptions.slides).filter('.swiper-slide-active'), self.sliderSpeed / 1500);
			});
	}

	_getSlider() {
		const breakpoints = this._setBreakpoints({
			target: this.$target
		});

		return new Swiper(this.$target[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$target.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			autoHeight: this.$target.data('auto-height'),
			speed: this.$target.data('speed') || 1200,
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 4,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			grabCursor: true,
			observer: true,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			centeredSlides: this.$target.data('centered-slides') || false,
			slidesPerView: this.$target.data('slides-per-view') || 1,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			spaceBetween: this.$slider.data('space-between') || 20,
			pagination: {
				el: this.$sliderDots.get(0),
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
			navigation: {
				nextEl: this.$arrowNext.get(0),
				prevEl: this.$arrowPrev.get(0),
			},
			scrollbar: {
				hide: false,
				el: this.$scrollBar.get(0),
				dragClass: 'slider__scrollbar-handle'
			},
			touchEventsTarget: 'container',
			thumbs: {
				autoScrollOffset: 0
			},
			breakpoints,
		});
	}

	_getSliderCaptions() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderCaptions
		});

		return new Swiper(this.$sliderCaptions[0], {
			speed: this.sliderSpeed,
			centeredSlides: this.$sliderCaptions.data('centered-slides') || false,
			slidesPerView: this.$sliderCaptions.data('slides-per-view') || 1,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			simulateTouch: false,
			breakpoints
		});
	}

	_setCaptionsNavigation() {
		const self = this;

		this.slider.controller.control = this.sliderCaptions;
		this.sliderCaptions.controller.control = this.slider;

		this.sliderCaptions.slides.each(function () {
			$(this).on('click', function () {
				self.slider.slideTo($(this).index());
			});
		});

		if (this.$underline.length) {
			this.slider.on('slideChange', () => {
				const
					currentIndex = this.slider.realIndex,
					$targetSlide = $(this.sliderCaptions.slides[currentIndex]),
					duration = this.sliderSpeed / 1000;
				this._updateLinePosition($targetSlide, duration);
			});
		}
	}

	_updateLinePosition($el, duration = 1.2) {
		if (!$el || !$el.length) {

			gsap.to(this.$underline, {
				duration,
				width: 0,
				ease: 'power3.inOut',
			});
		} else {
			const
				outerOffset = this.$sliderCaptions.offset(),
				slideWidth = $el.innerWidth(),
				slidePos = $el.position(),
				slideOffset = $el.offset();

			gsap.to(this.$underline, {
				duration,
				ease: 'power3.inOut',
				width: slideWidth,
				top: slideOffset.top - outerOffset.top,
				left: slidePos.left,
			});
		}
	}
}
