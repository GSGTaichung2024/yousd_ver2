function PJAXAnimateCurtain(data, duration = 1.2) {
	return new Promise((resolve, reject) => {
		const
			tl = new gsap.timeline(),
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			$target = $nextMasthead.find('.section__bg'),
			$firstChild = $nextContainer.children().first(),
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.ajaxFlyingImageTransition) || 1;

		let background = $target.attr('data-background-color');

		if (!$target.length) {
			resolve(true);
			return;
		}

		if (!background) {
			background = $firstChild.css('background-color');
		}

		const {
			width,
			top
		} = $target.get(0).getBoundingClientRect();

		tl
			.setCurtain(window.$transitionCurtain, {
				width,
				top,
				background
			})
			.revealCurtain(window.$transitionCurtain)
			.add(() => resolve(true))
			.totalDuration(duration)
			.timeScale(timeScale);
	});
}
