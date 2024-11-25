class SliderProjects extends Slider {
	constructor({
		parent,
		target,
		$header,
		scope,
		hasAnimation = false
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
		this.hasAnimation = hasAnimation;
		this.$sliderHeader = $header ? $header : null;
		this.$sliderIndicatorSource = $header ? $header.find('.js-slider-projects__source-indicator') : null;
		this.sliderHeaderIsVisible = true;
		this.sliderIndicatorIsVisible = false;
	}

	set() {
		this.$slidesBackground = this.$target.find('[data-slide-background]');
		this.$scrollBar = this.$target.find('.js-slider-projects__scrollbar');
		this.$indicator = this.$target.find('.js-slider-projects__indicator');
		this.$arrowPrev;
		this.$arrowNext;

		if (this.$parent && this.$parent.length) {
			this.$arrowPrev = this.$parent.find('.js-slider__arrow-prev');
			this.$arrowNext = this.$parent.find('.js-slider__arrow-next');
		} else {
			this.$arrowPrev = this.$target.find('.js-slider__arrow-prev');
			this.$arrowNext = this.$target.find('.js-slider__arrow-next');
		}

		// dragging
		this._setDragging({target: this.$target});
	}

	run() {
		this.slider = this._getSlider();

		// slider drag
		if (typeof this.drag === 'object') {
			this._emitDragEvents($.extend(this.drag, {
				slider: this.slider,
			}));
		}

		if (this.$slidesBackground.length) {
			this._setBackgrounds({
				target: this.$target.closest('.js-slider-background'),
				slider: this.slider,
				header: window.$pageHeader
			});
		}

		if (this.$sliderHeader.length && this._isIndicatorEnabled()) {
			this.sliderHeaderTimeline = new gsap.timeline();
			this.animationDuration = parseFloat(this.slider.params.speed / 1000);

			this._hideHeaderOnTransition();

			if (this.$sliderIndicatorSource.length && this.$indicator.length) {
				this.sliderIndicatorTimeline = new gsap.timeline();

				this._setIndicator();
				this._showIndicatorOnTransition();
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
			this.slider.emit('slideChange');
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$target,
			slider: this.slider
		});

		// update all ScrollTrigger instances when slider is resizing its height
		if (this.slider) {
			this._updateScrollTriggerOnHeightChange(this.slider);
		}

		this._updateOnTransitionEnd([
			this.slider
		]);

		this._bindEvents();
	}

	_getSlider() {
		const breakpoints = this._setBreakpoints({
			target: this.$target
		});

		return new Swiper(this.$target[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$target.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			grabCursor: true,
			autoHeight: this.$target.data('auto-height'),
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			keyboard: this.$target.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			mousewheel: this.$target.data('mousewheel-enabled') ? {
				eventsTarged: this.target,
				eventsTarget: this.target,
				releaseOnEdges: true,
			} : false,
			speed: this.$target.data('speed') || 1200,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 3,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			centeredSlides: this.$target.data('centered-slides') || false,
			slidesPerView: this.$target.data('slides-per-view') || 2,
			spaceBetween: this.$target.data('space-between') || 60,
			parallax: true,
			navigation: {
				nextEl: this.$arrowPrev ? this.$arrowNext.get(0) : null,
				prevEl: this.$arrowPrev ? this.$arrowPrev.get(0) : null
			},
			scrollbar: {
				hide: false,
				el: this.$scrollBar.get(0),
				dragClass: 'slider__scrollbar-handle'
			},
			touchEventsTarget: 'container',
			breakpoints,
		});
	}

	_bindEvents() {
		window.$window.on(getResponsiveResizeEvent(), debounce(() => {
			if (!this._isIndicatorEnabled()) {
				gsap.effects.animateLines(this.$sliderHeader, {
					duration: 0.1,
					stagger: false,
				});

				this.sliderIndicatorIsVisible = true;
			}
		}, 250));
	}

	_isIndicatorEnabled() {
		return window.Modernizr.mq(`(min-width: 991px)`);
	}

	_hideHeaderOnTransition() {
		this.slider.on('slideChange', (e) => {
			if (this.sliderHeaderIsVisible === false && e.realIndex === 0) {
				this.sliderHeaderTimeline
					.clear()
					.animateLines(this.$sliderHeader, {
						stagger: false,
						duration: this.animationDuration / 2,
						delay: this.animationDuration / 2
					});

				this.sliderHeaderIsVisible = true;
			}

			if (this.sliderHeaderIsVisible === true && e.realIndex !== 0) {
				this.sliderHeaderTimeline
					.clear()
					.hideLines(this.$sliderHeader, {
						stagger: false,
						y: '-100%',
						duration: this.animationDuration / 2
					});

				this.sliderHeaderIsVisible = false;
			}
		});
	}



	_showIndicatorOnTransition() {
		this.slider.on('slideChange', (e) => {
			if (this.sliderIndicatorIsVisible === false && e.realIndex !== 0) {
				this.sliderIndicatorTimeline
					.clear()
					.to(this.$indicator, {
						y: '0%',
						duration: this.animationDuration / 2,
						ease: 'power3.inOut'
					});

				this.sliderIndicatorIsVisible = true;
			}

			if (this.sliderIndicatorIsVisible === true && e.realIndex === 0) {
				this.sliderIndicatorTimeline
					.clear()
					.to(this.$indicator, {
						y: '100%',
						duration: this.animationDuration / 2,
						delay: this.animationDuration / 2,
						ease: 'power3.inOut'
					});

				this.sliderIndicatorIsVisible = false;
			}
		});
	}

	_setIndicator() {
		// Set indicator text
		this.$indicator.text(this.$sliderIndicatorSource.text());

		gsap.set(this.$indicator, {
			y: '100%',
		});
	}
}
