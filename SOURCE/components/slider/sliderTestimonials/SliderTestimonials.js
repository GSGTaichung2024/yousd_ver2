class SliderTestimonials extends Slider {
	constructor({
		parent,
		scope,
		target
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
	}

	set() {
		// sliders
		this.$slider = this.$target;

		// params
		this.sliderSpeed = this.$slider.data('speed') || 800;
		this.textTransitionsEnabled = this.$target.attr('data-transition') === 'text' || false;

		// content
		this.$heading = this.$target.find('.slider__heading');
		this.$subheading = this.$target.find('.slider__subheading');
		this.$description = this.$target.find('.slider__text');

		// dots
		this.$sliderDots = this.$parent.find('.js-slider__dots');

		// arrows
		this.$arrowNext = this.$parent.find('.js-slider__arrow-next');
		this.$arrowPrev = this.$parent.find('.js-slider__arrow-prev');
	}

	run() {
		this.slider = this._getSlider();

		if (this.slider.slides.length <= 1) {
			this.slider.destroy(true, true);

			if (this.$sliderDots.length) {
				this.$sliderDots.remove();
			}

			if (this.$arrowNext.length) {
				this.$arrowNext.remove();
			}

			if (this.$arrowPrev.length) {
				this.$arrowPrev.remove();
			}

			return;
		}

		// text transitions
		if (this.textTransitionsEnabled) {
			this._setSliderTextTransitions();
		}

		// dots
		if (this.$sliderDots.length) {
			this._getSliderDots({
				slider: this.slider,
				container: this.$sliderDots
			});
		}

		// initial backgrounds set
		if (this.slider && typeof this.slider.emit === 'function') {
			this.slider.emit('slideChange');
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$slider,
			slider: this.slider
		});

		this._updateOnTransitionEnd([
			this.slider
		]);
	}

	_getSlider() {
		return new Swiper(this.$target[0], {
			simulateTouch: false,
			grabCursor: true,
			autoHeight: true,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			keyboard: this.$target.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			speed: this.$target.data('speed') || 1200,
			slidesPerView: 1,
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
			virtualTranslate: this.textTransitionsEnabled ? true : false,
			effect: 'fade',
			fadeEffect: {
				crossFade: this.textTransitionsEnabled ? false : true
			},
		});
	}

	_setSliderTextTransitions() {
		return new SliderTextTransitions({
			slider: this.slider,
			direction: 'vertical',
			heading: this.$heading,
			subheading: this.$subheading,
			description: this.$description,
			hasAnimation: true
		});
	}
}
