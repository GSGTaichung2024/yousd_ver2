class SectionFixedReveal extends BaseComponent {
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
		this.$spacer = this.$target.parent('.js-fixed-reveal-spacer');
		this.startAnimationOffset = this.$target.data('arts-fixed-reveal-from') || '-30vh';
		this.startAnimationOpacity = this.$target.data('arts-fixed-reveal-from-opacity') === undefined ? 1 : this.$target.data('arts-fixed-reveal-from-opacity');
		this.disabledAtBreakpoint = this.$target.data('arts-fixed-reveal-disabled-at');
		this.timeline = new gsap.timeline();
		this.scrollTrigger = null;
	}

	run() {
		this._createWrapper();
		this._bindEvents();

		if (!this._isCurrentlyDisabled()) {
			this._animate();
		}
	}

	_bindEvents() {
		window.$window
			// re-create everything
			.on(getResponsiveResizeEvent(), debounce(() => {
				this._createWrapper();

				if (!this.timeline && !this._isCurrentlyDisabled()) {
					this._animate();
				}

				if (this._isCurrentlyDisabled()) {
					if (this.scrollTrigger) {
						this.scrollTrigger.disable();
					}
					gsap.set(this.$target, {
						clearProps: 'all'
					});
				} else {
					if (this.scrollTrigger) {
						this.scrollTrigger.enable();
					}
				}
			}, 250))
			// refresh ST
			.on('arts/scrolltrigger/update', (e) => {
				if (this.scrollTrigger && e.detail && e.detail.target === 'fixed-reveal') {
					this.scrollTrigger.refresh(e.detail.immediate);
				}
			});
	}

	_isCurrentlyDisabled() {
		return window.Modernizr.mq(`(${this.disabledAtBreakpoint})`) || window.innerHeight < this._getHeight();
	}

	_createWrapper() {
		if (!this.$spacer || !this.$spacer.length) {
			this.$target.wrap('<div class="js-fixed-reveal-spacer"></div>');
			this.$spacer = this.$target.parent('.js-fixed-reveal-spacer');
		}

		gsap.set(this.$target, {
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0
		});

		gsap.set(this.$spacer, {
			height: () => this._getHeight(),
			position: 'relative',
			background: this.$target.css('background-color'),
			overflow: 'hidden',
			zIndex: this.$target.css('z-index')
		});
	}

	_getHeight() {
		return this.$target.outerHeight();
	}

	_animate() {
		if (this.scrollTrigger && typeof this.scrollTrigger.kill === 'function') {
			this.scrollTrigger.kill();
		}

		this.timeline.clear().fromTo(this.$target, {
			y: this.startAnimationOffset,
			ease: 'none',
			autoAlpha: this.startAnimationOpacity
		}, {
			y: '0vh',
			autoAlpha: 1,
			ease: 'none'
		});

		this.scrollTrigger = ScrollTrigger.create({
			animation: this.timeline,
			end: () => `bottom bottom`,
			start: () => `top bottom`,
			trigger: this.$spacer,
			scrub: true,
			invalidateOnRefresh: true
		});
	}
}
