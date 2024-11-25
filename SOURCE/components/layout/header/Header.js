class Header extends BaseComponent {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
	}

	set() {
		this.$controls = this.$target.find('.header__controls');
		this.$stickyHeader = this.$target.filter('.js-header-sticky');
		this.$adminBar = $('#wpadminbar');
		this.$burger = this.$target.find('#js-burger');
		this.$overlay = this.$target.find('.header__wrapper-overlay-menu');
		this.$maskRevealOverlay = this.$overlay.find('.mask-reveal');
		this.$wrapperMenu = this.$target.find('.header__wrapper-menu');
		this.burgerOpenClass = 'header__burger_opened';
		this.$headerColumns = this.$target.find('.header__col');
		this.$headerLeft = this.$target.find('.header__col-left');
		this.$overlayWidgets = this.$target.find('.header__wrapper-overlay-widgets');
		this.$allLinksOverlay = this.$target.find('.menu-overlay a');
		this.$allLinksClassic = this.$target.find('.menu a');
		this.$wrapperSlider = this.$target.find('.header__wrapper-slider');
		this.$headerLabelSubmenu = this.$target.find('.js-header-label-submenu');
		this.$infoLabel = this.$target.find('.header__overlay-menu-info');

		this.color = this._getColorTheme();
		this.colorSaved = this.color;

		// Menu
		this.$menu = this.$target.find('.js-menu');
		this.$menuOverlay = this.$overlay.find('.js-menu-overlay');
		this.$menuLinks = this.$overlay.find('.menu-overlay > li > a');
		this.$menuColumn = this.$overlay.find('.header__menu-column');
		this.$menuSmoothScrollingContainer = this.$overlay.find('.js-header-smooth-scroll-container');
		this.$menuGradientTop = this.$overlay.find('.header__menu-gradient_top');
		this.$menuGradientBottom = this.$overlay.find('.header__menu-gradient_bottom');
		this.selectedClass = 'selected';
		this.openClass = 'opened';
		this.currentMenuItemClass = 'current-menu-item';
		this.currentMenuAncestorClass = 'current-menu-ancestor';
		this.menuItemHasChildrenClass = 'menu-item-has-children';
		this.hoverClassOverlay = 'menu-overlay_hover';
		this.hoverClassClassic = 'menu_hover';

		// Submenu
		this.$submenu = this.$overlay.find('.menu-overlay .sub-menu');
		this.$submenuButton = $('#js-submenu-back');
		this.$submenuOpeners = this.$overlay.find(`.${this.menuItemHasChildrenClass} > a`);
		this.$submenuLinks = this.$submenu.find('> li > a');
		this.currentSubmenuLabel = '';
		this.prevSubmenuLabel = '';

		// Sticky
		this.stickyScene = undefined;
		this.stickyClass = 'header_sticky';
		this.stickyTimeline = new gsap.timeline();

		// Scrollbar
		this.SB = undefined;

		// Lock
		this.lockClass = 'pointer-events-none';
		this.unlockClass = 'pointer-events-auto';

		this.labelTimeline = new gsap.timeline();

		this.setMenu();
		this._setMenusHover();
	}

	run() {
		if (typeof this.stickyScene !== 'undefined') {
			this.stickyScene.refresh();
			this.stickyScene.disable();
		}

		this.timeline = new gsap.timeline();

		this._correctTopOffset();
		this._stick();
		this._bindEvents();
		this._handleAnchors();
		this._runSmoothScrollOverlayMenu();
		this._setGradientBackgrounds();
		this._closeOnResizeIfClassicLayout();
	}

	setBurger(open = false) {
		if (open) {
			this.$target.addClass(this.openClass);
			this.$burger.addClass(this.burgerOpenClass);
		} else {
			this.$target.removeClass(this.openClass);
			this.$burger.removeClass(this.burgerOpenClass);
		}
	}

	setMenu() {

		if (this.$wrapperSlider.length) {
			gsap.set(this.$wrapperSlider, {
				autoAlpha: 0
			});
		}

		if (this.$overlay.length) {
			gsap.set(this.$overlay, {
				autoAlpha: 0,
			});
		}

		if (this.$menuOverlay.length) {
			this.$menuOverlay.removeClass(this.lockClass).addClass(this.unlockClass);
		}

		if (this.$submenu.length) {
			gsap.set(this.$submenu, {
				autoAlpha: 0
			});
			this.$submenu.removeClass(this.unlockClass).addClass(this.lockClass);
		}

		if (this.$submenuButton.length) {
			gsap.set(this.$submenuButton, {
				autoAlpha: 0
			});
		}

		this.$submenu.removeClass(this.openClass);
		this.$target.removeClass(this.openClass);
		this.$burger.removeClass(this.burgerOpenClass);

		if (this.$menuLinks.length) {
			gsap.effects.setLines(this.$menuLinks, {
				autoAlpha: 1,
				y: '-100%'
			});
		}

		if (this.$submenuLinks.length) {
			gsap.effects.setLines(this.$submenuLinks, {
				autoAlpha: 1,
				y: '-100%'
			});
		}

		if (this.$overlayWidgets.length) {
			gsap.effects.setLines(this.$overlayWidgets, {
				autoAlpha: 1,
				y: this._isMediumScreen() ? '-100%' : '100%'
			});
		}

		if (this.$infoLabel.length) {
			gsap.set(this.$infoLabel, {
				x: -30,
				autoAlpha: 0
			});
		}

		this.$wrapperMenu.scrollTop(0);

		if (typeof this.SB !== 'undefined') {
			this.SB.scrollTo(0, 0);
		}
	}

	openMenu() {
		const timeScale = parseFloat(window.kinsey.theme.animations.timeScale.overlayMenuOpen) || 1;

		return this.timeline
			.clear()
			.set(this.$overlay, {
				autoAlpha: 1,
			})
			.add([() => {
				this._setTransition(true);

				// save current color theme which
				// can be different from the initial one
				this.colorSaved = this._getColorTheme();
				this.el.dispatchEvent(new CustomEvent('menuOpenStart'));
				this._unstick();
				this._updateThemeHeader({
					text: this.color.overlay.text
				});
			}])
			.set(this.$adminBar, {
				position: 'fixed',
			})
			.animateMask(this.$maskRevealOverlay, {
				scale: 1,
				direction: 'down'
			}, 'start')
			.to(this.$headerLeft, {
				duration: 1.2,
				x: 30,
				autoAlpha: 0,
				ease: 'expo.inOut'
			}, 'start')
			.to(this.$infoLabel, {
				duration: 1.2,
				x: 0,
				autoAlpha: 1,
				ease: 'expo.inOut'
			}, 'start')
			.add(() => {
				this.$target.addClass(this.openClass);
			}, '-=0.6')
			.add([
				gsap.effects.animateLines(this.$menuLinks, {
					stagger: {
						amount: 0.3,
						from: 'end'
					},
					duration: 1.2,
					ease: 'power4.out'
				}),
				gsap.effects.animateLines(this.$overlayWidgets, {
					stagger: {
						amount: 0.3,
						from: this._isMediumScreen() ? 'end' : 'start'
					},
					duration: 1.2,
					ease: 'power4.out'
				}),
			], '-=1.0')
			.to(this.$wrapperSlider, {
				autoAlpha: 1,
				duration: 1.8
			}, 'start')
			.add(() => {
				this.el.dispatchEvent(new CustomEvent('menuOpenEnd'));
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(timeScale);
	}

	closeMenu(force = false, cb) {

		if (!this.$target.hasClass(this.openClass) && !force) {
			return this.timeline;
		}

		const
			$submenuLinksCurrent = this.$submenu.filter(`.${this.openClass}`).find(this.$submenuLinks),
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.overlayMenuClose) || 1;

		return this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				this.el.dispatchEvent(new CustomEvent('menuCloseStart'));
				this._stick();

				if (this.$stickyHeader.length && window.pageYOffset >= 1) {
					this.$stickyHeader.addClass(this.stickyClass);

					// restore theme header from the saved version
					this._updateThemeHeader({
						theme: this.colorSaved.sticky.theme,
						text: this.colorSaved.sticky.text
					});
				} else {
					this._updateThemeHeader({
						text: this.colorSaved.normal.text
					});
				}
			})
			.to(this.$wrapperSlider, {
				autoAlpha: 0,
				duration: 1.8
			}, 'start')
			.hideMask(this.$maskRevealOverlay, {
				scale: 1,
				direction: 'down',
			}, 'start')
			.set(this.$adminBar, {
				clearProps: 'position'
			})
			.to(this.$headerLeft, {
				duration: 1.2,
				x: 0,
				autoAlpha: 1
			}, 'start')
			.to(this.$infoLabel, {
				duration: 1.2,
				x: -30,
				autoAlpha: 0
			}, 'start')
			.to(this.$submenuButton, {
				x: -10,
				autoAlpha: 0,
				duration: 0.3
			}, 'start')
			.add(() => {
				this.$target.removeClass(this.openClass);
			}, '-=0.9')
			.add([
				gsap.effects.hideLines([$submenuLinksCurrent, this.$menuLinks, this.$overlayWidgets], {
					stagger: {
						amount: 0,
						from: 'end'
					},
					y: '100%',
					duration: 0.6,
				})
			], 'start')
			.add(() => {
				if (typeof cb === 'function') {
					cb();
				}
				this.el.dispatchEvent(new CustomEvent('menuCloseEnd'));
				this.setMenu();
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(timeScale);
	}

	closeMenuTransition(force = false, cb) {

		if (!this.$target.hasClass(this.openClass) && !force) {
			return this.timeline;
		}

		const
			tl = new gsap.timeline(),
			$submenuLinksCurrent = this.$submenu.filter(`.${this.openClass}`).find(this.$submenuLinks),
			timeScale = window.kinsey.theme.animations.timeScale.overlayMenuClose || 1;

		return tl
			.add(() => {
				this._setTransition(true);
				this.el.dispatchEvent(new CustomEvent('menuCloseStart'));
				this.setBurger(false);
			})
			.to(this.$wrapperSlider, {
				autoAlpha: 0,
				duration: 1.8
			}, 'start')
			.hideMask(this.$maskRevealOverlay, {
				scale: 1,
				direction: 'down',
			}, 'start')
			.set(this.$adminBar, {
				clearProps: 'position'
			})
			.to(this.$headerLeft, {
				duration: 1.2,
				x: 0,
				autoAlpha: 1
			}, 'start')
			.to(this.$infoLabel, {
				duration: 1.2,
				x: -30,
				autoAlpha: 0
			}, 'start')
			.to(this.$submenuButton, {
				x: -10,
				autoAlpha: 0,
				duration: 0.3
			}, 'start')
			.add(() => {
				this.$target.removeClass(this.openClass);
			}, '-=0.9')
			.add([
				gsap.effects.hideLines([$submenuLinksCurrent, this.$menuLinks, this.$overlayWidgets], {
					stagger: {
						amount: 0,
						from: 'end'
					},
					y: '100%',
					duration: 0.6,
				})
			], 'start')
			.add(() => {
				if (typeof cb === 'function') {
					cb();
				}
				this.el.dispatchEvent(new CustomEvent('menuCloseEnd'));
				this.setMenu();
				this._setTransition(false);
			})
			.timeScale(timeScale);
	}

	_bindEvents() {
		const self = this;

		if (this.$adminBar.length) {
			window.$window.on('resize', debounce(() => {
				this._correctTopOffset();
			}, 250));
		}

		if (this.$burger.length) {
			this.$burger.off('click').on('click', (e) => {
				e.preventDefault();

				if (this._isInTransition()) {
					return;
				}

				if (this.$burger.hasClass(this.burgerOpenClass)) {
					this.closeMenu();
					this.$burger.removeClass(this.burgerOpenClass);
				} else {
					this.openMenu();
					this.$burger.addClass(this.burgerOpenClass);
				}
			});
		}

		if (this.$submenuOpeners.length) {
			this.$submenuOpeners.on('click', function (e) {
				if (self._isInTransition()) {
					e.preventDefault();
					return;
				}

				const
					$el = $(this),
					$currentMenu = $el.parents('ul'),
					$submenu = $el.next('.sub-menu');

				if ($submenu.length) {
					e.preventDefault();

					$el.addClass(self.linkSelectedClass);

					self._openSubmenu({
						submenu: $submenu,
						currentMenu: $currentMenu
					});

					self._updateLabel({
						text: $el.find('.menu-overlay__heading').text()
					});
				}
			});
		}

		if (this.$submenuButton.length) {
			this.$submenuButton.on('click', (e) => {
				e.preventDefault();

				if (self._isInTransition()) {
					return;
				}

				const $submenu = this.$submenu.filter(`.${this.openClass}`),
					$prevMenu = $submenu.parent('li').parent('ul');

				self._closeSubmenu({
					submenu: $submenu,
					currentMenu: $prevMenu
				});

				self._updateLabel({
					text: $prevMenu.siblings('a').find('.menu-overlay__heading').text()
				});
			});
		}

		window.$window
			.on('arts/barba/transition/start', () => {
				this._unstick();
				this._setTransition(true);
			})
			.on('arts/barba/transition/end', () => {
				this.$controls.removeClass('pointer-events-none');
				this.color = this._getColorTheme();
				this.stickyScene = undefined;
				this.timeline.clear();
				this._stick();
				this._setTransition(false);
				this._handleAnchors();
				this._setGradientBackgrounds();
			});
	}

	isOverlayOpened() {
		return this.$target.hasClass(this.openClass);
	}

	_getColorTheme() {
		return {
			normal: {
				text: this.$target.attr('data-arts-theme-text') || 'dark'
			},
			sticky: {
				theme: this.$stickyHeader.attr('data-arts-header-sticky-theme') || null,
				text: this.$stickyHeader.attr('data-arts-header-sticky-theme-text') || 'dark'
			},
			overlay: {
				text: this.$target.attr('data-arts-header-overlay-theme-text') || 'dark'
			}
		};
	}

	_updateThemeHeader({
		theme,
		removeTheme,
		text,
	}) {
		if (theme) {
			this.$target.addClass(theme);
		}

		if (text) {
			this.$target.attr('data-arts-theme-text', text);
		}

		if (removeTheme) {
			this.$target.removeClass(removeTheme);
		}
	}

	_isMediumScreen() {
		return true; //window.Modernizr.mq('(max-width: 991px)');
	}

	_isInTransition() {
		return this.$target.attr('data-arts-header-animation') === 'intransition';
	}

	_setTransition(inTransition = true) {
		return this.$target.attr('data-arts-header-animation', inTransition ? 'intransition' : '');
	}

	_correctTopOffset() {
		this.$adminBar = $('#wpadminbar');
		const top = this.$adminBar.length ? this.$adminBar.height() : 0;

		if (top > 0) {
			gsap.to(this.$target, {
				duration: 0.6,
				top
			});
		}
	}

	_stick() {
		if (!this.$stickyHeader.length) {
			return;
		}

		if (this.stickyScene) {
			this.stickyScene.refresh(true);
			this.stickyScene.enable();
			return;
		}

		const classesToggle = [this.color.sticky.theme, this.stickyClass].join(' ');

		this.stickyScene = ScrollTrigger.create({
			start: 2,
			end: 'bottom center',
			scrub: true,
			onEnter: () => {
				this._updateThemeHeader({
					theme: classesToggle,
					text: this.color.sticky.text
				});
			},
			onLeaveBack: () => {
				this._updateThemeHeader({
					removeTheme: classesToggle,
					text: this.color.normal.text
				});
			}
		});
	}

	_unstick() {
		if (!this.$stickyHeader.length || !this.stickyScene) {
			return;
		}

		const classesToggle = [this.color.sticky.theme, this.stickyClass].join(' ');

		this.stickyScene.disable();
		this._updateThemeHeader({
			removeTheme: classesToggle
		});
	}

	_openSubmenu({
		submenu,
		currentMenu
	}) {
		const
			$currentLinks = currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = submenu.find('> li > a .menu-overlay__item-wrapper');

		this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				this.$submenu.removeClass(this.openClass);
				submenu.not(this.$menuOverlay).addClass(this.openClass);

				this.$submenu.not(submenu).removeClass(this.unlockClass).addClass(this.lockClass);
				submenu.removeClass(this.lockClass).addClass(this.unlockClass);

				if (typeof this.SB !== 'undefined') {
					this.SB.track.yAxis.hide();
					this.SB.track.update();
				}

				if (this.$submenu.hasClass(this.openClass)) {
					this.$menuOverlay.removeClass(this.unlockClass).addClass(this.lockClass);

					gsap.to(this.$submenuButton, {
						autoAlpha: 1,
						x: 0,
						duration: 0.3
					});

					if (this._isMediumScreen()) {
						gsap.effects.hideLines(this.$overlayWidgets, {
							stagger: {
								amount: 0.1,
								from: 'end'
							},
							y: '100%',
							duration: 1.2,
							ease: 'power4.out',
						});
					}
				} else {
					this.$menuOverlay.removeClass(this.lockClass).addClass(this.unlockClass);

					gsap.to(this.$submenuButton, {
						autoAlpha: 0,
						x: -10,
						duration: 0.3
					});

					gsap.effects.animateLines(this.$overlayWidgets, {
						stagger: {
							amount: 0.2,
							from: 'end'
						},
						duration: 1.2,
						ease: 'power4.out',
					});
				}
			})
			.set(submenu, {
				autoAlpha: 1,
				zIndex: 100
			})
			.add(gsap.effects.hideLines($currentLinks, {
				stagger: {
					amount: 0.2,
					from: 'end'
				},
				y: '100%',
				duration: 1.2,
				ease: 'power4.out'
			}))
			.add(gsap.effects.animateLines($submenuLinks, {
				stagger: {
					amount: 0.2,
					from: 'end'
				},
				duration: 1.2,
				ease: 'power4.out',
				onStart: () => {
					this.$wrapperMenu.scrollTop(0);
					// reset virtual scroll position
					if (typeof this.SB !== 'undefined') {
						this.SB.scrollTo(0, 0);
						this.SB.track.yAxis.hide();
					}
				},
			}), '-=0.9')
			.add(() => {
				this.$menuLinks.removeClass(this.openClass);
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(1.25);
	}

	_closeSubmenu({
		submenu,
		currentMenu
	}) {
		const
			$currentLinks = currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = submenu.find('> li > a .menu-overlay__item-wrapper');

		this.timeline
			.clear()
			.add(() => {
				this._setTransition(true);
				this.$submenu.removeClass(this.openClass);
				currentMenu.not(this.$menuOverlay).addClass(this.openClass);

				this.$submenu.not(currentMenu).removeClass(this.unlockClass).addClass(this.lockClass);
				currentMenu.removeClass(this.lockClass).addClass(this.unlockClass);

				if (typeof this.SB !== 'undefined') {
					this.SB.track.yAxis.hide();
					this.SB.track.update();
				}

				if (this.$submenu.hasClass(this.openClass)) {
					this.$menuOverlay.removeClass(this.unlockClass).addClass(this.lockClass);

					gsap.to(this.$submenuButton, {
						autoAlpha: 1,
						x: 0,
						duration: 0.3
					});

					if (this._isMediumScreen()) {
						gsap.effects.hideLines(this.$overlayWidgets, {
							stagger: {
								amount: 0.1,
								from: 'start'
							},
							y: '100%',
							duration: 1.2,
							ease: 'power4.out',
						});
					}
				} else {
					this.$menuOverlay.removeClass(this.lockClass).addClass(this.unlockClass);

					gsap.to(this.$submenuButton, {
						autoAlpha: 0,
						x: -10,
						duration: 0.3
					});

					gsap.effects.animateLines(this.$overlayWidgets, {
						stagger: {
							amount: 0.2,
							from: 'start'
						},
						duration: 1.2,
						ease: 'power4.out',
					});
				}
			})
			.set(submenu, {
				zIndex: -1
			})
			.add(gsap.effects.setLines($currentLinks, {
				y: '100%'
			}), 'start')
			.add(gsap.effects.hideLines($submenuLinks, {
				stagger: {
					amount: 0.1,
					from: 'start'
				},
				y: '-100%',
				duration: 1.2,
				ease: 'power4.out'
			}))
			.add(
				gsap.effects.animateLines($currentLinks, {
					stagger: {
						amount: 0.2,
						from: 'start'
					},
					duration: 1.2,
					ease: 'power4.out',
					onStart: () => {
						this.$wrapperMenu.scrollTop(0);
						// reset virtual scroll position
						if (typeof this.SB !== 'undefined') {
							this.SB.scrollTo(0, 0);
							this.SB.track.yAxis.hide();
						}
					},
				}), '-=0.9')
			.set(submenu, {
				autoAlpha: 0,
			})
			.add(() => {
				this._setTransition(false);
			}, '-=0.6')
			.timeScale(1.25);
	}

	_handleAnchors() {

		const self = this;

		// overlay anchor links
		this.$allLinksOverlay.filter('a[href*="#"]:not([href="#"]):not([href*="#elementor-action"])').each(function () {
			const
				$current = $(this),
				url = $current.attr('href');

			self._scrollToAnchorFromMenu({
				element: $current,
				url,
				menu: 'overlay'
			});
		});

		// classic menu anchor links
		this.$allLinksClassic.filter('a[href*="#"]:not([href="#"]):not([href*="#elementor-action"])').each(function () {
			const
				$current = $(this),
				url = $current.attr('href');

			self._scrollToAnchorFromMenu({
				element: $current,
				url,
				menu: 'classic'
			});
		});

	}

	_scrollToAnchorFromMenu({
		element,
		url,
		menu = 'classic'
	}) {
		if (!url || !element) {
			return;
		}

		const filteredUrl = url.substring(url.indexOf('#'));

		try {
			if (filteredUrl.length) {
				const $el = window.$pageWrapper.find(filteredUrl);

				if ($el.length) {
					element.on('click', (e) => {
						e.stopPropagation();
						e.preventDefault();

						if (menu === 'classic') {
							Scroll.scrollTo({
								y: $el.offset().top - this.$target.innerHeight(),
								duration: 0.8
							});
						}

						if (menu === 'overlay') {
							this.closeMenu(false, () => {
								Scroll.scrollTo({
									y: $el.offset().top - this.$target.innerHeight(),
									duration: 0.8
								});
							});
						}
					});

				} else {
					element.off('click');
				}
			}
		} catch (error) {
			console.error('Error when handling menu anchor links: ' + error);
		}

	}

	_runSmoothScrollOverlayMenu() {
		if (!window.Modernizr.touchevents && this.$menuSmoothScrollingContainer.length && typeof window.Scrollbar !== 'undefined') {
			this.SB = window.Scrollbar.init(this.$menuSmoothScrollingContainer[0], window.kinsey.theme.smoothScroll);
		}
	}

	_setGradientBackgrounds() {

		if (this.$menuGradientTop.length) {
			this.$menuGradientTop.each(function () {
				const
					$this = $(this),
					ancestorRGB = getColorValues($this.parent().css('background-color'));

				if (ancestorRGB) {
					gsap.set($this, {
						background: `linear-gradient(0deg, rgba(${ancestorRGB[0]}, ${ancestorRGB[1]}, ${ancestorRGB[2]}, 0) 0%, rgba(${ancestorRGB[0]}, ${ancestorRGB[1]}, ${ancestorRGB[2]}, 1) 100%)`
					});
				}
			});
		}

		if (this.$menuGradientBottom.length) {
			this.$menuGradientBottom.each(function () {
				const
					$this = $(this),
					ancestorRGB = getColorValues($this.parent().css('background-color'));

				if (ancestorRGB) {
					gsap.set($this, {
						background: `linear-gradient(180deg, rgba(${ancestorRGB[0]}, ${ancestorRGB[1]}, ${ancestorRGB[2]}, 0) 0%, rgba(${ancestorRGB[0]}, ${ancestorRGB[1]}, ${ancestorRGB[2]}, 1) 100%)`
					});
				}
			});
		}
	}

	_updateLabel({
		text = 'text'
	}) {
		if (this.$headerLabelSubmenu.length) {
			this.labelTimeline
				.clear()
				.to(this.$headerLabelSubmenu, {
					y: '-50%',
					autoAlpha: 0,
					duration: 0.3,
					onComplete: () => {
						this.$headerLabelSubmenu.text(text);
					}
				})
				.fromTo(this.$headerLabelSubmenu, {
					y: '50%',
					autoAlpha: 0
				}, {
					y: '0%',
					autoAlpha: 1,
					duration: 0.3,
					immediateRender: false
				});
		}
	}

	_setMenusHover() {
		const self = this;

		if (this.$allLinksOverlay.length) {
			this.$allLinksOverlay
				.on('mouseenter touchstart', function () {
					self.$menuOverlay.addClass(self.hoverClassOverlay);
				})
				.on('mouseleave touchend', function () {
					self.$menuOverlay.removeClass(self.hoverClassOverlay);
				});
		}

		if (this.$allLinksClassic.length) {
			this.$allLinksClassic
				.on('mouseenter touchstart', function () {
					self.$menu.addClass(self.hoverClassClassic);
				})
				.on('mouseleave touchend', function () {
					self.$menu.removeClass(self.hoverClassClassic);
				})
				.on('click', function (e) {
					const $currentTarget = $(e.currentTarget);

					self.$menu.find(`.${self.currentMenuItemClass}`).removeClass(`${self.currentMenuItemClass}`);
					self.$menu.find(`.${self.currentMenuAncestorClass}`).removeClass(`${self.currentMenuAncestorClass}`);
					$currentTarget.parent().addClass(`${self.currentMenuItemClass}`);
					$currentTarget.parents(`.${self.menuItemHasChildrenClass}`).last().addClass(`${self.currentMenuAncestorClass}`);
				});
		}
	}

	_closeOnResizeIfClassicLayout() {
		const mqHeader = window.matchMedia('(min-width: 992px');

		if (this.$menu.length && this.$menuOverlay.length) {
			mqHeader.onchange = (e) => {
				if (e.matches && this.isOverlayOpened() === true) {
					this.closeMenu();
				}
			};
		}
	}
}
