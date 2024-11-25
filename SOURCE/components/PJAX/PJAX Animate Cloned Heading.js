function PJAXAnimateClonedHeading(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			$target = $nextMasthead.find('.js-transition-heading'),
			$targetChars = $target.find('.arts-split-text__char'),
			$clone = $('.js-transition-heading.js-clone'),
			$cloneChars = $clone.find('.arts-split-text__char'),
			targetRect = [],
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.ajaxFlyingImageTransition) || 1;

		if (!$target.length || !$clone.length || $target.length !== $clone.length) {
			gsap.to($clone, {
				duration: 0.6,
				autoAlpha: 0
			});
			resolve(true);
			return;
		}

		gsap.set($targetChars, {
			clearProps: 'transform'
		});

		if ($targetChars.length) {
			$targetChars.each(function (index) {
				targetRect[index] = this.getBoundingClientRect();
			});
		}

		const
			CSSProperties = $target.css([
				'font-size',
				'font-style',
				'font-weight',
				'line-height',
				'letter-spacing',
				'color',
				'vertical-align'
			]);

		tl
			.delay(0.1)
			.add([
				gsap.to($clone, {
					fontSize: CSSProperties['font-size'],
					fontStyle: CSSProperties['font-style'],
					fontWeight: CSSProperties['font-weight'],
					lineHeight: CSSProperties['line-height'],
					letterSpacing: CSSProperties['letter-spacing'],
					color: CSSProperties['color'],
					verticalAlign: CSSProperties['vertical-align'],
					ease: 'expo.inOut',
					duration: 1.2,
					autoRound: false
				}),
				gsap.to($cloneChars, {
					position: 'fixed',
					top: (index, target) => targetRect[index].top,
					left: (index, target) => targetRect[index].left,
					duration: 1.2,
					ease: 'expo.inOut',
					autoRound: false
				}),
			])
			.add(() => resolve(true))
			.totalDuration(duration)
			.timeScale(timeScale);
	});
}
