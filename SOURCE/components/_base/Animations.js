class Animations {
	constructor() {
		this.defaults = {
			duration: 1.2
		};

		this._animateCounter();
		this._animateHeadline();
		this._animateJump();
		this._animateMask();
		this._animateScale();
		this._animateStroke();

		this._setCurtain();
		this._revealCurtain();

		this._hideCurtain();
		this._hideHeadline();
		this._hideJump();
		this._hideMask();
		this._hideScale();
	}

	static refresh(target = null, immediate = false) {
		if (target) {
			window.dispatchEvent(new CustomEvent('arts/scrolltrigger/update', {
				detail: {
					target,
					immediate
				}
			}));
		}
	}

	static refreshAll(immediate = false) {
		ScrollTrigger.getAll().forEach((instance) => {
			instance.refresh(immediate);
		});
	}

	static enableAll() {
		ScrollTrigger.getAll().forEach((instance) => {
			if (!instance.enabled) {
				instance.enable();
			}
		});
	}

	static disableAll(revert = false) {
		ScrollTrigger.getAll().forEach((instance) => instance.disable(revert));
	}

	static killAll(revert = false) {
		ScrollTrigger.getAll().forEach((instance) => {
			instance.kill(revert);
			instance = null;
		});
	}

	_setCurtain() {
		gsap.registerEffect({
			name: 'setCurtain',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target);

				if (!$target.length) {
					return tl;
				}

				return tl.set($target, config);
			},
			extendTimeline: true,
			defaults: {
				scaleY: 0,
				transformOrigin: 'bottom center'
			}
		});
	}

	_revealCurtain() {
		gsap.registerEffect({
			name: 'revealCurtain',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target);

				if (!$target.length) {
					return tl;
				}

				return tl.to(target, config);
			},
			extendTimeline: true,
			defaults: {
				duration: this.defaults.duration,
				transformOrigin: 'bottom center',
				scaleY: 1,
				ease: 'expo.inOut'
			}
		});
	}

	_hideCurtain() {
		gsap.registerEffect({
			name: 'hideCurtain',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target);

				if (!$target.length) {
					return tl;
				}

				return tl.to($target, config)._setCurtain($target);

			},
			extendTimeline: true,
			defaults: {
				duration: this.defaults.duration,
				transformOrigin: 'top center',
				scaleY: 0,
				ease: 'expo.inOut'
			}
		});
	}

	_animateHeadline() {
		gsap.registerEffect({
			name: 'animateHeadline',
			effect: (target, config) => {
				const
					$target = $(target);

				let textAlign;
				textAlign = $target.css('text-align');

				if (!config.transformOrigin) {

					switch (textAlign) {
						case 'left':
							config.transformOrigin = 'left center';
							break;
						case 'start':
							config.transformOrigin = 'left center';
							break;
						case 'center':
							config.transformOrigin = 'center center';
							break;
						case 'right':
							config.transformOrigin = 'right center';
							break;
						case 'end':
							config.transformOrigin = 'right center';
							break;
					}

				}

				return gsap.fromTo($target, {
					scaleX: 0,
					immediateRender: true
				}, config);
			},
			defaults: {
				scaleX: 1,
				scaleY: 1,
				duration: this.defaults.duration,
				ease: 'expo.inOut',
			},
			extendTimeline: true,
		});
	}

	_hideHeadline() {
		gsap.registerEffect({
			name: 'hideHeadline',
			effect: (target, config) => {
				const
					$target = $(target);

				let textAlign;
				textAlign = $target.css('text-align');

				if (!config.transformOrigin) {

					switch (textAlign) {
						case 'left':
							config.transformOrigin = 'left center';
							break;
						case 'center':
							config.transformOrigin = 'center center';
							break;
						case 'right':
							config.transformOrigin = 'right center';
							break;
					}

				}

				return gsap.to($target, config);
			},
			defaults: {
				scaleX: 0,
				duration: this.defaults.duration,
				ease: 'expo.inOut',
			},
			extendTimeline: true,
		});
	}

	_animateMask() {
		gsap.registerEffect({
			name: 'animateMask',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target),
					inlineScale = $target.data('arts-mask-scale-set'),
					$maskLayer1 = $target.find('.mask-reveal__layer-1'),
					$maskLayer2 = $target.find('.mask-reveal__layer-2'),
					initialPosition = {
						maskLayer1: {
							x: '0%',
							y: '0%',
							immediateRender: true
						},
						maskLayer2: {
							x: '0%',
							y: '0%',
							transformOrigin: 'center center',
							scale: inlineScale || config.scale || 1,
							immediateRender: true
						}
					};

				if ($maskLayer1.length && $maskLayer2.length) {
					switch (config.direction) {
						case 'up':
							initialPosition.maskLayer1.y = '-101%';
							initialPosition.maskLayer2.y = '101%';
							break;
						case 'right':
							initialPosition.maskLayer1.x = '101%';
							initialPosition.maskLayer2.x = '-101%';
							break;
						case 'left':
							initialPosition.maskLayer1.x = '-101%';
							initialPosition.maskLayer2.x = '101%';
							break;
						default:
							initialPosition.maskLayer1.y = '101%';
							initialPosition.maskLayer2.y = '-101%';
							break;
					}

					tl
						.add([
							gsap.set($maskLayer1, initialPosition.maskLayer1),
							gsap.set($maskLayer2, initialPosition.maskLayer2)
						])
						.add([
							gsap.to([$maskLayer1, $maskLayer2], {
								x: config.x,
								y: config.y,
								duration: config.duration,
								ease: config.ease
							}),
							gsap.to($maskLayer2, {
								duration: config.duration * 1.25,
								transformOrigin: 'center center',
								scale: 1
							})
						])
						.set([$maskLayer1, $maskLayer2], {
							clearProps: 'transform'
						});
				}

				return tl;
			},
			defaults: {
				x: '0%',
				y: '0%',
				duration: this.defaults.duration,
				scale: isBrowserFirefox() ? 1.0 : 1.2,
				ease: 'expo.inOut',
				direction: 'down'
			},
			extendTimeline: true,
		});
	}

	_hideMask() {
		gsap.registerEffect({
			name: 'hideMask',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target),
					inlineScale = $target.data('arts-mask-scale-set'),
					$maskLayer1 = $target.find('.mask-reveal__layer-1'),
					$maskLayer2 = $target.find('.mask-reveal__layer-2'),
					animatedPosition = {
						maskLayer1: {
							x: '0%',
							y: '0%',
							duration: config.duration,
							ease: config.ease || 'expo.inOut'
						},
						maskLayer2: {
							x: '0%',
							y: '0%',
							duration: config.duration,
							transformOrigin: 'center center',
							scale: inlineScale || config.scale || 1,
							ease: config.ease || 'expo.inOut'
						}
					};

				if ($maskLayer1.length && $maskLayer2.length) {
					switch (config.direction) {
						case 'up':
							animatedPosition.maskLayer1.y = '101%';
							animatedPosition.maskLayer2.y = '-101%';
							break;
						case 'right':
							animatedPosition.maskLayer1.x = '101%';
							animatedPosition.maskLayer2.x = '-101%';
							break;
						case 'left':
							animatedPosition.maskLayer1.x = '-101%';
							animatedPosition.maskLayer2.x = '101%';
							break;
						default:
							animatedPosition.maskLayer1.y = '-101%';
							animatedPosition.maskLayer2.y = '101%';
							break;
					}

					tl
						.add([
							gsap.to($maskLayer1, animatedPosition.maskLayer1),
							gsap.to($maskLayer2, animatedPosition.maskLayer2)
						]);
				}

				return tl;
			},
			defaults: {
				x: '0%',
				y: '0%',
				duration: this.defaults.duration,
				scale: isBrowserFirefox() ? 1.0 : 1.2,
				ease: 'expo.inOut',
				direction: 'down'
			},
			extendTimeline: true,
		});
	}

	_animateJump() {
		gsap.registerEffect({
			name: 'animateJump',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target),
					fromConfig = $.extend(config, {
						autoAlpha: 0,
						immediateRender: true
					});

				if ($target.length) {
					tl.fromTo($target, fromConfig, {
						autoAlpha: 1,
						x: 0,
						y: 0,
						scaleY: 1,
						scaleX: 1,
						ease: 'power3.out'
					}).set($target, {
						clearProps: 'all'
					});
				}

				return tl;
			},
			defaults: {
				duration: this.defaults.duration,
				y: 30,
				x: 0,
				scaleY: 1,
				scaleX: 1,
				ease: 'power3.out',
			},
			extendTimeline: true,
		});
	}

	_hideJump() {
		gsap.registerEffect({
			name: 'hideJump',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target);

				if ($target.length) {
					tl.to($target, config);
				}

				return tl;
			},
			defaults: {
				duration: this.defaults.duration,
				y: '-33%',
				transformOrigin: 'top center',
				autoAlpha: 0,
				ease: 'power3.out',
			},
			extendTimeline: true,
		});
	}

	_animateScale() {
		gsap.registerEffect({
			name: 'animateScale',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target);

				let
					scaleX = 1,
					scaleY = 1,
					transformOrigin = 'bottom center';

				switch (config.direction) {
					case 'left':
						transformOrigin = 'left center';
						config.scaleX = 0;
						break;
					case 'right':
						transformOrigin = 'right center';
						config.scaleX = 0;
						break;
					case 'up':
						transformOrigin = 'top center';
						config.scaleY = 0;
						break;
					case 'center':
						transformOrigin = 'center center';
						config.scaleX = 0;
						config.scaleY = 0;
						break;
					default:
						transformOrigin = 'bottom center';
						config.scaleY = 0;
						break;
				}

				return tl.fromTo($target, config, {
					scaleX,
					scaleY,
					transformOrigin,
					ease: config.ease,
					duration: config.duration
				});
			},
			defaults: {
				duration: this.defaults.duration,
				ease: 'expo.inOut',
				direction: 'down',
				immediateRender: true
			},
			extendTimeline: true,
		});

	}

	_hideScale() {
		gsap.registerEffect({
			name: 'hideScale',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target);

				let
					scaleX = 1,
					scaleY = 1,
					transformOrigin = 'bottom center';

				switch (config.direction) {
					case 'left':
						transformOrigin = 'left center';
						config.scaleX = 0;
						break;
					case 'right':
						transformOrigin = 'right center';
						config.scaleX = 0;
						break;
					case 'up':
						transformOrigin = 'top center';
						config.scaleY = 0;
						break;
					case 'center':
						transformOrigin = 'center center';
						config.scaleX = 0;
						config.scaleY = 0;
						break;
					default:
						transformOrigin = 'bottom center';
						config.scaleY = 0;
						break;
				}

				return tl.fromTo($target, {
					scaleX,
					scaleY,
					transformOrigin,
					ease: config.ease,
					duration: config.duration
				}, config);
			},
			defaults: {
				scaleY: 0,
				scaleX: 1,
				duration: this.defaults.duration,
				ease: 'expo.inOut',
				direction: 'up',
				immediateRender: true
			},
			extendTimeline: true,
		});

	}

	_animateStroke() {
		gsap.registerEffect({
			name: 'animateStroke',
			effect: (target, config) => {
				const
					$target = $(target).find('.circle');

				return gsap.fromTo($target, {
					rotate: 90,
					transformOrigin: 'center center',
					drawSVG: '100% 100%',
				}, {
					rotate: 0,
					transformOrigin: 'center center',
					drawSVG: '0% 100%',
					immediateRender: true,
					duration: config.duration,
					ease: config.ease
				});
			},
			defaults: {
				duration: this.defaults.duration,
				ease: 'expo.inOut',
			},
			extendTimeline: true,
		});
	}

	_animateCounter() {
		gsap.registerEffect({
			name: 'animateCounter',
			effect: (target, config) => {
				const
					tl = new gsap.timeline(),
					$target = $(target),
					prefix = config.prefix ? config.prefix : '',
					suffix = config.suffix ? config.suffix : '',
					$num = $target.find('.js-counter__number');

				let counter = {
						val: config.start
					},
					value = parseFloat(config.start).toFixed(0);

				if ($num.length) {
					value = prefix + _addZeros(value, config.zeros) + suffix;

					$num.text(value);
					tl
						.add([
							gsap.effects.animateStroke($target, {
								duration: config.duration,
								ease: config.ease
							}),
							gsap.to(counter, {
								onUpdate: () => {
									value = parseFloat(counter.val).toFixed(0);
									value = _addZeros(value, config.zeros);
									$num.text(prefix + value + suffix);
								},
								val: parseFloat(config.target).toFixed(0),
								duration: config.duration,
								ease: config.ease
							}),
						]);
				}

				return tl;
			},
			defaults: {
				prefix: '',
				suffix: '',
				start: 0,
				target: 100,
				zeros: 2,
				duration: this.defaults.duration,
				ease: 'power4.out',
			},
			extendTimeline: true,
		});

		function _addZeros(value, zeros) {
			while (value.toString().length < zeros) {
				value = '0' + value;
			}

			return value;
		}

	}
}
