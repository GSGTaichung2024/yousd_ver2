class SectionSliderProjects extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider-projects__slider');
		this.$sliderHeader = this.$target.find('.section-slider-projects__header');
	}

	init() {
		this.slider = new SliderProjects({
			parent: this.$target,
			target: this.$slider,
			$header: this.$sliderHeader.filter('.js-slider-projects__header'),
			hasAnimation: this.hasAnimationScene()
		});
	}

	animateOut() {
		const
			$visibleSlide = this.$target.find('.swiper-slide-visible'),
			$headline = $visibleSlide.find('.post-meta__divider'),
			$link = $visibleSlide.find('.slider__wrapper-button');

		this.timelineOut.add([
			gsap.effects.hideText($visibleSlide),
			gsap.effects.hideHeadline($headline),
			gsap.effects.hideJump($link),
		], '0');
	}
}
