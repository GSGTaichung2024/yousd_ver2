function Preloader() {
	let
		tl = new gsap.timeline(),
		$counter = $('.js-preloader__counter'),
		$content = $('.js-preloader__content'),
		backgroundSizeHeight,
		counter = {
			width: 'auto',
			val: 0
		},
		value = _addZeros(0, 2) + '%';

	this.start = function () {
		window.dispatchEvent(new CustomEvent('arts/preloader/start'));

		tl
			.to($content, {
				y: 0,
				duration: 0.3,
				autoAlpha: 1,
				ease: 'power3.out',
			}, '0');

		if ($counter.length) {
			backgroundSizeHeight = $counter.css('background-size').split(' ')[1];

			// get maximum possible width to prevent shaking during the animation
			$counter.text('100%');

			// save width
			counter.width = $counter.width();

			// restore counter value
			$counter.text(value);

			// hard set the width
			gsap.set($counter, {
				width: counter.width
			});

			tl
				.to($counter, {
					duration: 0.3,
					autoAlpha: 1,
					y: 0,
					ease: 'power3.out',
				}, '0')
				.to(counter, {
					onUpdate: () => {
						value = parseFloat(counter.val).toFixed(0);
						value = _addZeros(value, 2);
						$counter.text(value + '%');
					},
					val: 100,
					duration: 20,
					ease: 'power3.out',
				});
		}

	}

	this.finish = function () {
		return new Promise((resolve) => {
			const timeScale = parseFloat(window.kinsey.theme.animations.timeScale.preloader) || 1;

			tl
				.clear()
				.add([
					gsap.to($content, {
						y: 0,
						autoAlpha: 1,
						ease: 'power3.out',
						duration: 0.3,
						overwrite: true
					}),
					gsap.to($counter, {
						y: 0,
						autoAlpha: 1,
						ease: 'power3.out',
						duration: 0.3,
						overwrite: true
					})
				])
				.add([
					gsap.to($counter, {
						onStart: () => {
							$counter.removeClass('preloader__counter_started');
						},
						backgroundSize: `100% ${backgroundSizeHeight}`,
						duration: 2.4 / timeScale,
						ease: 'expo.inOut'
					}),
					gsap.to(counter, {
						onUpdate: () => {
							value = parseFloat(counter.val).toFixed(0);
							value = _addZeros(value, 2);
							$counter.text(value + '%');
						},
						val: 100,
						duration: 2.4 / timeScale,
						ease: 'expo.inOut'
					})
				])
				.set($counter, {
					backgroundPosition: '100% 100%',
				})
				.to($counter, {
					backgroundSize: `0% ${backgroundSizeHeight}`,
					duration: 1.2,
					ease: 'expo.inOut',
				})
				.add([
					gsap.effects.hideMask(window.$pagePreloader, {
						duration: 1.2,
						scale: 1,
						direction: 'down',
					}),
					gsap.to($counter, {
						y: -50,
						autoAlpha: 0,
						duration: 0.3,
						onComplete: () => {
							window.$pagePreloader.addClass('preloader_ended');
						}
					}),
					gsap.to($content, {
						y: -50,
						autoAlpha: 0,
						duration: 0.3,
						delay: 0.1
					}),
				], '-=0.3')
				.set(window.$pagePreloader, {
					display: 'none'
				})
				.add(() => {
					window.dispatchEvent(new CustomEvent('arts/preloader/end'));
					resolve(true);
				}, '-=0.3');
		});
	}

	function _addZeros(value, zeros) {
		while (value.toString().length < zeros) {
			value = '0' + value;
		}

		return value;
	}
}
