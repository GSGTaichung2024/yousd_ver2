function PJAXCloneHeading(target) {
	return new Promise((resolve) => {
		if (!target || !target.length) {
			resolve(true);
			return;
		}

		const
			tl = new gsap.timeline(),
			$clone = target.clone(true).css({
				position: 'fixed',
				opacity: 0,
				visibility: 'hidden'
			}).addClass('js-clone').appendTo(window.$barbaWrapper),
			$targetChars = target.find('.arts-split-text__char'),
			$cloneChars = $clone.find('.arts-split-text__char'),
			CSSProperties = target.css([
				'font-size',
				'font-style',
				'font-weight',
				'line-height',
				'letter-spacing',
				'color',
				'text-align',
				'vertical-align'
			]),
			targetRect = [];

		if ($targetChars.length) {
			$targetChars.each(function (index) {
				targetRect[index] = this.getBoundingClientRect();
			});
		}

		tl
			.set($clone, {
				margin: 0,
				padding: 0,
				position: 'fixed',
				zIndex: 500,
				autoRound: false,
				fontSize: CSSProperties['font-size'],
				fontStyle: CSSProperties['font-style'],
				fontWeight: CSSProperties['font-weight'],
				lineHeight: CSSProperties['line-height'],
				letterSpacing: CSSProperties['letter-spacing'],
				color: CSSProperties['color'],
				textAlign: CSSProperties['text-align'],
				verticalAlign: CSSProperties['vertical-align'],
			})
			.set($cloneChars, {
				position: 'fixed',
				top: (index, target) => targetRect[index].top,
				left: (index, target) => targetRect[index].left,
				autoRound: false
			})
			.set($clone, {
				autoAlpha: 1,
			})
			.set(target, {
				autoAlpha: 0
			})
			.add(() => resolve(true));
	});
}
