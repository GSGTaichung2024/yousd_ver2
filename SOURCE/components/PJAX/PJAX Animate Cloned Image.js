function PJAXAnimateClonedImage(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			$target = $nextMasthead.find('.js-transition-img'),
			$clone = $('.js-transition-img.js-clone'),
			imageTarget = $target.find('img'),
			imageClone = $clone.find('img'),
			bgClone = $clone.find('.js-transition-img__transformed-el'),
			bgTarget = $target.find('.js-transition-img__transformed-el'),
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.ajaxFlyingImageTransition) || 1;

		if (!$target.length || !$clone.length) {
			gsap.to($clone, {
				duration: 0.6,
				autoAlpha: 0
			});
			resolve(true);
			return;
		}

		const {
			top,
			left,
			width,
			height
		} = $target.get(0).getBoundingClientRect(),
			imageProperties = imageTarget.css(['width', 'height', 'objectPosition', 'objectFit']),
			bgTargetProperties = bgTarget.css(['transform', 'width', 'height', 'objectPosition', 'objectFit']),
			bgTargetXPercent = gsap.getProperty(bgTarget.get(0), 'x', '%'),
			bgTargetYPercent = gsap.getProperty(bgTarget.get(0), 'y', '%'),
			targetTransform = $target.css('transform'),
			targetBorderRadius = $target.css('border-radius'),
			targetClippath = $clone.css('clip-path') === 'none' ? '' : 'circle(100% at center)',
			offsetTop = window.$body.offset().top + top;

		tl
			.set($clone, {
				maxWidth: 'unset',
				maxHeight: 'unset',
				zIndex: 500
			})
			.add([
				gsap.to(imageClone, {
					width: imageProperties.width,
					height: imageProperties.height,
					objectFit: imageProperties.objectFit,
					objectPosition: imageProperties.objectPosition,
					ease: 'expo.inOut',
					duration: 1.2,
					autoRound: false
				}),
				gsap.to(bgClone, {
					paddingBottom: 0,
					transform: bgTargetProperties.transform,
					x: bgTargetXPercent,
					y: bgTargetYPercent,
					transformOrigin: bgTargetProperties.transformOrigin,
					width: bgTargetProperties.width,
					height: bgTargetProperties.height,
					objectFit: bgTargetProperties.objectFit,
					objectPosition: bgTargetProperties.objectPosition,
					duration: 1.2,
					ease: 'expo.inOut',
					transition: 'none',
					top: 'auto',
					left: 'auto',
					right: 'auto',
					bottom: 'auto',
					autoRound: false
				}),
				gsap.to($clone, {
					transform: targetTransform,
					transformOrigin: 'center center',
					top: offsetTop,
					left,
					width,
					height,
					duration: 1.2,
					ease: 'expo.inOut',
					transition: 'none',
					borderRadius: targetBorderRadius,
					clipPath: targetClippath
				})
			])
			.add(() => {
				resolve(true);
			})
			.totalDuration(duration)
			.timeScale(timeScale);
	});
}
