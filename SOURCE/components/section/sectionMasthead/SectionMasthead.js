class SectionMasthead extends BaseComponent {
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
		this.$inner = this.$target.find('.section-masthead__inner');
		this.$maskReveal = this.$target.find('.mask-reveal');
		this.$heading = this.$target.find('.section-masthead__heading');
		this.$subheading = this.$target.find('.section-masthead__subheading');
		this.$background = this.$target.find('.section__bg');
		this.$divider = this.$target.find('.section-masthead__meta-divider');
		this.$button = this.$target.find('.section-masthead__button');

		if (this.$target.hasClass('section-masthead_fixed')) {
			this._fixMasthead();
		}
	}

	animateIn() {
		const
			$heading = this.$heading.not('.js-transition-animated'),
			$maskReveal = this.$maskReveal.not('.js-transition-animated'),
			$background = this.$background.not('.js-transition-animated');

		this.timeline
			.animateText($heading, {
				duration: 1.2,
				stagger: {
					amount: 0.3,
					from: 'left'
				}
			})
			.add([
				gsap.effects.animateText(this.$subheading, {
					// duration: 0.6,
				}),
				gsap.effects.animateHeadline(this.$divider, {
					// duration: 0.6,
				})
			], $heading.length ? '-=0.8' : '0')
			.add([
				gsap.effects.animateMask($maskReveal, {
					direction: 'down'
				}),
				gsap.effects.animateScale($background, {
					direction: 'down'
				})
			], '-=1.2');

	}

	animateOut() {
		this.timelineOut.add([
			gsap.effects.hideText(this.$target, {
				stagger: 0
			}),
			gsap.effects.hideHeadline(this.$divider),
			gsap.effects.hideMask(this.$maskReveal),
			gsap.effects.hideScale(this.$background)
		], '0');

	}

	_getFixedScrollingDistance() {
		if (typeof window.SB !== 'undefined') {
			return window.SB.containerEl.scrollHeight;
		} else {
			return Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			);
		}
	}

	_fixMasthead() {
		if (typeof window.SB === 'undefined') {

			ScrollTrigger.create({
				pin: true,
				pinType: 'fixed',
				pinSpacing: false,
				invalidateOnRefresh: true,
				anticipatePin: 1,
				trigger: this.$target,
				scrub: true,
				start: () => 'top top',
				end: () => this._getFixedScrollingDistance(),
			});
		}

		ScrollTrigger.create({
			animation: gsap.fromTo(this.$inner, {
				autoAlpha: 1,
				y: 0
			}, {
				autoAlpha: 0,
				y: '-10%'
			}),
			start: 'bottom bottom',
			end: 'bottom+=30% bottom',
			scrub: true,
			trigger: this.$inner,
			invalidateOnRefresh: true
		});
	}
}
