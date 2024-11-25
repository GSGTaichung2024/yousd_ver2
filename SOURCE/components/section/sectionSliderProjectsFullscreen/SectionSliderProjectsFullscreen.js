class SectionSliderProjectsFullscreen extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider-projects-fullscreen');

		this.textTransitionsEnabled = this.$target.find('.js-slider-projects-fullscreen__content').attr('data-transition') === 'text' || false;

		this.$firstSlide = this.textTransitionsEnabled ? this.$slider.find('.swiper-slide').eq(0) : this.$slider.find('.swiper-slide');
		this.$firstHeading = this.$firstSlide.find('.slider__heading');
		this.$firstSubheading = this.$firstSlide.find('.slider__subheading');
		this.$firstDescription = this.$firstSlide.find('.slider__text');
		this.$firstLine = this.$firstSlide.find('.post-meta__divider');
		this.$firstLink = this.$firstSlide.find('.slider__wrapper-button');
	}

	init() {
		this.slider = new SliderProjectsFullscreen({
			parent: this.$target,
			target: this.$slider,
			hasAnimation: this.hasAnimationScene()
		});
	}

	animateIn() {

		this.timeline
			.animateText(this.$firstHeading, {
				duration: 1.2
			}, '0')
			.add([
				gsap.effects.animateText(this.$firstSubheading, {
					autoAlpha: 1,
					duration: 1.2
				}),
				gsap.effects.animateHeadline(this.$firstLine)
			], '-=0.8')
			.animateText(this.$firstDescription, {
				duration: 1.2,
				autoAlpha: 1,
			}, '-=0.8')
			.animateJump(this.$firstLink, '-=1.0');
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
