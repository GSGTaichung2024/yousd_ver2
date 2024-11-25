class LazyLoad {
	constructor({
		images,
		backgrounds,
		setPaddingBottom = true,
		appendScroll = window
	}) {
		this.$images = images;
		this.$backgrounds = backgrounds;
		this.lazyImages;
		this.lazyBackgrounds;
		this.appendScroll = appendScroll;

		if (this.$images && this.$images.length) {
			if (setPaddingBottom) {
				this.setPaddingBottom();
			}

			this.lazyImages = this.loadImages({
				target: this.$images
			});
		}

		if (this.$backgrounds && this.$backgrounds.length) {
			this.lazyBackgrounds = this.loadBackgrounds({
				target: this.$backgrounds
			});
		}
	}

	setPaddingBottom() {
		this.$images.each(function () {
			const $el = $(this),
				$elParent = $el.parent('.lazy-bg, .lazy'),
				$parentWrapper = $elParent.parent('.lazy-wrapper'),
				elWidth = $el.attr('width') || 0,
				elHeight = $el.attr('height') || 0,
				elPB = parseFloat((elHeight / elWidth) * 100); // padding-bottom hack

			// we need both width and height of element
			// to calculate proper value for "padding-bottom" hack
			if (!elWidth || !elHeight) {
				return;
			}

			// position image absolutely
			gsap.set($el, {
				position: 'absolute',
				top: 0,
				left: 0,
			});

			// set padding-bottom to the parent element so it will
			// create the needed space for the image
			gsap.set($elParent, {
				position: 'relative',
				overflow: 'hidden',
				paddingBottom: elPB + '%',
				height: 0
			});

			if ($parentWrapper.length && elWidth) {
				$parentWrapper.css({
					maxWidth: parseFloat(elWidth)
				});
			}
		});
	}

	loadBackgrounds({
		target,
		callback
	}) {
		if (target && target.length) {
			const instance = target.Lazy({
				appendScroll: this.appendScroll,
				threshold: 800,
				chainable: false,
				afterLoad: (el) => {
					$(el).closest('.lazy, .lazy-bg').addClass('lazy_loaded');

					if (typeof callback === 'function') {
						callback();
					}
				}
			});

			window.$window
				.on('arts/barba/transition/start', () => {
					instance.destroy();
				})
				.on('arts/barba/transition/end', () => {
					setTimeout(() => {
						instance.update();
					}, 50);
				});
			setTimeout(() => {
				instance.update();
			}, 50);

			return instance;
		}
	}

	loadImages({
		target,
		callback
	}) {
		if (target && target.length) {
			const instance = target.Lazy({
				appendScroll: this.appendScroll,
				threshold: 800,
				chainable: false,
				afterLoad: (el) => {
					$(el).closest('.lazy, .lazy-bg').addClass('lazy_loaded');

					if (typeof callback === 'function') {
						callback();
					}
				}
			});

			window.$window
				.on('arts/barba/transition/start', () => {
					instance.destroy();
				})
				.on('arts/barba/transition/end', () => {
					setTimeout(() => {
						instance.update();
					}, 50);
				});
			setTimeout(() => {
				instance.update();
			}, 50);

			return instance;
		}
	}
}
