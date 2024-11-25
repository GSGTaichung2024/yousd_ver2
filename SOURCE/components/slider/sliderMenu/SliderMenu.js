class SliderMenu extends Slider {

	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
	}

	set() {
		this.slider = null;
		// dragging
		this._setDragging({ target: this.$target });
		this.animationSpeed = this.$target.data('animation-speed') || this.$target.data('speed') || 1200;
	}

	run() {
		this._init();
		window.$window.on('resize', debounce(() => {
			this._init();
		}, 250));
	}

	_init() {
		if (this.$target.is(':visible') && !this.slider) {
			this.slider = this._getSlider();

			// slider drag
			if (typeof this.drag === 'object') {
				this._emitDragEvents($.extend(this.drag, {
					slider: this.slider,
				}));
			}

			this._bindEvents();
		}
	}

	_bindEvents() {
		window.$pageHeader
			.on('menuOpenStart', () => {
				const
					timeScale = parseFloat(window.kinsey.theme.animations.timeScale.overlayMenuOpen) || 1,
					multiplier = 1 / timeScale;

				this.slider.update();
				this._slideTo({
					slide: 'first',
					duration: this.animationSpeed * multiplier
				});
			})
			.on('menuOpenEnd', () => {
				this.slider.update();
			})
			.on('menuCloseStart', () => {
				const
					timeScale = parseFloat(window.kinsey.theme.animations.timeScale.overlayMenuClose) || 1,
					multiplier = 1 / timeScale;

				if (this.animationSpeed > 0) {
					this._slideTo({
						slide: 'last',
						duration: this.animationSpeed * multiplier
					});
				}
			});
	}

	_slideTo({
		slide = 'first',
		timeout = 50,
		duration = 1200
	}) {
		const lastIndex = this.slider.$el.find('.swiper-slide:not(.swiper-slide-duplicate)').length - 1;

		if (this.slider.params.loop) {

			if (slide === 'first') {
				this.slider.slideToLoop(lastIndex, 0);

				setTimeout(() => {
					this.slider.slideToLoop(0, duration);
				}, timeout);
			}

			if (slide === 'last') {
				setTimeout(() => {
					this.slider.slideToLoop(Math.abs(lastIndex - this.slider.realIndex), duration);
				}, timeout);
			}

		} else {

			if (slide === 'first') {
				this.slider.slideTo(lastIndex, 0);

				setTimeout(() => {
					this.slider.slideTo(0, duration);
				}, timeout);
			}

			if (slide === 'last') {
				this.slider.slideTo(0, 0);

				setTimeout(() => {
					this.slider.slideTo(lastIndex, duration);
				}, timeout);
			}

		}
	}

	_getSlider() {
		const parentContainer = this.$target.parent('.header__wrapper-slider').get(0);

		return new Swiper(this.$target[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$target.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			grabCursor: true,
			autoHeight: this.$target.data('auto-height'),
			speed: this.$target.data('speed') || 1200,
			preloadImages: false,
			direction: 'horizontal',
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 3,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			slidesPerView: 1.33,
			centeredSlides: true,
			spaceBetween: 20,
			loop: true,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			parallax: true,
			// breakpoints,
			breakpoints: {
				991: {
					direction: 'vertical',
					spaceBetween: this.$target.data('space-between') || 60,
					slidesPerView: 'auto',
					freeMode: true,
					freeModeSticky: true,
					centeredSlides: this.$target.data('centered-slides') || false,
				}
			},
			touchEventsTarget: 'container',
			keyboard: this.$target.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			mousewheel: this.$target.data('mousewheel-enabled') ? {
				eventsTarged: parentContainer,
				eventsTarget: parentContainer,
				releaseOnEdges: true,
			} : false,
		});
	}

}
