function PJAXCloneImage(target) {
	return new Promise((resolve) => {
		if (!target || !target.length) {
			resolve(true);
			return;
		}

		const
			tl = new gsap.timeline(),
			$clone = target.clone(true).css({
				opacity: 0,
				visibility: 'hidden'
			}).addClass('js-clone').appendTo(window.$barbaWrapper),
			$transformedImage = target.find('.js-transition-img__transformed-el'),
			$cloneTransformedImage = $clone.find('.js-transition-img__transformed-el'),
			{
				top,
				left,
				width,
				height
			} = target.get(0).getBoundingClientRect(),
			CSSProperties = target.css([
				'text-align',
				'vertical-align'
			]);

		if ($transformedImage.length && $cloneTransformedImage.length) {
			tl
				.set($cloneTransformedImage, {
					transform: $transformedImage.css('transform')
				});
		}

		tl
			.set($clone, {
				margin: 0,
				padding: 0,
				position: 'fixed',
				top,
				left,
				width,
				height,
				zIndex: 500,
				textAlign: CSSProperties['text-align'],
				verticalAlign: CSSProperties['vertical-align'],
				autoRound: false
			})
			.set($clone, {
				autoAlpha: 1,
			})
			.set(target, {
				autoAlpha: 0
			})
			.add(() => {
				resolve(true);
			});
	});
}
