class SectionHorizontalScroll extends BaseComponent {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});

		this.listenerAdded = false;
	}

	set() {
		this.scrollingType = this.$target.data('arts-horizontal-scroll-type') || 'modular';
		this.scrollingToggleClass = this.$target.data('arts-horizontal-scroll-toggle-class') || false;
		this.toggleClass = this.scrollingToggleClass.length && this.scrollingToggleClass !== 'false' ? this.scrollingToggleClass : false;
		this.triggers = {
			pin: null,
			sections: []
		};
		this.sections = [];
		this.savedSBDamping;
		this.$wrapper = this.$target.find('[data-arts-horizontal-scroll="wrapper"]');
		this.wrapper = this.$wrapper.get(0);
		this.$sections = this.$target.find('[data-arts-horizontal-scroll="section"]');
	}

	init() {
		this._init();
		this._initLazyImages();
		this._bindEvents();
	}

	_isEnabled() {
		return !window.Modernizr.touchevents;
	}

	_initLazyImages() {
		const
			$lazyImages = this.$wrapper.find('.lazy:not(.lazy_loaded) img[data-src]'),
			$lazyBackgrounds = this.$wrapper.find('.lazy-bg:not(.lazy_loaded)[data-src]');

		// set lazy loading images in horizontal scrolling section
		if ($lazyImages.length) {
			this.lazyImages = new LazyLoad({
				images: $lazyImages,
				appendScroll: this._getLazyScrollingContainer(),
				threshold: 0
			});

			window.$window.one('arts/barba/transition/start', this.lazyImages.destroy);

			ScrollTrigger.create({
				trigger: this.$target,
				once: true,
				invalidateOnRefresh: true,
				start: () => `top bottom`,
				onEnter: () => {
					this.lazyImages.lazyImages.update();
				}
			});
		}
		// set lazy loading backgrounds
		if ($lazyBackgrounds.length) {
			this.lazyBackgrounds = new LazyLoad({
				backgrounds: $lazyBackgrounds,
				appendScroll: this._getLazyScrollingContainer(),
				threshold: 0
			});

			window.$window.one('arts/barba/transition/start', this.lazyBackgrounds.destroy);

			ScrollTrigger.create({
				trigger: this.$target,
				once: true,
				invalidateOnRefresh: true,
				start: () => `top bottom`,
				onEnter: () => {
					this.lazyBackgrounds.lazyBackgrounds.update();
				}
			});
		}
	}

	_init() {
		this._clearContainer();
		this._calculateContainer();
		this._setWrapperHeight();
		this._handleWrapper();

		// In 'modular' scrolling mode the actual scrolling
		// is done with section-by-section translation
		if (this.scrollingType === 'modular') {
			this._setSectionTriggerData();
			this._createSectionsTriggers();
		}
		this._refreshScene();
	}

	_isSmoothScrollingEnabled() {
		return typeof window.SB !== 'undefined' && window.Modernizr.mq('(min-width: 992px)');
	}

	_calculateContainer() {
		this.scrollWidth = this._calculateSectionsTotalWidth(); // cache scroll width
		this.offsetLeft = this.target.offsetLeft; // cache offset width
		this.offsetWidth = this.target.offsetWidth; // cache offset width
		this.offsetHeight = this.target.offsetHeight; // cache offset height
		this.maxScrollWidth = Math.max(0, this.scrollWidth - this.offsetWidth);
		this.screenViews = this.scrollWidth / this.offsetWidth;
	}

	_calculateSectionsTotalWidth() {
		let totalWidth = 0;

		this.$sections.each(function () {
			totalWidth += this.offsetWidth;
		});

		return totalWidth;
	}

	_clearContainer() {
		if (this.$sections.length) {
			gsap.set(this.$sections, {
				clearProps: 'transform'
			});
		}

		if (this.$wrapper.length) {
			gsap.set(this.$wrapper, {
				clearProps: 'transform,height'
			});
		}
	}

	_saveSmoothScrollbarDamping() {
		if (this._isSmoothScrollingEnabled() && !this.savedSBDamping) {
			this.savedSBDamping = window.SB.options.damping;
			window.SB.update();
		}
	}

	_restoreSmoothScrollbarDamping() {
		if (this._isSmoothScrollingEnabled()) {
			window.SB.options.damping = this.savedSBDamping;
			window.SB.update();
		}
	}

	_bindEvents() {
		const self = this;

		window.$window.on('resize', debounce(() => {
			self._clearContainer();
			self._calculateContainer();
			self._setWrapperHeight();
			self._setSectionTriggerData();
			self._refreshScene();
		}, 250));
	}

	_getLazyScrollingContainer() {
		if (window.Modernizr.mq('(min-width: 992px)')) {
			return this.$wrapper;
		}

		return window;
	}

	_handleWrapper() {
		ScrollTrigger.matchMedia({
			'(min-width: 992px)': () => {
				const
					animation = new gsap.timeline(),
					scrollEvent = new CustomEvent('scroll');

				if (this._isEnabled()) {
					// In 'wrapper' scrolling we need to translate the whole container
					if (this.scrollingType === 'wrapper') {
						animation
							.to(this.$wrapper, {
								x: () => `-${this.maxScrollWidth}`,
								y: () => this._isSmoothScrollingEnabled() ? this.maxScrollWidth : 0,
								duration: 1,
								ease: 'none',
							})
					}

					ScrollTrigger.create({
						animation,
						trigger: this.$target,
						pin: this._isSmoothScrollingEnabled() ? false : this.$wrapper,
						pinSpacing: 'margin',
						pinType: 'fixed',
						scrub: true,
						toggleClass: this.scrollingType === 'modular' ? false : {
							targets: this.wrapper,
							className: this.toggleClass
						},
						invalidateOnRefresh: true,
						anticipatePin: 1,
						refreshPriority: 100,
						onToggle: (instance) => {
							if (this._compareVersion(gsap.version, '3.7.1') <= 0) {
								if (instance.isActive) {
									this._enableScrollMomentum(false);
								} else {
									this._enableScrollMomentum(true);
								}
							}
						},
						onUpdate: () => {
							this.wrapper.dispatchEvent(scrollEvent);
						},
						start: () => `top top`,
						end: () => `top+=${this.maxScrollWidth} top`,
					});
				} else { // only emit scrolling events, don't pin
					ScrollTrigger.create({
						trigger: this.$target,
						scrub: true,
						invalidateOnRefresh: true,
						refreshPriority: 100,
						onUpdate: () => {
							this.wrapper.dispatchEvent(scrollEvent);
						},
						start: () => `top top`,
						end: () => `top+=${this.maxScrollWidth} top`,
					});
				}
			}
		});
	}

	_enableScrollMomentum(enable = true) {
		if (enable === true) {
			this._restoreSmoothScrollbarDamping();
		} else {
			if (this._isSmoothScrollingEnabled()) {
				this._saveSmoothScrollbarDamping();
				window.SB.setMomentum(0, 0);
				window.SB.options.damping = 10;
			}
		}
	}

	_setWrapperHeight() {
		if (this.$wrapper.length && this._isSmoothScrollingEnabled()) {
			gsap.set(this.$wrapper, {
				height: () => this.wrapper.scrollWidth - (this.target.offsetWidth - this.target.offsetHeight),
			});
		} else {
			gsap.set(this.$wrapper, {
				clearProps: 'height'
			});
		}
	}

	_setSectionTriggerData() {
		const self = this;
		const isSmoothScrollingEnabled = this._isSmoothScrollingEnabled();

		if (this.$sections.length) {
			this.$sections.each(function (index) {
				const
					$this = $(this),
					left = this.offsetLeft,
					width = this.offsetWidth,
					right = left + width,
					offsetFromScreenEnd = (self.maxScrollWidth > self.offsetWidth) ? left - self.offsetWidth - (isSmoothScrollingEnabled ? self.offsetLeft : 0) : 0;

				let
					fromX = 0,
					fromY = 0,
					toX = 0,
					toY = 0,
					start,
					end,
					offsetLeft = 0;

				let position = 'scrollScreen'; // startScreen scrollScreen endScreen

				if (left <= self.target.offsetWidth) {
					position = 'startScreen';
				}

				if (right > self.target.offsetWidth * (self.screenViews - 1)) {
					position = 'endScreen';
				}

				if (isSmoothScrollingEnabled) {
					offsetLeft = self.target.offsetLeft;
				}

				switch (position) {
					case 'startScreen':
						fromX = 0;
						fromY = 0;
						toX = -right + offsetLeft;
						toY = isSmoothScrollingEnabled ? right - offsetLeft : -offsetLeft;
						start = `top top`;
						end = `top+=${right - offsetLeft} top`;

						// immediately add "in-view" class for the sections
						// which are in view
						if (self.toggleClass) {
							$this.addClass(self.toggleClass);
						}
						break;
					case 'endScreen':
						fromX = -offsetFromScreenEnd;
						fromY = isSmoothScrollingEnabled ? offsetFromScreenEnd : 0;
						toX = -self.maxScrollWidth;
						toY = isSmoothScrollingEnabled ? self.maxScrollWidth : -offsetLeft;
						start = `top+=${offsetFromScreenEnd} top`;
						end = `top+=${self.maxScrollWidth} top`;
						break;
					default:
						fromX = -offsetFromScreenEnd;
						fromY = isSmoothScrollingEnabled ? offsetFromScreenEnd : 0;
						toX = -right + offsetLeft;
						toY = isSmoothScrollingEnabled ? right - self.target.offsetLeft : -offsetLeft;
						start = `top+=${offsetFromScreenEnd} top`;
						end = `top+=${right - offsetLeft} top`;
						break;

				}

				self.sections[index] = {
					left,
					width,
					position,
					fromX,
					fromY,
					toX,
					toY,
					start,
					end
				};
			});
		}
	}

	_createSectionsTriggers() {
		const self = this;

		if (this.$sections.length) {
			ScrollTrigger.matchMedia({
				'(min-width: 992px)': () => {
					if (self._isEnabled()) {
						this.$sections.each(function (index) {
							const tl = new gsap.timeline();

							tl.fromTo(this, {
								x: () => self.sections[index].fromX,
								y: () => self.sections[index].fromY,
							}, {
								x: () => self.sections[index].toX,
								y: () => self.sections[index].toY,
								ease: 'none',
								duration: 1,
								scrollTrigger: {
									trigger: self.$target,
									scrub: true,
									invalidateOnRefresh: true,
									start: () => self.sections[index].start,
									end: () => self.sections[index].end,
									toggleClass: {
										targets: this,
										className: self.toggleClass
									},
								}
							});
						});
					}
				}
			});
		}
	}

	_refreshScene() {
		ScrollTrigger.refresh();

		if (this._isSmoothScrollingEnabled()) {
			window.SB.update();
		}
	}

	_compareVersion(e, t) {
		if ("string" != typeof e) return !1;
		if ("string" != typeof t) return !1;
		e = e.split("."), t = t.split(".");
		const a = Math.min(e.length, t.length);
		for (let n = 0; n < a; ++n) {
			if (e[n] = parseInt(e[n], 10), t[n] = parseInt(t[n], 10), e[n] > t[n]) return 1;
			if (e[n] < t[n]) return -1
		}
		return e.length == t.length ? 0 : e.length < t.length ? -1 : 1
	}
}
