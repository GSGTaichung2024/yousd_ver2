function PJAXSetBodyBackground(data) {
	return new Promise((resolve) => {
		const
			$trigger = $(data.trigger),
			backgroundColor = $trigger.closest('.section').css('background-color'),
			tl = new gsap.timeline();

		tl
			.to(window.$body, {
				duration: 0.2,
				backgroundColor
			})
			.add(() => resolve(true));
	});
}
