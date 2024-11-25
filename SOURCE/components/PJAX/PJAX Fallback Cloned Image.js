function PJAXFallbackClonedImage(data, duration = 1.8) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			background = $nextMasthead.find('.section__bg').attr('data-background-color'),
			$clone = $('.js-clone');

		tl
			.set($clone, {
				clearProps: 'transition'
			})
			.setCurtain(window.$transitionCurtain, {
				background
			})
			.add([
				gsap.effects.revealCurtain(window.$transitionCurtain, {
					duration: 1.2
				}),
				gsap.to($clone, {
					autoAlpha: 0,
					duration: 0.6,
					display: 'none'
				})
			])
			.setCurtain(window.$transitionCurtain)
			.add(() => resolve(true))
			.totalDuration(duration);
	})
}
