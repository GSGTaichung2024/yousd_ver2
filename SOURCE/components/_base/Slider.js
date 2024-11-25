class Slider extends BaseComponent {
	constructor({
		scope,
		target
	}) {
		super({
			target,
			scope
		});
	}

	_setDragging({
		target
	}) {
		this.drag = false;

		if (target && target.length && target.data('drag-cursor')) {
			this.drag = {
				enabled: target.data('drag-cursor') || false,
				label: target.data('drag-label') || '',
				customClass: target.data('drag-class') || '',
				scale: target.data('drag-scale') || 1.7,
				icon: target.data('drag-icon') || '',
				distance: target.data('drag-distance') || 50,
				hide: target.data('drag-hide-cursor') || false
			};
		}
	}

	_getSliderDots({
		slider,
		container
	}) {
		return new SliderDots({
			slider,
			container
		});
	}

	_getSliderCounter({
		slider,
		counter = {
			current,
			total,
			style,
			zeros
		}
	}) {
		return new SliderCounter({
			slider: slider,
			sliderCounter: counter.current,
			total: counter.total,
			style: counter.style,
			addZeros: counter.zeros
		});
	}

	_emitDragEvents({
		slider,
		label,
		customClass,
		scale,
		icon,
		distance,
		hide
	}) {

		slider
			.on('touchStart', (e) => {

				if (slider.params.autoplay.enabled) {
					slider.autoplay.stop();
				}

				if (customClass) {
					slider.$el.addClass(customClass);
				}

				window.$cursor.trigger({
					type: 'startDragging',
					detail: {
						direction: slider.params.direction,
						distance,
						label,
						scale,
						icon,
						hide
					}
				});

			})
			.on('touchEnd', () => {
				if (slider.params.autoplay.enabled) {
					slider.autoplay.start();
				}

				if (customClass) {
					slider.$el.removeClass(customClass);
				}

				window.$cursor.trigger('finishDragging');
			});
	}

	_setAutoplayAnimation({
		parent,
		slider
	}) {
		if (parent &&
			parent.length &&
			parent.attr('data-arts-os-animation') &&
			slider &&
			slider.params.autoplay &&
			slider.params.autoplay.enabled === true) {

			// enable autoplay only once OS animation is completed
			parent
				.one('animation/start', () => {
					slider.autoplay.stop();
				})
				.one('animation/complete', () => {
					slider.autoplay.start();
				});
		}
	}

	_pauseAutoplay(slider) {
		if (slider && slider.params.autoplay.enabled) {
			setTimeout(() => {
				slider.autoplay.stop();
			}, 100);

			window.$window.on('arts/barba/transition/start', () => {
				slider.autoplay.stop();
			});
		}
	}

	_pauseAutoplayOnOutOfView({
		trigger,
		slider
	}) {
		if (trigger && slider && slider.params.autoplay && slider.params.autoplay.enabled) {
			// stop autoplay initialy
			slider.autoplay.stop();

			const
				pauseAutoplayTrigger = ScrollTrigger.create({
					trigger: trigger,
					once: false,
					scrub: true,
					invalidateOnRefresh: true,
					start: 'top bottom',
					end: 'bottom top',
					onToggle: (e) => {
						// element is in view
						if (e.isActive) {
							slider.autoplay.start();
						} else { // element is out of view
							slider.autoplay.stop();
						}
					},
				}),
				onMenuOpenStart = () => {
					slider.autoplay.stop();
				},
				onMenuCloseStart = () => {
					// element is in view
					if (pauseAutoplayTrigger.isActive) {
						slider.autoplay.start();
					}
				}

			// update ScrollTrigger coordniates on possible slider resize
			slider.on('slideChange lazyImageReady', () => {
				pauseAutoplayTrigger.refresh();
			});

			// pause autoplay when overlay menu is open
			window.$pageHeader
				.on('menuOpenStart', onMenuOpenStart)
				.on('menuCloseStart', onMenuCloseStart);

			// clean up listeners on AJAX transition
			window.$window.one('arts/barba/transition/start', () => {
				window.$pageHeader
					.off('menuOpenStart', onMenuOpenStart)
					.off('menuCloseStart', onMenuCloseStart);
			});

		}
	}

	_setBackgrounds({
		target,
		slider,
		side,
		header,
		setStickyHeader = false
	}) {
		const delay = parseFloat((slider.params.speed / 1000) / 2);

		// updating backgroudns & page header theme
		slider.on('slideChange', () => {
			const
				$activeSide = $(slider.slides[slider.activeIndex]),
				backgroundTarget = $activeSide.data('slide-background'),
				backgroundSide = $activeSide.data('slide-side-background'),
				themeSection = $activeSide.data('slide-theme') || 'dark',
				themeHeader = $activeSide.data('slide-header-theme') || 'dark',
				logoHeader = $activeSide.data('slide-header-logo') || 'primary';

			if (backgroundTarget) {
				gsap.set(target, {
					delay,
					background: backgroundTarget,
					onComplete: () => {
						if (target && target.length && target.attr('data-arts-theme-text') !== themeSection) {
							target.attr('data-arts-theme-text', themeSection);
						}

						if (header && header.length) {
							if (header.hasClass('header_sticky') && !setStickyHeader) {
								return;
							} else {
								header.attr('data-arts-theme-text', themeHeader);
								header.attr('data-arts-header-logo', logoHeader);
							}
						}
					}
				});
			}

			if (backgroundSide) {
				gsap.set(side, {
					delay,
					background: backgroundSide
				});
			}
		});
	}

	_setScrollbar({
		slider,
		scrollbar,
		zeros = 1
	}) {
		if (!slider || !scrollbar || !scrollbar.length) {
			return;
		}

		let
			prefix = this._getZerosPrefix({
				zeros
			}),
			slideNum = slider.activeIndex + 1,
			handle = scrollbar.find('.slider__scrollbar-handle');

		handle.attr('data-content', prefix + slideNum);

		slider.on('slideChange', () => {
			slideNum = slider.activeIndex + 1;
			prefix = this._getZerosPrefix({
				zeros,
				activeSlide: slider.activeIndex
			});
			handle.attr('data-content', prefix + slideNum);
		});

	}

	_setCounter({
		slider,
		elementCurrent,
		elementTotal,
		zeros = 1
	}) {
		if (!slider || !elementCurrent || !elementTotal) {
			return;
		}

		let
			prefixCurrent = this._getZerosPrefix({
				zeros
			}),
			prefixTotal = this._getZerosPrefix({
				zeros
			}),
			totalSlides = slider.slides.length,
			slideNum = slider.activeIndex + 1;

		if (elementTotal.length) {
			if (totalSlides > 9) {
				prefixTotal = this._getZerosPrefix({
					zeros: zeros - 1
				});
			}
			elementTotal.html(prefixTotal + totalSlides);
		}

		elementCurrent.html(prefixCurrent + slideNum);

		slider.on('slideChange', () => {
			slideNum = slider.activeIndex + 1;
			prefixCurrent = this._getZerosPrefix({
				zeros,
				activeSlide: slider.activeIndex
			});

			elementCurrent.html(prefixCurrent + slideNum);
		});

	}

	_getZerosPrefix({
		zeros = 1,
		activeSlide = 0
	}) {
		if (zeros === 1) {
			if (activeSlide < 9) {
				return '0';
			} else {
				return '';
			}
		}

		if (zeros === 2) {
			if (activeSlide < 9) {
				return '00';
			} else {
				return '0';
			}
		}

		return '';
	}

	_setExternalControls({
		slider,
		enabled = true
	}) {
		if (!slider) {
			return;
		}

		const
			wasMouseWheelEnabled = slider.params.mousewheel.enabled,
			wasKeyboardEnabled = slider.params.keyboard.enabled;

		if (enabled === true) {
			if (wasMouseWheelEnabled) {
				slider.mousewheel.enable();
			}
			if (wasKeyboardEnabled) {
				slider.keyboard.enable();
			}
		} else {
			if (wasMouseWheelEnabled) {
				slider.mousewheel.disable();
			}
			if (wasKeyboardEnabled) {
				slider.keyboard.disable();
			}
		}
	}

	_setBreakpoints({
		target
	}) {

		if (!target || !target.length) {
			return 0;
		}

		const
			lg = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.lg - 1 : 1024,
			md = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.md - 1 : 767,
			breakpoints = {
				[lg]: {},
				[md]: {},
				0: {}
			},
			removeEmpty = (obj) => { // recursively remove undefined keys
				Object.keys(obj).forEach(key => {
					if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
					else if (obj[key] === undefined) delete obj[key];
				});

				return obj;
			};

		breakpoints[lg] = {
			slidesPerView: target.data('slides-per-view'),
			spaceBetween: target.data('space-between'),
			centeredSlides: target.data('centered-slides'),
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: Math.round(target.data('slides-per-view')) || 3,
				loadOnTransitionStart: true
			}
		};
		breakpoints[md] = {
			slidesPerView: target.data('slides-per-view-tablet'),
			spaceBetween: target.data('space-between-tablet'),
			centeredSlides: target.data('centered-slides-tablet'),
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: Math.round(target.data('slides-per-view-tablet')) || 3,
				loadOnTransitionStart: true
			}
		};
		breakpoints[0] = {
			slidesPerView: target.data('slides-per-view-mobile'),
			spaceBetween: target.data('space-between-mobile'),
			centeredSlides: target.data('centered-slides-mobile'),
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: Math.round(target.data('slides-per-view-mobile')) || 3,
				loadOnTransitionStart: true
			}
		};

		return removeEmpty(breakpoints);
	}

	_updateScrollTriggerOnHeightChange(slider) {
		if (slider) {
			slider
				.on('update', () => {
					Animations.refreshAll();
				})
				.on('lazyImageReady', () => {
					slider.update();

					setTimeout(() => {
						slider.update();
					}, 100);
				});
		}
	}

	_prefetchActiveSlideTransition(slider) {
		if (!slider instanceof Swiper) {
			return;
		}

		slider.on('slideChange', (e) => {
			// find links in the currently active slide
			const $links = $(e.slides).eq(e.realIndex).find('a');

			// prefetch all links
			if ($links.length) {
				$links.each(function () {
					try {
						barba.prefetch(this.href);
					} catch (error) {
						console.warn(`Barba.js: Can't prefetch ${this.href}`)
					}
				});
			}

		});
	}

	_updateOnResize(instances = []) {
		if (!instances || !Array.isArray(instances)) {
			return;
		}

		window.$window.on('resize', debounce(() => {
			this._updateSwiperInstances(instances);
		}, 250));
	}

	_updateOnTransitionEnd(instances = []) {
		if (!instances || !Array.isArray(instances)) {
			return;
		}

		window.$window
			.one('arts/barba/transition/end', () => {
				this._updateSwiperInstances(instances);
			});

		this._updateSwiperInstances(instances);
	}

	_updateSwiperInstances(instances = []) {
		if (!instances || !Array.isArray(instances)) {
			return;
		}

		instances.forEach((instance) => {
			if (instance !== null && instance instanceof Swiper && typeof instance.update === 'function') {
				try {
					instance.update();
				} catch (error) {}
			}
		});
	}
}
