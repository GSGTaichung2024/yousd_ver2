class BaseComponent {

	constructor({
		target,
		scope = window.$document,
	}) {
		this.$scope = scope;
		this.$target = target;
		this.target = this.$target.get(0);
		this.$el = this.$target;
		this.el = this.$el.get(0);

		this.prepare();
	}

	prepare() {
		this
			.mount()
			.then(() => {
				this.set();
				this.run();
			});
	}

	set() {

	}

	init() {

	}

	_loadAnimations() {
		this.createAnimationScene({
			$el: this.$target
		});
		this.animateIn();
		this.animateInBatch();
	}

	run() {

		if (this.hasAnimationScene()) {
			// animate element out on transition start
			window.$window.one('arts/barba/transition/start', () => {
				// only currently visible elements
				if (this.$target.is(':in-viewport')) {
					this.animateOut();
				}
			});
		}

		if (this.hasInnerAnimationScenes()) {
			window.$window.one('arts/barba/transition/start', () => {
				// only currently visible elements
				if (this.$target.is(':in-viewport')) {
					this.animateOutBatch();
				}
			});
		}

		// * Active preloader
		// wait until preloader is ended
		if (window.$pagePreloader.is(':visible')) {
			window.$window.one('arts/preloader/end', () => {
				this._loadAnimations();
				this.init();
			});
		} else if (!window.kinsey.theme.isFirstLoad) { // * AJAX transition – wait until transition end
			window.$window.one('arts/barba/transition/end', () => {
				this._loadAnimations();
				this.init();
			});
		} else { // * No preloader and no transition
			this._loadAnimations();
			this.init();
		}
	}

	mount() {
		return new Promise((resolve) => {
			const
				$lazyImages = this.$target.find('.lazy img[data-src]:not(.swiper-lazy):not([data-arts-horizontal-scroll="wrapper"] .lazy img [data-src])'),
				$lazyBackgrounds = this.$target.find('.lazy-bg[data-src]:not(.swiper-lazy):not([data-arts-horizontal-scroll="wrapper"] .lazy-bg[data-src])'),
				$parallaxElements = this.$target.filter('.js-arts-parallax').add(this.$target.find('.js-arts-parallax'));

			// set lazy loading images
			if ($lazyImages.length) {
				this.lazyImages = new LazyLoad({
					images: $lazyImages
				});

				window.$window.one('arts/barba/transition/start', this.lazyImages.destroy);
			}

			// set lazy loading backgrounds
			if ($lazyBackgrounds.length) {
				this.lazyBackgrounds = new LazyLoad({
					backgrounds: $lazyBackgrounds
				});

				window.$window.one('arts/barba/transition/start', this.lazyBackgrounds.destroy);
			}

			// set parallax elements
			if ($parallaxElements.length) {
				this.parallax = $parallaxElements.artsParallax();
			}

			// prepare all the texts to split
			// wait for the fonts to load first
			document.fonts.ready.then(() => {
				const t = this.$target
					.find('.js-arts-split-text')
					.artsSplitText()
					.find('.arts-split-text__line')
					.filter(function () {
						const
							$this = $(this),
							display = $this.css('display');

						return display === 'inline-block' || display === 'inline-flex';
					});

				// split lines that became inline-block with a divider
				$(`<div class="w-100"></div>`).insertAfter(t);

				resolve(true);
			});
		});
	}

	hasAnimationScene() {
		const attr = this.target.hasAttribute('data-arts-os-animation');
		return attr && this.$target.attr('data-arts-os-animation') !== 'false';
	}

	hasInnerAnimationScenes() {
		return this.$target.find('[data-arts-os-animation]').length;
	}

	createAnimationScene({
		$el = this.$target,
		timeline = false,
		scrub = false,
		once = true,
	}) {
		const timeScale = parseFloat(window.kinsey.theme.animations.timeScale.onScrollReveal) || 1;

		// create a timeline
		this.timeline = timeline || new gsap.timeline({
			onStart: () => {
				if ($el.attr('data-arts-os-animation')) {
					$el.attr('data-arts-os-animation', 'animated');
				}
				$el.get(0).dispatchEvent(new CustomEvent('animation/start'));
			},
			onComplete: () => {
				$el.get(0).dispatchEvent(new CustomEvent('animation/complete'));
			}
		});

		this.timeline.timeScale(timeScale);

		// ScrollTrigger animation scene
		this.scrollTrigger = ScrollTrigger.create({
			trigger: $el,
			animation: this.timeline,
			start: () => `top+=${window.kinsey.theme.animations.triggerHook * 100}% bottom`,
			scrub,
			once
		});

		// animation out timeline
		this.timelineOut = new gsap.timeline();
	}

	animateIn() {

	}

	animateInBatch() {
		if (!this.hasInnerAnimationScenes()) {
			return;
		}

		const
			self = this,
			$animations = this.$target.find('[data-arts-os-animation-name]:not(.js-transition-animated)'),
			startTrigger = this.$target.attr('data-arts-os-animation-start') || `top+=${window.kinsey.theme.animations.triggerHook * 100}% bottom`,
			stagger = this.$target.attr('data-arts-os-animation-stagger') || 0.1,
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.onScrollReveal) || 1;

		if ($animations.length) {
			self.scrollTriggerBatch = ScrollTrigger.batch($animations, {
				interval: 0.05,
				start: () => startTrigger,
				scrub: false,
				once: true,
				onEnter: (batch) => {
					const
						tl = new gsap.timeline();

					$(batch).each(function () {
						const
							$this = $(this),
							animationSet = $this.attr('data-arts-os-animation'),
							animationName = $this.attr('data-arts-os-animation-name'),
							animationParams = $this.attr('data-arts-os-animation-params') || '{}';
						let parsedParamsObj = {};

						try {
							parsedParamsObj = JSON.parse(self._prepareJSON(animationParams));
						} catch (error) {
							console.error(`${animationParams} is not a valid parameters object`);
						}

						if (parsedParamsObj && animationName && typeof gsap.effects[animationName] === 'function') {

							if (animationSet) {
								$this.attr('data-arts-os-animation', 'animated');
								this.dispatchEvent(new CustomEvent('animation/start'));
							}
							tl[animationName]($this, parsedParamsObj, batch.length === 1 || !$this.is(':visible') ? '0' : `<${stagger}`).timeScale(timeScale);
						}

					});
				}
			});
		}
	}

	animateOut() { }

	animateOutBatch() {
		const tl = new gsap.timeline();

		this.$target.find('[data-arts-os-animation-name]:in-viewport').each(function () {
			const
				$this = $(this),
				defaultParams = {
					stagger: 0,
					delay: 0,
				},
				customParams = $this.attr('data-arts-os-animation-params'),
				params = $.extend(customParams, defaultParams),
				animationName = $this.attr('data-arts-os-animation-name').replace('animate', 'hide');

			if (animationName && typeof gsap.effects[animationName] === 'function') {
				tl.add(gsap.effects[animationName]($this, params), '0');
			}
		});
	}

	animateStagger({
		target,
		params,
		stagger = 0,
		animationName
	}) {
		const tl = new gsap.timeline();

		if (animationName && typeof tl[animationName] === 'function' && target && target.length) {
			$(target).each(function (index) {
				tl[animationName](this, params ? params : {}, index === 0 ? '0' : `<${stagger}`);
			});
		}

		return tl;
	}

	_prepareJSON(strObj) {
		if (!strObj) {
			return;
		}

		let filteredStr = strObj.replace(/'/g, '"');

		return filteredStr.replace(/(\w+:)|(\w+ :)/g, function (s) {
			return '"' + s.substring(0, s.length - 1) + '":';
		});
	}

}
