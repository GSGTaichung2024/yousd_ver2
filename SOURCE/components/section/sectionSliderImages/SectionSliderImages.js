class SectionSliderImages extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider-images');
		this.$sliderImages = this.$target.find('.js-slider-images__slider');
		this.$sliderCaptions = this.$target.find('.js-slider-images__captions');
	}

	init() {
		this.slider = new SliderImages({
			parent: this.$target,
			target: this.$sliderImages,
			captions: this.$sliderCaptions
		});
	}
}
