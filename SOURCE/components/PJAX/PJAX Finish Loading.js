function PJAXFinishLoading(data) {
	return new Promise((resolve) => {
		// Transition ended event
		window.dispatchEvent(new CustomEvent('arts/barba/transition/end'));

		// Hide spinner
		if (typeof window.$spinner !== 'undefined' && window.$spinner.length) {
			gsap.to(window.$spinner, 0.6, {
				autoAlpha: 0
			});
		}

		// Hide loading cursor follower
		if (window.$cursor && window.$cursor.length) {
			window.$cursor.trigger('finishLoading');
		}

		// remove any cloned elements
		$('.js-clone').remove();

		ScrollTrigger.refresh(true);

		setTimeout(() => {

			Animations.enableAll();

			// unlock scroll
			Scroll.lock(false);


			window.$barbaWrapper.removeClass('cursor-progress is-ajax-loading pointer-events-none');
			$('.menu').removeClass('menu_disabled');

			// refresh animation triggers
			// for Waypoints library
			if (typeof Waypoint !== 'undefined') {
				Waypoint.refreshAll();
			}

		}, 100);

		// scroll to anchor from URL hash
		Scroll.scrollToAnchorFromHash();

		resolve(true);
	});
}
