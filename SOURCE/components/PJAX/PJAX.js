class PJAX extends BaseComponent {
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
		/**
		 * Don't save scroll position
		 * after AJAX transition
		 */
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
	}

	run() {
		barba.init({
			timeout: 10000,
			cacheIgnore: window.Modernizr.touchevents ? true : false, // don't grow cache on mobiles
			// don't trigger barba for links outside wrapper
			prevent: ({
				el
			}) => {

				let
					$el = $(el),
					url = $el.attr('href'),
					customRules = sanitizeSelector(window.kinsey.theme.ajax.preventRules),
					exludeRules = [
						'.no-ajax',
						'.no-ajax a',
						'.js-gallery a', // any links in theme galleries
					];

				if (url === '#') { // dummy link
					return true;
				}

				// page anchor
				if ($el.is('[href*="#"]') && window.location.href === url.substring(0, url.indexOf('#'))) {
					return true;
				}

				// page anchor
				if ($el.is('[href^="#"]')) {
					return true;
				}

				// clicked on element outside barba wrapper
				if ($el.closest(window.$barbaWrapper).length < 1) {
					return true;
				}

				// custom rules from WordPress Customizer
				if (customRules) {
					exludeRules = [...exludeRules, ...customRules.split(',')];
					exludeRules = [...new Set(exludeRules)];
				}

				// check against array of rules to prevent
				return $el.is(exludeRules.join(','));

			},
			// custom transitions
			transitions: [
				PJAXTransitionAutoScrollNext,
				PJAXTransitionGeneral,
				PJAXTransitionOverlayMenu,
			],

		});
	}
}
