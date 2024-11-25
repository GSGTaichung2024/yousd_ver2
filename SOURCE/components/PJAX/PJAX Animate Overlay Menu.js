function PJAXAnimateOverlayMenu(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$currentContainer = $(data.current.container),
			$nextContainer = $(data.next.container);

		tl
			.set($currentContainer, {
				autoAlpha: 0,
				overwrite: true
			})
			.set($nextContainer, {
				y: '0vh',
				autoAlpha: 1,
				overwrite: true
			})
			.add(window.kinsey.theme.header.closeMenuTransition(true))
			.add(() => {
				resolve(true);
			}, '-=0.8');
	});
}
