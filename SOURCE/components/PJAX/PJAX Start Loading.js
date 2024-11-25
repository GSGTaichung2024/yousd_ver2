function PJAXStartLoading(data) {
	return new Promise((resolve) => {
		// Transition started event
		window.dispatchEvent(new CustomEvent('arts/barba/transition/start'));

		Scroll.lock(true);

		$('.menu').addClass('menu_disabled');
		window.$barbaWrapper.addClass('cursor-progress is-ajax-loading');
		window.$document.off('resize click');
		window.$window.off('resize click orientationchange');

		// Set loading spinner
		if (window.$spinner && window.$spinner.length) {
			gsap.to(window.$spinner, 0.6, {
				autoAlpha: 1
			});
		}

		// Set loading cursor follower
		if (window.$cursor && window.$cursor.length) {
			window.$cursor.trigger('startLoading');
		}

		resolve(true);
	});
}
