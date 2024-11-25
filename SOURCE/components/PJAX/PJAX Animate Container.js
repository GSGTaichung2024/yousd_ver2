function PJAXAnimateContainer(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$currentContainer = $(data.current.container),
			$nextContainer = $(data.next.container),
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.ajaxCurtainTransition) || 1;

		tl
			.fromTo($nextContainer, {
				y: '100vh',
				autoAlpha: 1
			}, {
				y: '0vh',
				autoAlpha: 1,
				duration: 1.2,
				ease: 'expo.inOut',
			}, '0')
			.fromTo($currentContainer, {
				y: '0vh',
				autoAlpha: 1,
				zIndex: -1
			}, {
				y: '-20vh',
				autoAlpha: 1,
				duration: 1.2,
				ease: 'expo.inOut',
				onComplete: () => {
					$currentContainer.empty();
				}
			}, '0')
			.add(() => resolve(true))
			.totalDuration(duration)
			.timeScale(timeScale);
	});
}
