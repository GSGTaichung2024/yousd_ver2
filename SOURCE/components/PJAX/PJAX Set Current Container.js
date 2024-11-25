function PJAXSetCurrentContainer(data, hide = true, scrollToTop = false) {
	return new Promise((resolve) => {
		const
			$currentContainer = $(data.current.container),
			tl = new gsap.timeline();

		tl
			.set($currentContainer, {
				autoAlpha: hide ? 0 : 1,
			})
			.set($currentContainer, {
				delay: 0.1,
				width: '100vw',
				height: '100vh',
				overflow: 'hidden',
				zIndex: 300,
				onComplete: () => {
					Animations.killAll();

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
