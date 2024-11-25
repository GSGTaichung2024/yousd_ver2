function PJAXClearContainer(data) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			tl = new gsap.timeline();

		tl
			.set($nextContainer, {
				clearProps: 'all'
			})
			.set(window.$body, {
				clearProps: 'background-color'
			})
			.setCurtain(window.$transitionCurtain, {
				clearProps: 'all'
			})
			.add(() => resolve(true))
	});
}
