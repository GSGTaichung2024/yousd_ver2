class SectionNavProjects extends BaseComponent {
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
		this.$progressUnderline = this.$target.find('.section-nav-projects__progress-underline');
		this.$labelNext = this.$target.find('.section-nav-projects__label_next');
		this.$inner = this.$target.find('.section-nav-projects__inner').eq(0);
		this.$spacer = this.$target.find('.section-nav-projects__spacer');
		this.$labelScroll = this.$target.find('.section-nav-projects__label_scroll');
		this.$wrapper = this.$target.parent('.js-fixed-reveal-spacer');
		this.$header = this.$target.find('.section-nav-projects__header, .section-nav-projects__next-image');
		this.$heading = this.$target.find('.section-nav-projects__heading');
		this.$trigger = this.$wrapper.length ? this.$wrapper : this.$target;
		this.$link = this.$target.find('.section-nav-projects__link');
		this.url = this.$link.attr('href');
		this.backgroundSizeHeight = '2px';
		this.backgroundSizeWidthCurrent = '0%';
		this.headingColor = '';
		this.stSpacer = null;
		this.stMain = null;
		this.stLabels = null;
		this.stPrefetch = null;
		this.spacerHeight = 0;
		this.timeline = new gsap.timeline();
		this.prefetchEnabled = window.kinsey.theme.ajax.enabled && this.$target.attr('data-arts-prefetch-enabled');
		this.disabledAtBreakpoint = this.$target.data('arts-fixed-reveal-disabled-at');
		this.startAnimationOpacity = this.$target.data('arts-fixed-reveal-from-opacity') === undefined ? 1 : this.$target.data('arts-fixed-reveal-from-opacity');

		if (this.$heading.length) {
			this.headingColor = this.$heading.css('color');
		}

		if (this.$progressUnderline.length) {
			this.backgroundSizeHeight = this.$progressUnderline.css('background-size').split(' ')[1];
		}
	}

	run() {
		this._animateProgressLine();

		if (this.$spacer.length && this._isInnerWithSpacerAnimationEnabled()) {
			this._getSpacerProperties();
			this._animateInnerWithSpacer();
		}

		if (this.prefetchEnabled) {
			this._prefetchHandler();
		}

		this._bindEvents();
	}

	_bindEvents() {
		this.$header.off('click').on('click', (e) => {
			if (window.kinsey.theme.ajax.enabled) {
				e.preventDefault();

				Scroll.scrollTo({
					y: this.$trigger,
					offsetY: -this.$trigger.height()
				});
			}
		});

		window.$window
			.one('arts/barba/transition/start', () => {
				if (this.stMain) {
					this.stMain.kill();
				}
				if (this.stLabels) {
					this.stLabels.kill();
				}
				if (this.stPrefetch) {
					this.stPrefetch.kill();
				}
				this.timeline.kill();
			})
			.on(getResponsiveResizeEvent(), debounce(() => {
				if (this.stSpacer) {
					this._getSpacerProperties();
					this.stSpacer.refresh(true);
				}
				if (this.stMain) {
					this.stMain.refresh(true);
				}

				if (this.stLabels) {
					this.stLabels.refresh(true);
				}
			}, 250));
	}

	_getSpacerProperties() {
		this.spacerHeight = this.$spacer.height();
	}

	_isInnerWithSpacerAnimationEnabled() {
		return this.$spacer.is(':visible') && !window.Modernizr.mq(`(${this.disabledAtBreakpoint})`);
	}

	_animateInnerWithSpacer() {
		const tl = new gsap.timeline();

		tl.fromTo(this.$inner, {
			y: () => `-${this.spacerHeight}`,
			autoAlpha: () => this.startAnimationOpacity,
		}, {
			y: () => `${this.spacerHeight}`,
			ease: 'none',
			autoAlpha: 1
		});

		this.stSpacer = ScrollTrigger.create({
			animation: tl,
			start: () => 'top bottom',
			end: () => 'bottom bottom',
			invalidateOnRefresh: true,
			scrub: true,
			trigger: this.$trigger,
		});
	}

	_animateProgressLine() {
		this.stLabels;
		this.stMain = ScrollTrigger.create({
			animation: this.timeline,
			trigger: this.$trigger,
			start: () => 'top+=50 center',
			end: () => 'bottom-=50 bottom',
			invalidateOnRefresh: true,
			scrub: true,
			onLeave: () => {
				if (this.stLabels) {
					this.stLabels.kill();
					this.stMain.kill();
					this.timeline.kill();
					this.timeline.progress(1);

					Scroll.lock(true);
					Scroll.stop();

					if (this.$labelNext.length) {
						gsap.to(this.$labelNext, {
							autoAlpha: 0,
							y: '-100%',
							duration: 0.3
						});
					}

					if (this.$labelScroll.length) {
						gsap.to(this.$labelScroll, {
							autoAlpha: 0,
							y: '-100%',
							duration: 0.3
						});
					}

					gsap.fromTo(this.$progressUnderline, {
						backgroundPosition: '100% 100%',
					}, {
						ease: 'expo.inOut',
						duration: 0.2,
						delay: 0.3,
						backgroundSize: `0% ${this.backgroundSizeHeight}`,
						onComplete: () => {
							this.$header.addClass('pointer-events-none').off('click');

							this.$link.get(0).click();
						}
					});
				}
			}
		});

		this.timeline.to(this.$progressUnderline, {
			backgroundSize: `100% ${this.backgroundSizeHeight}`,
			ease: 'none',
			duration: 1
		});

		if (this.$labelNext.length && this.$labelScroll.length) {
			this.stLabels = ScrollTrigger.create({
				trigger: this.$trigger,
				start: () => 'top+=50 center',
				end: () => 'bottom-=20 bottom',
				invalidateOnRefresh: true,
				onEnter: () => {
					gsap.to(this.$labelNext, {
						autoAlpha: 0,
						y: '-100%',
						duration: 0.3,
					});

					gsap.fromTo(this.$labelScroll, {
						autoAlpha: 0,
						y: '100%',
						clearProps: 'color'
					}, {
						autoAlpha: 1,
						y: '0%',
						duration: 0.3,
						color: this.headingColor
					});
				},
				onLeaveBack: () => {
					gsap.fromTo(this.$labelNext, {
						autoAlpha: 0,
						y: '100%'
					}, {
						autoAlpha: 1,
						y: '0%',
						duration: 0.3
					});

					gsap.to(this.$labelScroll, {
						autoAlpha: 0,
						y: '-100%',
						duration: 0.3,
						clearProps: 'color'
					});
				}
			});
		}
	}

	_prefetchHandler() {
		this.stPrefetch = ScrollTrigger.create({
			trigger: window.$body,
			start: 'top+=1 top',
			once: true,
			onEnter: () => {
				barba.prefetch(this.url);
			}
		});
	}
}
