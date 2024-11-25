class SmoothScroll {
	constructor({
		target = $('.js-smooth-scroll'),
		adminBar,
		absoluteElements,
		fixedElements
	}) {
		this.$target = target;
		this.$WPadminBar = adminBar;
		this.$absoluteElements = absoluteElements;
		this.$fixedElements = fixedElements;
		this.run();
	}

	run() {

		if (
			typeof window.Scrollbar === 'undefined' ||
			!window.kinsey.theme.smoothScroll.enabled ||
			!this.$target ||
			!this.$target.length ||
			typeof elementor !== 'undefined' || // don't launch in Elementor edit mode
			window.kinsey.theme.isElementorEditorActive || // don't launch in Elementor edit mode
			(window.Modernizr.touchevents && !this.$target.hasClass('js-smooth-scroll_enable-mobile')) || // don't launch on touch devices
			window.Modernizr.touchevents
		) {
			this._handleAnchorsScrolling();
			window.$html.removeClass('smoothscroll');
			return false;
		}

		this._registerPlugins();
		this.$target.addClass('smooth-scroll');
		window.$html.addClass('smoothscroll');

		window.SB = window.Scrollbar.init(this.$target[0], window.kinsey.theme.smoothScroll);

		this._bindEvents();

		try {
			this._handleAnchorsScrolling();
		} catch (error) {
			console.error(`Smooth anchor scrolling: Unrecognized selector expression: ${error}`)
		}

		if (typeof this.$absoluteElements !== 'undefined' && this.$absoluteElements.length) {
			this._correctAbsolutePositionElements();
		}

		if (typeof this.$fixedElements !== 'undefined' && this.$fixedElements.length) {
			this._correctFixedPositionElements();
		}

		// Immediately focus SB container so it become accessible for keyboard navigation
		window.SB.containerEl.focus();
	}

	_registerPlugins() {

		if (typeof NativeScrollEventPlugin !== 'undefined') {
			window.Scrollbar.use(NativeScrollEventPlugin);
		}

		if (typeof ProxyGSAPScrollTriggerPlugin !== 'undefined') {
			window.Scrollbar.use(ProxyGSAPScrollTriggerPlugin);
		}

		if (typeof DisableScrollPlugin !== 'undefined') {
			window.Scrollbar.use(DisableScrollPlugin);
		}

		if (window.kinsey.theme.smoothScroll.plugins.edgeEasing && typeof SoftscrollPlugin !== 'undefined') {
			window.Scrollbar.use(SoftscrollPlugin);
		}
	}

	_bindEvents() {
		// Destroy instance after page transition
		window.$window.one('arts/barba/transition/init/before', () => {
			window.SB.destroy();
		});
	}

	_handleAnchorsScrolling() {
		this.$target.find('a[href*="#"]:not([href="#"]):not(.post__comments a)').each(function () {
			const
				$current = $(this),
				url = $current.attr('href'),
				filteredUrl = url.substring(url.indexOf('#'));

			if (filteredUrl.length) {
				const $el = $(filteredUrl);

				if ($el.length) {
					$current.on('click', function (e) {
						e.preventDefault();
						Scroll.scrollTo({
							x: 0,
							y: $el.offset().top,
							duration: 0.8
						});
					});
				}
			}
		});
	}

	_correctAbsolutePositionElements() {
		const barHeight = (this.$WPadminBar.length && this.$WPadminBar.height()) || 0;

		gsap.to(this.$absoluteElements, {
			y: 0,
			duration: 0.3
		});

		this.$absoluteElements.each(function () {
			const $el = $(this);

			window.SB.addListener((scrollbar) => {
				gsap.set($el, {
					y: -scrollbar.offset.y + barHeight
				});
			});
		});
	}

	_correctFixedPositionElements() {
		const barHeight = (this.$WPadminBar.length && this.$WPadminBar.height()) || 0;

		gsap.to(this.$fixedElements, {
			y: 0,
			duration: 0.3
		});

		this.$fixedElements.each(function () {
			const $el = $(this);

			window.SB.addListener((scrollbar) => {
				gsap.set($el, {
					y: scrollbar.offset.y - barHeight
				});
			});
		});
	}
}
