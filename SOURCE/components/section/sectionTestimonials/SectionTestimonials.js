class SectionTestimonials extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider');
		this.textTransitionsEnabled = this.$target.find('.js-slider-projects-fullscreen__content').attr('data-transition') === 'text' || false;
		this.$firstSlide = this.textTransitionsEnabled ? this.$slider.find('.swiper-slide').eq(0) : this.$slider.find('.swiper-slide');
	}

	init() {
		this.slider = new SliderTestimonials({
			parent: this.$target,
			target: this.$slider
		});
	}
}
