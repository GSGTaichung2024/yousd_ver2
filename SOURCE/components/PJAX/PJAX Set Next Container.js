function PJAXSetNextContainer(data, cancelAnimation = false, scrollToTop = false) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			tl = new gsap.timeline();

		if (cancelAnimation && $nextMasthead.length) {
			$nextMasthead.attr('data-arts-os-animation', 'animated');

			if ($('.js-clone.js-transition-img').length) {
				$nextMasthead.find('.js-transition-img').addClass('js-transition-animated');
			}

			if ($('.js-clone.js-transition-heading').length) {
				$nextMasthead.find('.js-transition-heading').addClass('js-transition-animated');
			}
			$nextMasthead.find('.js-transition-bg').addClass('js-transition-animated');
		}

		tl
			.set($nextContainer, {
				autoAlpha: 0,
			})
			.set($nextContainer, {
				delay: 0.1,
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				zIndex: 300,
				onComplete: () => {

					// Scroll at the page beginning
					if (scrollToTop) {
						Scroll.scrollToTop();
					}
				}
			})
			.add(() => {
				setTimeout(() => {
					resolve(true);
				}, 100);
			});
	});
}
