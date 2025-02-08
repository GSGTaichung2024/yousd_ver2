(function ($) {

'use strict';

/*!==========================================================================
 * ==========================================================================
 * ==========================================================================
 *
 * Kinsey – AJAX Agency HTML5 Template
 *
 * [Table of Contents]
 *
 * 1. Animations
 * 2. Assets Manager
 * 3. Base Component
 * 4. PSWP
 * 5. Scroll
 * 6. Slider
 * 7. PJAX Animate Cloned Heading
 * 8. PJAX Animate Cloned Image
 * 9. PJAX Animate Container
 * 10. PJAX Animate Curtain
 * 11. PJAX Animate Overlay Menu
 * 12. PJAX Clear Container
 * 13. PJAX Clone Heading
 * 14. PJAX Clone Image
 * 15. PJAX Fallback Cloned Image
 * 16. PJAX Finish Loading
 * 17. PJAX Init New Page
 * 18. PJAX Init Next Masthead
 * 19. PJAX Set Body Background
 * 20. PJAX Set Current Container
 * 21. PJAX Set Next Container
 * 22. PJAX Start Loading
 * 23. PJAX Transition Auto Scroll Next
 * 24. PJAX Transition General
 * 25. PJAX Transition Overlay Menu
 * 26. PJAX Update Ad Trackers
 * 27. PJAX Update Body
 * 28. PJAX Update Head
 * 29. PJAX Update Nodes Attributes
 * 30. PJAX Update Scripts
 * 31. PJAX Update Styles
 * 32. PJAX
 * 33. Arts Hover
 * 34. Button Circles
 * 35. Count Down
 * 36. Filter
 * 37. Gmap
 * 38. Form
 * 39. Form AJAX
 * 40. Grid
 * 41. PSWP Gallery
 * 42. Scroll Down
 * 43. Section Fixed Reveal
 * 44. Section Horizontal Scroll
 * 45. Slider Dots
 * 46. Slider Text Transitions
 * 47. Smooth Scroll
 * 48. Mobile Bar Height
 * 49. Debounce
 * 50. Distribute By Position
 * 51. Get Color Values
 * 52. Get Responsive Resize Event
 * 53. Is Browser Firefox
 * 54. Run On High Performance GPU
 * 55. Sanitize Selector
 * 56. Sync Attributes
 * 57. Lazy Load
 * 58. Preloader
 * 59. Header
 * 60. Slider Menu
 * 61. Slider Projects
 * 62. Slider Projects Fullscreen
 * 63. Slider Testimonials
 * 64. Slider Images
 * 65. Section Content
 * 66. Section Grid
 * 67. Section Nav Projects
 * 68. Section Scroll Theme Switch
 * 69. Section Masthead
 * 70. Section Slider Images
 * 71. Section Slider Projects Fullscreen
 * 72. Section Testimonials
 * 73. Section Slider Projects
 *
 * ==========================================================================
 * ==========================================================================
 * ==========================================================================
 */

/**
 * Try to use high performance GPU on dual-GPU systems
 */
runOnHighPerformanceGPU();

/**
 * GSAP: turn off console warnings
 * and include plugins
 */
gsap.config({
	nullTargetWarn: false
});
gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(ScrollTrigger);

/**
 * Global Vars
 */
window.$document = $(document);
window.$window = $(window);
window.$body = $('body');
window.$html = $('html');
window.$pageHeader = $('#page-header');
window.$pagePreloader = $('#js-preloader');
window.$pageWrapper = $('#page-wrapper');
window.$pageContent = $('.page-wrapper__content');
window.$transitionCurtain = $('#js-page-transition-curtain');
window.$barbaWrapper = $('[data-barba="wrapper"]');
window.$cursor = $('#js-arts-cursor');
window.$spinner = $('#js-spinner');

/**
 * Default Template Options
 */
if (typeof window.kinsey === 'undefined') {
	window.kinsey = {
		loading: new Preloader(),
		theme: {
			ajax: {
				enabled: true,
				preventRules: '', // jQuery selectors of the elements to exclude them from AJAX transitions
				updateNodesAttributes: '',
				updateScriptNodes: '',
				loadMissingScripts: true,
				loadMissingStyles: true,
				evalInlineContainerScripts: false
			},
			animations: {
				triggerHook: 0.15,
				timeScale: { // slow down or speed up the animations
					onScrollReveal: 1.0,
					overlayMenuOpen: 1.0,
					overlayMenuClose: 1.5,
					preloader: 1.0,
					ajaxFlyingImageTransition: 1.0,
					ajaxCurtainTransition: 1.0
				}
			},
			cursorFollower: {
				enabled: true,
				highlight: {
					scale: 1.5
				},
				arrows: {
					distance: 45
				},
				trailing: 8,
				animationDuration: 0.25
			},
			smoothScroll: { // more info https://github.com/idiotWu/smooth-scrollbar/tree/develop/docs
				enabled: true,
				damping: 0.12,
				renderByPixels: true,
				continuousScrolling: false,
				plugins: {
					edgeEasing: true,
					disableScroll: {
						direction: 'x'
					}
				}
			},
			mobileBarFix: {
				enabled: true,
				update: true
			},
			isFirstLoad: true
		},
		assets: {
			promises: []
		}
	}
}

/* Start Preloader */
window.kinsey.loading.start();

/**
 * Page Load Strategy
 */
document.addEventListener('DOMContentLoaded', (e) => {

	new Animations();

	// init on each AJAX transition
	if (e.detail) {

		initComponents(e.detail);

	} else { // init only on initial page load

		initComponentsOnce({
			scope: window.$document
		});

		initComponents({
			scope: window.$document
		});

		setTimeout(() => {
			window.kinsey.loading.finish();
		}, 200);
	}

});

/**
 * Init Template Components
 * You can init your custom scripts here
 * in that function
 */
function initComponents({
	scope = window.$document,
	container = window.$pageWrapper,
	scrollToHashElement = true
}) {

	const
		$smoothScrollContainer = container.filter('.js-smooth-scroll'),
		$sectionMasthead = scope.find('.section-masthead:not(.d-none):not(.js-cancel-init)'),
		$sectionSliderProjects = scope.find('.section-slider-projects'),
		$sectionSliderProjectsFullscreen = scope.find('.section-slider-projects-fullscreen'),
		$sectionNavProjects = scope.find('.section-nav-projects'),
		$sectionSliderImages = scope.find('.section-slider-images'),
		$sectionHorizontalScroll = scope.find('[data-arts-horizontal-scroll="container"]'),
		$sectionFixedReveal = scope.find('[data-arts-fixed-reveal]'),
		$sectionContent = scope.find('.section-content'),
		$sectionTestimonials = scope.find('.section-testimonials'),
		$sectionScrollThemeSwitch = scope.find('.section-scroll-theme-switch'),
		$googleMap = scope.find('.js-gmap'),
		$hoverGroup = scope.find('[data-arts-hover-class]'),
		$buttonCircles = scope.find('.js-button-circles'),
		$gallery = scope.find('.js-gallery'),
		$sectionGrid = scope.find('.section-grid'),
		$scrollDown = scope.find('[data-arts-scroll-down]'),
		$countDown = scope.find('[data-count-down]'),
		$formContact = scope.find('.js-ajax-form');

	if ($smoothScrollContainer.length) {
		new SmoothScroll({
			target: $smoothScrollContainer,
			adminBar: $('#wpadminbar'),
			absoluteElements: $('[data-arts-scroll-absolute]'), // correct handling of absolute elements OUTSIDE scrolling container
			fixedElements: $('[data-arts-scroll-fixed]') // correct handling of fixed elements INSIDE scrolling container
		});
	}

	if ($sectionMasthead.length) {
		$sectionMasthead.each(function () {
			new SectionMasthead({
				target: $(this),
				scope
			});
		});
	}

	// mobile bottom bar height fix
	if (window.kinsey.theme.mobileBarFix.enabled) {
		new MobileBarHeight();
	}

	if ($sectionGrid.length) {
		$sectionGrid.each(function () {
			new SectionGrid({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionSliderProjectsFullscreen.length) {
		$sectionSliderProjectsFullscreen.each(function () {
			new SectionSliderProjectsFullscreen({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionSliderProjects.length) {
		$sectionSliderProjects.each(function () {
			new SectionSliderProjects({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionSliderImages.length) {
		$sectionSliderImages.each(function () {
			new SectionSliderImages({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionHorizontalScroll.length) {
		$sectionHorizontalScroll.each(function () {
			new SectionHorizontalScroll({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionFixedReveal.length) {
		$sectionFixedReveal.each(function () {
			new SectionFixedReveal({
				target: $(this),
				scope
			});
		});
	}

	if ($buttonCircles.length) {
		$buttonCircles.each(function () {
			new ButtonCircles({
				target: $(this),
				scope
			});
		});
	}

	if ($hoverGroup.length) {
		$hoverGroup.each(function () {
			new ArtsHover({
				target: $(this),
				scope
			});
		});
	}

	new Form({
		target: scope,
		scope
	});

	if ($formContact.length) {
		$formContact.each(function () {
			new FormAJAX({
				target: $(this),
				scope
			});
		});
	}

	if ($googleMap.length) {
		AssetsManager
			.loadGoogleMap({
				id: 'googlemap'
			})
			.then(() => {
				$googleMap.each(function () {
					new GMap({
						target: $(this),
						scope
					});
				});
			});
	}

	if ($sectionContent.length) {
		$sectionContent.each(function () {
			new SectionContent({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionTestimonials.length) {
		$sectionTestimonials.each(function () {
			new SectionTestimonials({
				target: $(this),
				scope
			});
		});
	}

	if ($sectionScrollThemeSwitch.length) {
		$sectionScrollThemeSwitch.each(function () {
			new SectionScrollThemeSwitch({
				target: $(this),
				scope
			});
		})
	}

	if ($gallery.length) {
		$gallery.each(function () {
			new PSWPGallery({
				target: $(this),
				scope,
				options: { // Pass your custom PhotoSwipe options here https://photoswipe.com/documentation/options.html
					history: window.kinsey.theme.ajax.enabled ? false : true, // galleries URLs navigation is NOT compatible with AJAX
					showAnimationDuration: 300,
				}
			});
		});
	}

	if ($scrollDown.length) {
		$scrollDown.each(function () {
			new ScrollDown({
				target: $(this),
				scope,
				duration: 0.6
			});
		})
	}

	if ($countDown.length) {
		$countDown.each(function () {
			new CountDown({
				target: $(this),
				scope
			});
		})
	}

	if ($sectionNavProjects.length) {
		$sectionNavProjects.each(function () {
			new SectionNavProjects({
				target: $(this),
				scope
			});
		});
	}

	// refresh animation triggers
	// for Waypoints library
	if (typeof Waypoint !== 'undefined') {
		Waypoint.refreshAll();
	}

	// scroll to anchor from URL hash
	if (scrollToHashElement) {
		Scroll.scrollToAnchorFromHash();
	}
}

/**
 * Init Template Components
 * only once after the initial
 * page load
 */
function initComponentsOnce({
	scope = window.$document,
	container = window.$pageWrapper
}) {

	const $sliderMenu = scope.find('.js-slider-menu');

	// Run cursor follower on non-touch devices
	if (window.kinsey.theme.cursorFollower.enabled && !window.Modernizr.touchevents && window.$cursor.length) {
		window.$html.addClass('cursorfollower');
		window.$cursor.artsCursor({
			target: {
				cursor: '[data-arts-cursor]',
				magnetic: '[data-arts-cursor-magnetic]',
				highlight: 'a:not(a[data-arts-cursor]):not(.social__item a):not(a.page-numbers):not(.js-arts-cursor-no-highlight), .js-arts-cursor-highlight, button:not(button[data-arts-cursor])',
				hideNative: '[data-arts-cursor-hide-native]',
				hideScaleMagnetic: '.slider__dot, .social__item, a.page-numbers',
			},
			elements: {
				follower: '.js-arts-cursor__follower',
				stroke: {
					inner: '.js-arts-cursor__stroke-inner',
					outer: '.js-arts-cursor__stroke-outer',
				},
				arrow: {
					up: '.js-arts-cursor__arrow-up',
					down: '.js-arts-cursor__arrow-down',
					left: '.js-arts-cursor__arrow-left',
					right: '.js-arts-cursor__arrow-right',
				},
				container: {
					label: '.js-arts-cursor__label',
					icon: '.js-arts-cursor__icon'
				}
			},
			effect: window.kinsey.theme.cursorFollower || {}
		});
	} else {
		window.$html.addClass('no-cursorfollower');
	}

	// Run AJAX navigation
	if (window.kinsey.theme.ajax.enabled && window.$barbaWrapper.length) {
		new PJAX({
			target: window.$barbaWrapper,
		});
	}

	// Run page header
	window.kinsey.theme.header = new Header({
		target: window.$pageHeader,
		scope
	});

	if ($sliderMenu.length) {
		$sliderMenu.each(function () {
			new SliderMenu({
				target: $(this),
				scope
			});
		});
	}

	/**
	 * Update ScrollTrigger when content container
	 * dimensions are changed
	 */
	const ro = new ResizeObserver(debounce(() => {
		ScrollTrigger.refresh();
	}, 250));

	document.addEventListener('arts/barba/transition/start', () => {
		ro.unobserve(window.$pageContent[0]);
	});

	document.addEventListener('DOMContentLoaded', () => {
		ro.observe(window.$pageContent[0]);
	});

	ro.observe(window.$pageContent[0]);
}

/*!========================================================================
	1. Animations
	======================================================================!*/
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

/*!========================================================================
	2. Assets Manager
	======================================================================!*/
class AssetsManager {
	static load({
		type = undefined, // script | stylesheet
		src = null,
		id = null, // id attribute in DOM
		refElement,
		version = null,
		timeout = 15000,
		cache = false
	}) {
		return new Promise((resolve, reject) => {
			// Don't load asset that is pending to load
			if (cache && id in window.kinsey.assets.promises) {
				// return existing loading promise
				window.kinsey.assets.promises[id].then(resolve, reject);
				return;
			}

			// CSS
			if (type === 'style') {
				const stylePromise = AssetsManager.loadStyle({
					src,
					id,
					refElement,
					timeout,
					version
				});

				window.kinsey.assets.promises[id] = stylePromise;
				return stylePromise.then(resolve, reject);

			} else if (type === 'script') { // JS
				const scriptPromise = AssetsManager.loadScript({
					src,
					id,
					refElement,
					timeout,
					version
				});

				window.kinsey.assets.promises[id] = scriptPromise;

				return scriptPromise.then(resolve, reject);

			} else { // Unknown type
				reject(new TypeError('Resource type "style" or "script" is missing.'));
			}
		});
	}

	static loadScript({
		src = null,
		id = null,
		refElement = document.body,
		version = null,
		timeout = 15000
	}) {
		return new Promise((resolve, reject) => {
			const
				element = document.querySelector(`script[id="${id}"]`),
				head = document.getElementsByTagName('head')[0];

			let script, timer, preload;

			if (!src) {
				reject(new TypeError('Resource URL is missing.'));
				return;
			}

			if (!id) {
				reject(new TypeError('Resource ID attribute is missing.'));
				return;
			}

			if (typeof element === 'undefined' || element === null) {

				if (version) {
					src += `?ver=${version}`;
				}

				if (window.kinsey.theme.isFirstLoad) {
					preload = document.createElement('link');
					preload.setAttribute('rel', 'preload');
					preload.setAttribute('href', src);
					preload.setAttribute('as', 'script');
					preload.setAttribute('type', 'text/javascript');
					head.prepend(preload);
				}

				script = document.createElement('script');
				script.setAttribute('type', 'text/javascript');
				script.setAttribute('async', 'async');
				script.setAttribute('src', src);
				script.setAttribute('id', id);
				refElement.append(script);

				script.onerror = (error) => {
					cleanup();
					refElement.removeChild(script);
					script = null;
					reject(new Error(`A network error occured while trying to load resouce ${src}`));
				}

				if (script.onreadystatechange === undefined) {
					script.onload = onload;
				} else {
					script.onreadystatechange = onload;
				}

				timer = setTimeout(script.onerror, timeout);

			} else {
				resolve(element);
			}

			function cleanup() {
				clearTimeout(timer);
				timer = null;
				script.onerror = script.onreadystatechange = script.onload = null;
			}

			function onload() {
				cleanup();
				if (!script.onreadystatechange || (script.readyState && script.readyState == 'complete')) {
					resolve(script);
					return;
				}
			}
		});
	}

	static loadStyle({
		src = null,
		id = null,
		refElement = document.head.querySelector('link[type="text/css"]'),
		version = null,
		timeout = 15000
	}) {
		return new Promise((resolve, reject) => {
			const
				element = document.querySelector(`link[id="${id}"]`),
				head = document.getElementsByTagName('head')[0];

			// don't load resouce that already exists
			if (typeof element !== 'undefined' && element !== null) {
				resolve(element);
			}

			if (!src) {
				reject(new TypeError('Resource URL is missing.'));
			}

			if (!id) {
				reject(new TypeError('Resource ID attribute is missing.'))
			}

			let
				link = document.createElement('link'),
				timer,
				sheet,
				cssRules,
				preload,
				c = (timeout || 10) * 100;

			if (version) {
				src += `?ver=${version}`;
			}

			if (window.kinsey.theme.isFirstLoad) {
				preload = document.createElement('link');
				preload.setAttribute('rel', 'preload');
				preload.setAttribute('href', src);
				preload.setAttribute('as', 'style');
				preload.setAttribute('type', 'text/css');
				head.prepend(preload);
			}

			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', src);

			if (typeof refElement !== 'undefined' && refElement !== null) {
				head.insertBefore(link, refElement);
			} else {
				head.append(link);
			}

			link.onerror = function (error) {
				if (timer) {
					clearInterval(timer);
				}
				timer = null;

				reject(new Error(`A network error occured while trying to load resouce ${src}`));
			};

			if ('sheet' in link) {
				sheet = 'sheet';
				cssRules = 'cssRules';
			} else {
				sheet = 'styleSheet';
				cssRules = 'rules';
			}

			timer = setInterval(function () {
				try {
					if (link[sheet] && link[sheet][cssRules].length) {
						clearInterval(timer);
						timer = null;
						resolve(link);
						return;
					}
				} catch (e) {}

				if (c-- < 0) {
					clearInterval(timer);
					timer = null;
					reject(new Error(`A network error occured while trying to load resouce ${src}`));
				}
			}, 10);


		});
	}

	static loadGoogleMap({
		id = 'googlemap'
	}) {
		return new Promise((resolve) => {
			const mapScript = document.getElementById(id);

			if ((typeof google === 'undefined' || typeof google.maps === 'undefined') && typeof mapScript !== 'undefined' && mapScript !== null) {
				AssetsManager
					.load({
						type: 'script',
						id: mapScript.id,
						src: mapScript.src
					})
					.then(() => resolve(true));
			} else {
				resolve(true);
			}
		});
	}
}

/*!========================================================================
	3. Base Component
	======================================================================!*/
class BaseComponent {

	constructor({
		target,
		scope = window.$document,
	}) {
		this.$scope = scope;
		this.$target = target;
		this.target = this.$target.get(0);
		this.$el = this.$target;
		this.el = this.$el.get(0);

		this.prepare();
	}

	prepare() {
		this
			.mount()
			.then(() => {
				this.set();
				this.run();
			});
	}

	set() {

	}

	init() {

	}

	_loadAnimations() {
		this.createAnimationScene({
			$el: this.$target
		});
		this.animateIn();
		this.animateInBatch();
	}

	run() {

		if (this.hasAnimationScene()) {
			// animate element out on transition start
			window.$window.one('arts/barba/transition/start', () => {
				// only currently visible elements
				if (this.$target.is(':in-viewport')) {
					this.animateOut();
				}
			});
		}

		if (this.hasInnerAnimationScenes()) {
			window.$window.one('arts/barba/transition/start', () => {
				// only currently visible elements
				if (this.$target.is(':in-viewport')) {
					this.animateOutBatch();
				}
			});
		}

		// * Active preloader
		// wait until preloader is ended
		if (window.$pagePreloader.is(':visible')) {
			window.$window.one('arts/preloader/end', () => {
				this._loadAnimations();
				this.init();
			});
		} else if (!window.kinsey.theme.isFirstLoad) { // * AJAX transition – wait until transition end
			window.$window.one('arts/barba/transition/end', () => {
				this._loadAnimations();
				this.init();
			});
		} else { // * No preloader and no transition
			this._loadAnimations();
			this.init();
		}
	}

	mount() {
		return new Promise((resolve) => {
			const
				$lazyImages = this.$target.find('.lazy img[data-src]:not(.swiper-lazy):not([data-arts-horizontal-scroll="wrapper"] .lazy img [data-src])'),
				$lazyBackgrounds = this.$target.find('.lazy-bg[data-src]:not(.swiper-lazy):not([data-arts-horizontal-scroll="wrapper"] .lazy-bg[data-src])'),
				$parallaxElements = this.$target.filter('.js-arts-parallax').add(this.$target.find('.js-arts-parallax'));

			// set lazy loading images
			if ($lazyImages.length) {
				this.lazyImages = new LazyLoad({
					images: $lazyImages
				});

				window.$window.one('arts/barba/transition/start', this.lazyImages.destroy);
			}

			// set lazy loading backgrounds
			if ($lazyBackgrounds.length) {
				this.lazyBackgrounds = new LazyLoad({
					backgrounds: $lazyBackgrounds
				});

				window.$window.one('arts/barba/transition/start', this.lazyBackgrounds.destroy);
			}

			// set parallax elements
			if ($parallaxElements.length) {
				this.parallax = $parallaxElements.artsParallax();
			}

			// prepare all the texts to split
			// wait for the fonts to load first
			document.fonts.ready.then(() => {
				const t = this.$target
					.find('.js-arts-split-text')
					.artsSplitText()
					.find('.arts-split-text__line')
					.filter(function () {
						const
							$this = $(this),
							display = $this.css('display');

						return display === 'inline-block' || display === 'inline-flex';
					});

				// split lines that became inline-block with a divider
				$(`<div class="w-100"></div>`).insertAfter(t);

				resolve(true);
			});
		});
	}

	hasAnimationScene() {
		const attr = this.target.hasAttribute('data-arts-os-animation');
		return attr && this.$target.attr('data-arts-os-animation') !== 'false';
	}

	hasInnerAnimationScenes() {
		return this.$target.find('[data-arts-os-animation]').length;
	}

	createAnimationScene({
		$el = this.$target,
		timeline = false,
		scrub = false,
		once = true,
	}) {
		const timeScale = parseFloat(window.kinsey.theme.animations.timeScale.onScrollReveal) || 1;

		// create a timeline
		this.timeline = timeline || new gsap.timeline({
			onStart: () => {
				if ($el.attr('data-arts-os-animation')) {
					$el.attr('data-arts-os-animation', 'animated');
				}
				$el.get(0).dispatchEvent(new CustomEvent('animation/start'));
			},
			onComplete: () => {
				$el.get(0).dispatchEvent(new CustomEvent('animation/complete'));
			}
		});

		this.timeline.timeScale(timeScale);

		// ScrollTrigger animation scene
		this.scrollTrigger = ScrollTrigger.create({
			trigger: $el,
			animation: this.timeline,
			start: () => `top+=${window.kinsey.theme.animations.triggerHook * 100}% bottom`,
			scrub,
			once
		});

		// animation out timeline
		this.timelineOut = new gsap.timeline();
	}

	animateIn() {

	}

	animateInBatch() {
		if (!this.hasInnerAnimationScenes()) {
			return;
		}

		const
			self = this,
			$animations = this.$target.find('[data-arts-os-animation-name]:not(.js-transition-animated)'),
			startTrigger = this.$target.attr('data-arts-os-animation-start') || `top+=${window.kinsey.theme.animations.triggerHook * 100}% bottom`,
			stagger = this.$target.attr('data-arts-os-animation-stagger') || 0.1,
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.onScrollReveal) || 1;

		if ($animations.length) {
			self.scrollTriggerBatch = ScrollTrigger.batch($animations, {
				interval: 0.05,
				start: () => startTrigger,
				scrub: false,
				once: true,
				onEnter: (batch) => {
					const
						tl = new gsap.timeline();

					$(batch).each(function () {
						const
							$this = $(this),
							animationSet = $this.attr('data-arts-os-animation'),
							animationName = $this.attr('data-arts-os-animation-name'),
							animationParams = $this.attr('data-arts-os-animation-params') || '{}';
						let parsedParamsObj = {};

						try {
							parsedParamsObj = JSON.parse(self._prepareJSON(animationParams));
						} catch (error) {
							console.error(`${animationParams} is not a valid parameters object`);
						}

						if (parsedParamsObj && animationName && typeof gsap.effects[animationName] === 'function') {

							if (animationSet) {
								$this.attr('data-arts-os-animation', 'animated');
								this.dispatchEvent(new CustomEvent('animation/start'));
							}
							tl[animationName]($this, parsedParamsObj, batch.length === 1 || !$this.is(':visible') ? '0' : `<${stagger}`).timeScale(timeScale);
						}

					});
				}
			});
		}
	}

	animateOut() { }

	animateOutBatch() {
		const tl = new gsap.timeline();

		this.$target.find('[data-arts-os-animation-name]:in-viewport').each(function () {
			const
				$this = $(this),
				defaultParams = {
					stagger: 0,
					delay: 0,
				},
				customParams = $this.attr('data-arts-os-animation-params'),
				params = $.extend(customParams, defaultParams),
				animationName = $this.attr('data-arts-os-animation-name').replace('animate', 'hide');

			if (animationName && typeof gsap.effects[animationName] === 'function') {
				tl.add(gsap.effects[animationName]($this, params), '0');
			}
		});
	}

	animateStagger({
		target,
		params,
		stagger = 0,
		animationName
	}) {
		const tl = new gsap.timeline();

		if (animationName && typeof tl[animationName] === 'function' && target && target.length) {
			$(target).each(function (index) {
				tl[animationName](this, params ? params : {}, index === 0 ? '0' : `<${stagger}`);
			});
		}

		return tl;
	}

	_prepareJSON(strObj) {
		if (!strObj) {
			return;
		}

		let filteredStr = strObj.replace(/'/g, '"');

		return filteredStr.replace(/(\w+:)|(\w+ :)/g, function (s) {
			return '"' + s.substring(0, s.length - 1) + '":';
		});
	}

}

/*!========================================================================
	4. PSWP
	======================================================================!*/
class PSWP extends BaseComponent {
	constructor({
		scope,
		target,
		options
	}) {
		super({
			scope,
			target
		});
		this.options = options || {
			history: false,
			showAnimationDuration: 300,
		};
		this._setGalleriesID();
		this.$pswpEl = $('.pswp');
		this.$container = this.$pswpEl.find('.pswp__container');
		this.pswpEl = this.$pswpEl.get(0);
	}

	_bindEvents() {
		const eventTouchUp = new CustomEvent('arts/pswp/touchUp', {
				detail: {
					direction: 'all'
				}
			}),
			eventTouchDown = new CustomEvent('arts/pswp/touchDown', {
				detail: {
					direction: 'all'
				}
			}),
			eventClose = new CustomEvent('arts/pswp/close'),
			eventSlideChange = new CustomEvent('arts/pswp/slideChange');

		this.$pswpEl
			.off('click')
			.on('click', '.pswp__button--arrow--left', (e) => {
				e.preventDefault();
				this.gallery.prev();
			}).on('click', '.pswp__button--arrow--right', (e) => {
				e.preventDefault();
				this.gallery.next();
			});

		window.$window.on('arts/barba/transition/start', () => {
			if (typeof this.gallery === 'object' && this.gallery.destroy === 'function') {
				this.gallery.destroy();
			}
		});

		// Dispatch cursor events
		this.gallery.listen('preventDragEvent', (e, isDown, preventObj) => {
			preventObj.prevent = false;
			if ($(e.target).is('.pswp--zoomed-in .pswp__img')) {
				if (isDown) {
					document.dispatchEvent(eventTouchDown);
				} else {
					document.dispatchEvent(eventTouchUp);
				}
			}
		});

		this.gallery.listen('close', () => {
			document.dispatchEvent(eventClose);
			this.$pswpEl.find('iframe, video').remove();
		});

		this.gallery.listen('beforeChange', (e) => {
			document.dispatchEvent(eventSlideChange);
			this._stopVideo();
		});
	}

	_openPhotoSwipe({
		index = 0,
		galleryElement = null,
		disableAnimation = false,
		fromURL = false
	}) {
		const
			items = this._getItems(galleryElement, index),
			options = {
				galleryUID: galleryElement.attr('data-pswp-uid')
			};

		if (typeof items[index] !== 'undefined' && 'el' in items[index]) {
			options.getThumbBoundsFn = function (index) {
				let
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					img = items[index].el.querySelector('img'),
					rect;

				if (img) {
					rect = img.getBoundingClientRect();
					return {
						x: rect.left,
						y: rect.top + pageYScroll,
						w: rect.width
					}
				}
			}
		}

		// PhotoSwipe opened from URL
		if (fromURL) {
			if (options.galleryPIDs) {
				// parse real index when custom PIDs are used 
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for (let j = 0; j < items.length; j++) {
					if (items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				// in URL indexes start from 1
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if (isNaN(options.index)) {
			return;
		}

		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		this.gallery = new PhotoSwipe(this.pswpEl, PhotoSwipeUI_Default, items, $.extend(options, this.options));
		this.gallery.init();

		this._bindEvents();
	}

	_getMediaTypeFromURL(url, size, autoplay = false) {
		const
			result = {
				type: false,
				html: null
			},
			iframeSize = size ? size.split('x') : [640, 360],
			attr = {
				video: autoplay ? 'muted playsinline loop autoplay' : '',
			},
			param = {
				youtube: autoplay ? 'autoplay=1' : '',
				vimeo: autoplay ? 'autoplay=1' : ''
			},
			pattern = {
				image: /([-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?\.(?:jpg|jpeg|jfif|pjpeg|pjp|bmp|gif|png|apng|webp|svg))/gi,
				video: /([-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?\.(?:mp4|ogv|webm))/gi,
				youtube: /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)([^&|?|\/]*)/g,
				vimeo: /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(?:.*\/)?(.+)/g,
			};

		/**
		 * Image
		 */
		if (pattern.image.test(url)) {
			result.type = 'image';
			return result;
		}

		/**
		 * HTML5 video
		 */
		if (pattern.video.test(url)) {
			result.type = 'video';
			result.html = `<video src="${url}" controls ${attr.video}></video>`;
			return result;
		}

		/**
		 * YouTube link
		 */
		if (pattern.youtube.test(url)) {
			result.type = 'youtube';
			result.html = url.replace(pattern.youtube, `<iframe class="iframe-youtube" width="${parseInt(iframeSize[0])}" height="${parseInt(iframeSize[1])}" src="https://www.youtube.com/embed/$1?${param.youtube}&enablejsapi=1" frameborder="0" allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
			return result;
		}

		/**
		 * Vimeo link
		 */
		if (pattern.vimeo.test(url)) {
			result.type = 'vimeo';
			result.html = url.replace(pattern.vimeo, `<iframe class="iframe-vimeo" width="${parseInt(iframeSize[0])}" height="${parseInt(iframeSize[1])}" src="https://player.vimeo.com/video/$1?${param.vimeo}" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`);
			return result;
		}

		/**
		 * Fallback iFrame
		 */
		result.type = 'iframe';
		result.html = `<iframe width="${parseInt(iframeSize[0])}" height="${parseInt(iframeSize[1])}" src=${url} frameborder="0" allowfullscreen></iframe>`;

		return result;
	}

	_getItems($galleryElement, activeIndex = 0) {
		const
			self = this,
			$items = $galleryElement.find('a'),
			items = [];

		$items.each(function (index) {
			const $el = $(this),
				item = {},
				size = $el.attr('data-size'),
				autoplay = $el.attr('data-autoplay') && activeIndex === index, // autoplay only currently active item
				src = $el.attr('href'),
				media = self._getMediaTypeFromURL(src, size, autoplay),
				title = $el.attr('data-title');

			if (size) {
				const sizeSplit = size.split('x');
				item.w = parseInt(sizeSplit[0], 10);
				item.h = parseInt(sizeSplit[1], 10);
			}

			if (title) {
				item.title = title;
			}

			switch (media.type) {
				case 'youtube':
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
					break;
				case 'vimeo':
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
					break;
				case 'video':
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
					break;
				case 'image':
					item.el = $el.get(0);
					item.src = src;
					item.msrc = $el.find('img').attr('src');
					break;
				default: // iframe
					item.html = `<div class="pswp__wrapper-embed">${media.html}</div>`;
			}
			items.push(item);
		});

		return items;
	}

	_photoswipeParseHash() {
		const
			hash = window.location.hash.substring(1),
			params = {};

		if (hash.length < 5) {
			return params;
		}

		const vars = hash.split('&');
		for (let i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			let pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	}

	_setGalleriesID() {
		this.$target.each(function (index) {
			$(this).attr('data-pswp-uid', index + 1);
		});
	}

	_stopVideo() {
		const
			$iframeYoutube = this.$pswpEl.find('.iframe-youtube'),
			$iframeVimeo = this.$pswpEl.find('.iframe-vimeo'),
			$video = this.$pswpEl.find('video');

		if ($iframeYoutube.length) {
			$iframeYoutube.each(function () {
				$(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
			});
		}

		if ($iframeVimeo.length) {
			$iframeVimeo.each(function () {
				$(this).get(0).contentWindow.postMessage('{"method":"pause"}', '*');
			});
		}

		if ($video.length) {
			$video.each(function () {
				$(this).get(0).pause();
			});
		}
	}
}

/*!========================================================================
	5. Scroll
	======================================================================!*/
class Scroll {
	static getEasingScroll(pos) {
		if (pos === 0) return 0;
		if (pos === 1) return 1;
		if ((pos /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (pos - 1));
		return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
	}

	static scrollTo({
		x = 0.0,
		y = 0.0,
		offsetY = 0.0,
		offsetX = 0.0,
		duration = 0.8,
		cb
	}) {
		return new Promise((resolve) => {

			let
				offsetElX = x,
				offsetElY = y;

			if (typeof x !== 'number') {
				offsetElX = $(x).offset().left - offsetX;
			}

			if (typeof y !== 'number') {
				offsetElY = $(y).offset().top - offsetY;
			}

			// smooth scrolling plugin
			if (typeof window.SB !== 'undefined') {

				window.SB.scrollTo(offsetElX, offsetElY, duration * 1000, {
					easing: (pos) => Scroll.getEasingScroll(pos),
					callback: () => {
						if (typeof cb === 'function') {
							cb();
						}
						resolve(true);
					}
				});

			} else { // regular window scrolling

				$('html, body').stop().animate({
					scrollLeft: offsetElX,
					scrollTop: offsetElY
				}, duration * 1000, 'easeInOutExpo', () => {
					if (typeof cb === 'function') {
						cb();
					}
					resolve(true);
				});

			}
		});
	}

	static scrollToTop() {

		// safari fix
		try {
			window.top.scrollTo({
				top: 0,
				left: 0,
				behavior: 'instant'
			});
		} catch (error) {
			console.log(error);
		}

		if (typeof window.SB !== 'undefined') {
			window.SB.scrollTop = 0;
			window.pageYOffset = 0;
			window.pageXOffset = 0;
		} else {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'instant'
			});
		}

	}

	static getScrollTop() {
		if (typeof window.SB !== 'undefined') {
			window.lastTop = window.SB.scrollTop;
		} else {
			window.lastTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		}

		return window.lastTop;
	}

	static restoreScrollTop() {
		if (typeof window.SB !== 'undefined') {
			setTimeout(() => {
				window.SB.scrollTop = window.lastTop;
			}, 100);
		} else {
			window.$html.add(window.$body).animate({
				scrollTop: window.lastTop
			});
		}
	}

	static lock(lock = true) {
		const lockClass = 'body_lock-scroll';

		if (lock === true) {
			if (typeof window.SB !== 'undefined') {
				window.SB.updatePluginOptions('lockscroll', {
					lock: true
				});
			}

			window.$body.addClass(lockClass);
		}

		if (lock === false) {
			window.$body.removeClass(lockClass);

			if (typeof window.SB !== 'undefined') {
				window.SB.updatePluginOptions('lockscroll', {
					lock: false
				});
			}
		}
	}

	static scrollToAnchorFromHash(timeout = 1000) {
		if (window.location.hash) {
			const $scrollElement = $(window.location.hash);

			if ($scrollElement.length) {
				setTimeout(() => {
					Scroll.scrollTo({
						x: 0,
						y: $scrollElement.offset().top - 80
					});
				}, timeout);
			}
		}
	}

	static stop() {
		if (typeof window.SB !== 'undefined') {
			window.SB.setMomentum(0, 0);
		}
	}
}

/*!========================================================================
	6. Slider
	======================================================================!*/
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

/*!========================================================================
	7. PJAX Animate Cloned Heading
	======================================================================!*/
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

/*!========================================================================
	8. PJAX Animate Cloned Image
	======================================================================!*/
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

/*!========================================================================
	9. PJAX Animate Container
	======================================================================!*/
function PJAXAnimateContainer(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$currentContainer = $(data.current.container),
			$nextContainer = $(data.next.container),
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.ajaxCurtainTransition) || 1;

		tl
			.fromTo($nextContainer, {
				y: '100vh',
				autoAlpha: 1
			}, {
				y: '0vh',
				autoAlpha: 1,
				duration: 1.2,
				ease: 'expo.inOut',
			}, '0')
			.fromTo($currentContainer, {
				y: '0vh',
				autoAlpha: 1,
				zIndex: -1
			}, {
				y: '-20vh',
				autoAlpha: 1,
				duration: 1.2,
				ease: 'expo.inOut',
				onComplete: () => {
					$currentContainer.empty();
				}
			}, '0')
			.add(() => resolve(true))
			.totalDuration(duration)
			.timeScale(timeScale);
	});
}

/*!========================================================================
	10. PJAX Animate Curtain
	======================================================================!*/
function PJAXAnimateCurtain(data, duration = 1.2) {
	return new Promise((resolve, reject) => {
		const
			tl = new gsap.timeline(),
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			$target = $nextMasthead.find('.section__bg'),
			$firstChild = $nextContainer.children().first(),
			timeScale = parseFloat(window.kinsey.theme.animations.timeScale.ajaxFlyingImageTransition) || 1;

		let background = $target.attr('data-background-color');

		if (!$target.length) {
			resolve(true);
			return;
		}

		if (!background) {
			background = $firstChild.css('background-color');
		}

		const {
			width,
			top
		} = $target.get(0).getBoundingClientRect();

		tl
			.setCurtain(window.$transitionCurtain, {
				width,
				top,
				background
			})
			.revealCurtain(window.$transitionCurtain)
			.add(() => resolve(true))
			.totalDuration(duration)
			.timeScale(timeScale);
	});
}

/*!========================================================================
	11. PJAX Animate Overlay Menu
	======================================================================!*/
function PJAXAnimateOverlayMenu(data, duration = 1.2) {
	return new Promise((resolve) => {
		const
			tl = new gsap.timeline(),
			$currentContainer = $(data.current.container),
			$nextContainer = $(data.next.container);

		tl
			.set($currentContainer, {
				autoAlpha: 0,
				overwrite: true
			})
			.set($nextContainer, {
				y: '0vh',
				autoAlpha: 1,
				overwrite: true
			})
			.add(window.kinsey.theme.header.closeMenuTransition(true))
			.add(() => {
				resolve(true);
			}, '-=0.8');
	});
}

/*!========================================================================
	12. PJAX Clear Container
	======================================================================!*/
function PJAXClearContainer(data) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			tl = new gsap.timeline();

		tl
			.set($nextContainer, {
				clearProps: 'all'
			})
			.set(window.$body, {
				clearProps: 'background-color'
			})
			.setCurtain(window.$transitionCurtain, {
				clearProps: 'all'
			})
			.add(() => resolve(true))
	});
}

/*!========================================================================
	13. PJAX Clone Heading
	======================================================================!*/
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

/*!========================================================================
	14. PJAX Clone Image
	======================================================================!*/
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

/*!========================================================================
	15. PJAX Fallback Cloned Image
	======================================================================!*/
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

/*!========================================================================
	16. PJAX Finish Loading
	======================================================================!*/
function PJAXFinishLoading(data) {
	return new Promise((resolve) => {
		// Transition ended event
		window.dispatchEvent(new CustomEvent('arts/barba/transition/end'));

		// Hide spinner
		if (typeof window.$spinner !== 'undefined' && window.$spinner.length) {
			gsap.to(window.$spinner, 0.6, {
				autoAlpha: 0
			});
		}

		// Hide loading cursor follower
		if (window.$cursor && window.$cursor.length) {
			window.$cursor.trigger('finishLoading');
		}

		// remove any cloned elements
		$('.js-clone').remove();

		ScrollTrigger.refresh(true);

		setTimeout(() => {

			Animations.enableAll();

			// unlock scroll
			Scroll.lock(false);


			window.$barbaWrapper.removeClass('cursor-progress is-ajax-loading pointer-events-none');
			$('.menu').removeClass('menu_disabled');

			// refresh animation triggers
			// for Waypoints library
			if (typeof Waypoint !== 'undefined') {
				Waypoint.refreshAll();
			}

		}, 100);

		// scroll to anchor from URL hash
		Scroll.scrollToAnchorFromHash();

		resolve(true);
	});
}

/*!========================================================================
	17. PJAX Init New Page
	======================================================================!*/
function PJAXInitNewPage(data) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead:not(.d-none)'),
			promises = [
				PJAXUpdateBody(data),
				PJAXUpdateNodesAttributes(data),
				PJAXUpdateHead(data),
				PJAXUpdateAdTrackers(data)
			],
			event = new CustomEvent('DOMContentLoaded', {
				detail: {
					scope: $nextContainer,
					container: $nextContainer,
					scrollToHashElement: false // will scroll to the anchors later  once transition is fully finished
				}
			});

		if (window.kinsey.theme.ajax.loadMissingScripts) {
			promises.push(PJAXUpdateScripts(data));
		}

		if (window.kinsey.theme.ajax.loadMissingStyles) {
			promises.push(PJAXUpdateStyles(data));
		}

		if ($nextMasthead.length) {
			// class flag to prevent the repeat initialization
			$nextMasthead.addClass('js-cancel-init');
		}

		// change loaded flag
		window.kinsey.theme.isFirstLoad = false;

		// refresh page wrapper selectors
		window.$pageWrapper = $nextContainer;
		window.$pageContent = $nextContainer.find('.page-wrapper__content');

		// Scroll at the page beginning
		Scroll.scrollToTop();

		return Promise
			.all(promises)
			.then(() => document.fonts.ready)
			.then(() => PJAXInitNextMasthead(data))
			.then(() => {

				// Autoplay paused HTML5 videos
				$('video[playsinline][muted][autoplay]').each(function () {
					if (this.paused) {
						this.play();
					}
				});

				// Transition init new page event (before components init)
				window.dispatchEvent(new CustomEvent('arts/barba/transition/init/before', {
					detail: event.detail
				}));

				// fire ready event
				document.dispatchEvent(event);

				if (window.kinsey.theme.ajax.evalInlineContainerScripts) {
					// eval inline scripts in the main container
					$nextContainer.find('script').each(function () {
						try {
							window.eval(this.text);
						} catch (error) {
							console.warn(error);
						}
					});
				}

				// Transition init new page event (after components init)
				window.dispatchEvent(new CustomEvent('arts/barba/transition/init/after', {
					detail: event.detail
				}));

				resolve(true);
			})
			.catch((e) => { // fallback if transition failed
				barba.force(data.next.url.href);
				console.warn(e);
			});
	});
}

/*!========================================================================
	18. PJAX Init Next Masthead
	======================================================================!*/
function PJAXInitNextMasthead(data) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead:not(.d-none)'); // no need to init the hidden masthead

		// init next page masthead
		if ($nextMasthead.length) {

			new SectionMasthead({
				target: $nextMasthead,
				scope: $nextContainer
			});

			resolve(true);
		} else {
			resolve(true);
		}
	});
}

/*!========================================================================
	19. PJAX Set Body Background
	======================================================================!*/
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

/*!========================================================================
	20. PJAX Set Current Container
	======================================================================!*/
function PJAXSetCurrentContainer(data, hide = true, scrollToTop = false) {
	return new Promise((resolve) => {
		const
			$currentContainer = $(data.current.container),
			tl = new gsap.timeline();

		tl
			.set($currentContainer, {
				autoAlpha: hide ? 0 : 1,
			})
			.set($currentContainer, {
				delay: 0.1,
				width: '100vw',
				height: '100vh',
				overflow: 'hidden',
				zIndex: 300,
				onComplete: () => {
					Animations.killAll();

					// Scroll at the page beginning
					if (scrollToTop) {
						Scroll.scrollToTop();
					}
				}
			})
			.add(() => {
				setTimeout(() => {
					resolve(true);
				}, 100);
			});
	});
}

/*!========================================================================
	21. PJAX Set Next Container
	======================================================================!*/
function PJAXSetNextContainer(data, cancelAnimation = false, scrollToTop = false) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead'),
			tl = new gsap.timeline();

		if (cancelAnimation && $nextMasthead.length) {
			$nextMasthead.attr('data-arts-os-animation', 'animated');

			if ($('.js-clone.js-transition-img').length) {
				$nextMasthead.find('.js-transition-img').addClass('js-transition-animated');
			}

			if ($('.js-clone.js-transition-heading').length) {
				$nextMasthead.find('.js-transition-heading').addClass('js-transition-animated');
			}
			$nextMasthead.find('.js-transition-bg').addClass('js-transition-animated');
		}

		tl
			.set($nextContainer, {
				autoAlpha: 0,
			})
			.set($nextContainer, {
				delay: 0.1,
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				zIndex: 300,
				onComplete: () => {

					// Scroll at the page beginning
					if (scrollToTop) {
						Scroll.scrollToTop();
					}
				}
			})
			.add(() => {
				setTimeout(() => {
					resolve(true);
				}, 100);
			});
	});
}

/*!========================================================================
	22. PJAX Start Loading
	======================================================================!*/
function PJAXStartLoading(data) {
	return new Promise((resolve) => {
		// Transition started event
		window.dispatchEvent(new CustomEvent('arts/barba/transition/start'));

		Scroll.lock(true);

		$('.menu').addClass('menu_disabled');
		window.$barbaWrapper.addClass('cursor-progress is-ajax-loading');
		window.$document.off('resize click');
		window.$window.off('resize click orientationchange');

		// Set loading spinner
		if (window.$spinner && window.$spinner.length) {
			gsap.to(window.$spinner, 0.6, {
				autoAlpha: 1
			});
		}

		// Set loading cursor follower
		if (window.$cursor && window.$cursor.length) {
			window.$cursor.trigger('startLoading');
		}

		resolve(true);
	});
}

/*!========================================================================
	23. PJAX Transition Auto Scroll Next
	======================================================================!*/
const PJAXTransitionAutoScrollNext = {
	name: 'autoScrollNext',

	custom: ({
		trigger
	}) => {
		return $(trigger).attr('data-pjax-link') === 'autoScrollNext';
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			const
				$trigger = $(data.trigger),
				$navContainer = $trigger.closest('.section'),
				$image = $navContainer.find('.js-transition-img'),
				$heading = $navContainer.find('.js-transition-heading');

			PJAXSetBodyBackground(data)
				.then(() => {
					return Promise.all([
						PJAXCloneImage($image),
						PJAXCloneHeading($heading)
					]);
				})
				.then(() => {
					return Promise.all([
						PJAXSetCurrentContainer(data, true, true),
						PJAXSetNextContainer(data, true, true)
					]);
				})
				.then(() => resolve(true));
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => resolve(true));
		});
	},

	afterEnter: (data) => {
		return new Promise((resolve) => {
			Promise.all([
					PJAXAnimateClonedHeading(data),
					PJAXAnimateClonedImage(data),
					PJAXAnimateCurtain(data),
				])
				.then(() => PJAXClearContainer(data))
				.then(() => resolve(true))
		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}

/*!========================================================================
	24. PJAX Transition General
	======================================================================!*/
const PJAXTransitionGeneral = {
	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			PJAXSetNextContainer(data)
				.then(() => PJAXAnimateContainer(data))
				.then(() => PJAXSetCurrentContainer(data, false, false))
				.then(() => resolve(true));
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => resolve(true));
		});
	},

	afterEnter: (data) => {
		return new Promise((resolve) => {
			PJAXClearContainer(data).then(() => resolve(true));
		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}

/*!========================================================================
	25. PJAX Transition Overlay Menu
	======================================================================!*/
const PJAXTransitionOverlayMenu = {
	name: 'overlayMenu',

	custom: ({
		trigger
	}) => {
		const $trigger = $(trigger);
		return window.kinsey.theme.header.isOverlayOpened() || ($trigger.attr('href') !== '#' && $trigger.attr('data-pjax-link') === 'overlayMenu');
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			PJAXSetNextContainer(data)
				.then(() => PJAXAnimateOverlayMenu(data))
				.then(() => PJAXSetCurrentContainer(data, false, false))
				.then(() => resolve(true));
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => resolve(true));
		});
	},

	afterEnter: (data) => {
		return new Promise((resolve) => {
			PJAXClearContainer(data).then(() => resolve(true))
		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}

/*!========================================================================
	26. PJAX Update Ad Trackers
	======================================================================!*/
function PJAXUpdateAdTrackers() {
	updateGA();
	updateFBPixel();
	updateYaMetrika();

	/**
	 * Google Analytics
	 */
	function updateGA() {
		if (typeof gtag === 'function' && typeof window.gaData === 'object' && Object.keys(window.gaData)[0] !== 'undefined') {
			const
				trackingID = Object.keys(window.gaData)[0],
				pageRelativePath = (window.location.href).replace(window.location.origin, '');

			gtag('js', new Date());
			gtag('config', trackingID, {
				'page_title': document.title,
				'page_path': pageRelativePath
			});
		}
	}

	/**
	 * Facebook Pixel
	 */
	function updateFBPixel() {
		if (typeof fbq === 'function') {
			fbq('track', 'PageView');
		}
	}

	/**
	 * Yandex Metrika
	 */
	function updateYaMetrika() {
		if (typeof ym === 'function') {
			const trackingID = getYmTrackingNumber();

			ym(trackingID, 'hit', window.location.href, {
				title: document.title
			});
		}
	}

	function getYmTrackingNumber() {
		if (typeof window.Ya !== 'undefined' && typeof window.Ya.Metrika2) {
			return window.Ya.Metrika2.counters()[0].id || null;
		}

		if (typeof window.Ya !== 'undefined' && typeof window.Ya.Metrika) {
			return window.Ya.Metrika.counters()[0].id || null;
		}

		return null;
	}
}

/*!========================================================================
	27. PJAX Update Body
	======================================================================!*/
function PJAXUpdateBody(data) {
	return new Promise((resolve, reject) => {
		const
			regexp = /\<body.*\sclass=["'](.+?)["'].*\>/gi,
			match = regexp.exec(data.next.html);

		if (!match || !match[1]) {
			resolve(true);
			return;
		}

		// Interrupt the transition
		// Current page prevents all the inner links from transition
		if (document.body.classList.contains('no-ajax')) {
			reject('Transition has been interrupted: Origin page prevents all the inner links from transition.');
			return;
		}

		// Sync new container body classes
		document.body.setAttribute('class', match[1]);

		// Interrupt the transition
		// Destination page doesn't allow to perform AJAX transition
		if (document.body.classList.contains('page-no-ajax')) {
			reject('Transition has been interrupted: Destination page requested a hard refresh.');
			return;
		}

		// Hide theme header on Elementor Canvas page
		if (document.body.classList.contains('elementor-template-canvas')) {
			window.kinsey.theme.header.$header.addClass('hidden');
		}

		// Clear window overflow rule in case Elementor Canvas page
		// doesn't have smooth scrolling container
		if (!$(data.next.container).hasClass('js-smooth-scroll')) {
			gsap.set(window.$html, {
				overflow: 'unset'
			});
		}

		resolve(true);
	});
}

/*!========================================================================
	28. PJAX Update Head
	======================================================================!*/
function PJAXUpdateHead(data) {
	return new Promise((resolve, reject) => {
		let
			head = document.head,
			newPageRawHead = data.next.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0],
			newPageHead = document.createElement('head'),
			customNodes = sanitizeSelector(window.kinsey.theme.updateHeadNodes),
			oldHeadTags,
			newHeadTags,
			newStylesLoaded,
			pageStyles,
			headTags = [
				'meta[name="keywords"]',
				'meta[name="description"]',
				'meta[property^="og"]',
				'meta[name^="twitter"]',
				'meta[itemprop]',
				'link[itemprop]',
				'link[rel="prev"]',
				'link[rel="next"]',
				'link[rel="canonical"]',
				'link[rel="alternate"]',
				'link[rel="shortlink"]',
				'link[id*="elementor-post"]',
				'link[id*="eael"]', // Essential Addons plugin post CSS
				'link[id*="theplus-"]', // ThePlus Elementor addon
				'link[id*="pafe-"]', // Piotnet Pafe Elementor addon
				'style[id*=elementor-frontend-inline]',
				'style[id*="elementor-post"]',
				'style[id*="eael"]', // Essential Addons plugin inline CSS
				'style[id*="theplus-"]', // ThePlus Elementor addon
				'style[id*="pafe-"]', // Piotnet Pafe Elementor addon
				'link[id*="google-fonts"]', // Elementor inline fonts
			];

		// Custom head nodes to update
		if (customNodes) {
			headTags = [...headTags, ...customNodes.split(',')]

			// Make the node names unique
			headTags = [...new Set(headTags)];
		}

		// Prepare the selector
		headTags = headTags.join(',');

		newPageHead.innerHTML = newPageRawHead;

		try {
			oldHeadTags = head.querySelectorAll(headTags),
				newHeadTags = newPageHead.querySelectorAll(headTags),
				newStylesLoaded = [];
			pageStyles = document.querySelectorAll('link[rel="stylesheet"]');

		} catch (error) {
			reject(`Transition has been interrupted: invalid selector given "${customNodes}"`);
		}

		// flag all current page styles as loaded
		for (let i = 0; i < pageStyles.length; i++) {
			pageStyles[i].isLoaded = true;
		}
		// append new and remove old tags
		for (let i = 0; i < newHeadTags.length; i++) {
			if (typeof oldHeadTags[i] !== 'undefined') {
				head.insertBefore(newHeadTags[i], oldHeadTags[i].nextElementSibling);
				head.removeChild(oldHeadTags[i]);
			} else {
				head.insertBefore(newHeadTags[i], newHeadTags[i - 1]);
			}
		}

		// page now has new styles
		pageStyles = document.querySelectorAll('link[rel="stylesheet"]');

		// listen for 'load' only on elements which are not loaded yet
		for (let i = 0; i < pageStyles.length; i++) {
			if (!pageStyles[i].isLoaded) {
				const promise = new Promise((resolve) => {
					pageStyles[i].addEventListener('load', () => {
						resolve(true);
					});
				});

				newStylesLoaded.push(promise);
			}
		}

		// load all new page styles
		Promise.all(newStylesLoaded).then(() => {
			resolve(true);
		});
	});
}

/*!========================================================================
	29. PJAX Update Nodes Attributes
	======================================================================!*/
function PJAXUpdateNodesAttributes(data) {
	return new Promise((resolve) => {
		const
			$nextDOM = $($.parseHTML(data.next.html)),
			nodesToUpdate = [
				'#page-header',
				'#page-header .menu li',
				'#page-header .menu-overlay li',
				'#page-header .header__wrapper-overlay-menu',
				'#page-header .mask-reveal__layer-1',
				'#page-header .mask-reveal__layer-2',
				'#page-header .header__menu-column',
				'#page-header .header__slider-column',
				'#page-footer',
				window.kinsey.theme.ajax.updateNodesAttributes
			]; // selectors of elements that needed to update

		$.each(nodesToUpdate, function () {
			let
				$item = $(this),
				$nextItem = $nextDOM.find(this);

			// different type of menu (overlay) found on the next page
			if (this === '#page-header .menu li' && !$nextItem.length) {
				$nextItem = $nextDOM.find('#page-header .menu-overlay li');
			}

			// different type of menu (classic) found on the next page
			if (this === '#page-header .menu-overlay li' && !$nextItem.length) {
				$nextItem = $nextDOM.find('#page-header .menu li');

			}

			// save menu position classes
			if (this === '#page-header') {
				if ($item.hasClass('header_menu-left')) {
					$nextItem.addClass('header_menu-left');
				}

				if ($item.hasClass('header_menu-split-center')) {
					$nextItem.addClass('header_menu-split-center');
				}

				if ($item.hasClass('header_menu-right')) {
					$nextItem.addClass('header_menu-right');
				}
			}

			// sync attributes if element exist in the new container
			if ($nextItem.length) {
				syncAttributes($nextItem, $item);
			}
		});

		resolve(true);
	});
}

/*!========================================================================
	30. PJAX Update Scripts
	======================================================================!*/
function PJAXUpdateScripts(data) {
	return new Promise((resolve) => {
		const
			nextDocument = jQuery.parseHTML(data.next.html, document, true),
			scriptsToLoad = [],
			customNodes = sanitizeSelector(window.kinsey.theme.ajax.updateScriptNodes) || [],
			$nextScripts = $(nextDocument).filter('script[src][id]');

		$nextScripts.each(function () {
			const
				queryString = `script[id="${this.id}"]`,
				element = document.querySelector(queryString);

			// load script that's not present on the current page
			if (typeof element === 'undefined' || element === null) {
				scriptsToLoad.push(AssetsManager.load({
					type: 'script',
					id: this.id,
					src: this.src
				}));
			} else if (customNodes.includes(queryString)) {

				// remove current script
				element.remove();

				// re-load script
				scriptsToLoad.push(AssetsManager.load({
					type: 'script',
					id: this.id,
					src: this.src,
					update: true
				}));
			}
		});

		Promise
			.all(scriptsToLoad)
			.then(() => resolve(true), () => resolve(true));
	});
}

/*!========================================================================
	31. PJAX Update Styles
	======================================================================!*/
function PJAXUpdateStyles(data) {
	return new Promise((resolve) => {
		const
			nextDocument = jQuery.parseHTML(data.next.html, document, true),
			stylesToLoad = [],
			$nextStyles = $(nextDocument).filter('link[rel="stylesheet"][id]');

		$nextStyles.each(function (index) {
			const element = document.querySelector(`link[id="${this.id}"]`);

			// load stylesheet that's not present on the current page
			if (typeof element === 'undefined' || element === null) {
				stylesToLoad.push(AssetsManager.load({
					type: 'style',
					id: this.id ? this.id : `pjax-asset-${index}-css`,
					src: this.href
				}));
			}
		});

		Promise
			.all(stylesToLoad)
			.then(() => resolve(true), () => resolve(true));
	});
}

/*!========================================================================
	32. PJAX
	======================================================================!*/
class PJAX extends BaseComponent {
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
		/**
		 * Don't save scroll position
		 * after AJAX transition
		 */
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
	}

	run() {
		barba.init({
			timeout: 10000,
			cacheIgnore: window.Modernizr.touchevents ? true : false, // don't grow cache on mobiles
			// don't trigger barba for links outside wrapper
			prevent: ({
				el
			}) => {

				let
					$el = $(el),
					url = $el.attr('href'),
					customRules = sanitizeSelector(window.kinsey.theme.ajax.preventRules),
					exludeRules = [
						'.no-ajax',
						'.no-ajax a',
						'.js-gallery a', // any links in theme galleries
					];

				if (url === '#') { // dummy link
					return true;
				}

				// page anchor
				if ($el.is('[href*="#"]') && window.location.href === url.substring(0, url.indexOf('#'))) {
					return true;
				}

				// page anchor
				if ($el.is('[href^="#"]')) {
					return true;
				}

				// clicked on element outside barba wrapper
				if ($el.closest(window.$barbaWrapper).length < 1) {
					return true;
				}

				// custom rules from WordPress Customizer
				if (customRules) {
					exludeRules = [...exludeRules, ...customRules.split(',')];
					exludeRules = [...new Set(exludeRules)];
				}

				// check against array of rules to prevent
				return $el.is(exludeRules.join(','));

			},
			// custom transitions
			transitions: [
				PJAXTransitionAutoScrollNext,
				PJAXTransitionGeneral,
				PJAXTransitionOverlayMenu,
			],

		});
	}
}

/*!========================================================================
	33. Arts Hover
	======================================================================!*/
class ArtsHover extends BaseComponent {
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
		this.hoverClass = this.$target.data('arts-hover-class') || null;
		this.$trigger = this.$target.find('[data-arts-hover="trigger"]');
	}

	run() {
		this._bindEvents();
	}

	_bindEvents() {
		this.$trigger
			.on('mouseenter touchstart', () => {
				this.$target.addClass(this.hoverClass);
			})
			.on('mouseleave touchend', () => {
				this.$target.removeClass(this.hoverClass);
			});
	}
}

/*!========================================================================
	34. Button Circles
	======================================================================!*/
class ButtonCircles extends BaseComponent {
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
		this.$circles = this.$target.find('.circle');
		this.timeline = new gsap.timeline();

		this.timeline.set(this.$circles, {
			drawSVG: '0% 0%'
		});
	}

	run() {
		this.bindEvents();
	}

	bindEvents() {
		this.$target
			.on('mouseenter touchstart', () => {
				this.timeline
					.clear()
					.staggerTo(this.$circles, 0.6, {
						drawSVG: '0% 100%',
						ease: 'power4.out'
					}, 0.05);
			})
			.on('mouseleave touchend', () => {
				this.timeline
					.clear()
					.staggerTo(this.$circles, 0.6, {
						drawSVG: '0% 0%',
						ease: 'power4.out'
					}, 0.05);
			});
	}
}

/*!========================================================================
	35. Count Down
	======================================================================!*/
class CountDown extends BaseComponent {
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
		this.date = this.$target.attr('data-count-down');
		this.$elements = this.$target.find('[data-count-down-element]');
	}

	run() {
		const self = this;

		this.$target.countdown(this.date, function (event) {
			self.$elements.each(function () {
				const
					$this = $(this),
					template = $this.attr('data-count-down-element');

				$this.html(event.strftime(`%${template}`));
			});
		});
	}
}

/*!========================================================================
	36. Filter
	======================================================================!*/
class Filter {
	constructor({
		scope,
		target
	}) {
		this.$target = target;
		this.$scope = scope;
		this.itemClass = '.js-filter__item';
		this.itemActive = 'filter__item_active';
		this.itemActiveClass = '.filter__item_active';
		this.underlineClass = '.js-filter__underline';
		this.$items = this.$target.find(this.itemClass);
		this.$line = this.$target.find($(this.underlineClass));

		this.bindEvents();
	}

	bindEvents() {
		const self = this;

		this.$scope
			.on('mouseenter', this.itemClass, function () {
				self.updateLinePosition($(this));
			})
			.on('mouseleave', this.itemClass, function () {
				self.updateLinePosition(self.$items.filter(self.itemActiveClass))
			})
			.on('click', this.itemClass, function () {
				const $el = $(this);

				self.$items.removeClass(self.itemActive);
				$el.addClass(self.itemActive);
				self.updateLinePosition($el);
			});

		// update line position on window resize
		window.$window.on('resize', debounce(() => {
			setTimeout(() => {
				self.updateLinePosition(self.$items.filter(self.itemActiveClass));
			}, 750);
			self.updateLinePosition(self.$items.filter(self.itemActiveClass));
		}, 250));
	}

	updateLinePosition($el, duration = 0.5) {
		if (!this.$line.length) {
			return false;
		}

		if (!$el || !$el.length) {

			gsap.to(this.$line, {
				duration: 0.6,
				width: 0,
				ease: 'expo.out'
			});
		} else {
			const
				$col = $el.find('.filter__item-inner'),
				$label = $el.find('.filter__item-label'),
				outer = {
					offset: this.$target.offset()
				},
				label = {
					width: $label.innerWidth(),
					position: $label.position(),
					offset: $label.offset()
				},
				col = {
					position: $col.position()
				};

			gsap.to(this.$line, {
				duration,
				ease: 'expo.inOut',
				width: label.width,
				y: label.offset.top - outer.offset.top,
				x: label.position.left + col.position.left,
			});
		}
	}

	setActiveItem(index, duration = 0.5) {
		const $el = this.$items.eq(index);

		if (!$el.length) {
			return false;
		}

		this.$items.removeClass(this.itemActive);
		$el.addClass(this.itemActive);
		this.updateLinePosition($el, duration);
	}
}

/*!========================================================================
	37. Gmap
	======================================================================!*/
class GMap extends BaseComponent {
	constructor({
		scope,
		target
	}) {
		super({
			scope,
			target
		});
	}

	set() {
		this.prevInfoWindow = false;
		this.$container = this.$target.find('.gmap__container');
		this.$markers = this.$target.find('.gmap__marker');

		this.zoom = parseInt(this.$target.attr('data-gmap-zoom'), 10);
		this.styles = this._parseStyles(this.$target.attr('data-gmap-snazzy-styles'));
	}

	run() {
		if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined' && this.$container.length) {
			this._createMap();
		}
	}

	_parseStyles(styles) {
		if (!styles) {
			return false;
		}

		try {
			return JSON.parse(styles);
		} catch (err) {
			console.error('Google Map: Invalid Snazzy Styles Array!');
			return false;
		}
	}

	_createMap() {

		const
			self = this,
			argsMap = {
				center: new google.maps.LatLng(0, 0),
				zoom: this.zoom,
				scrollwheel: false
			};

		if (this.styles) {
			$.extend(argsMap, {
				styles: this.styles
			});
		}

		this.map = new google.maps.Map(this.$container[0], argsMap);
		this.map.markers = [];

		this.$markers.each(function () {
			self._createMarker($(this));
		});

		this._centerMap(this.zoom);
	}

	_createMarker($marker) {

		if (!$marker.length) {
			return;
		}

		const
			MARKER_LAT = parseFloat($marker.attr('data-marker-lat')),
			MARKER_LON = parseFloat($marker.attr('data-marker-lon')),
			MARKER_IMG = $marker.attr('data-marker-img'),
			MARKER_WIDTH = $marker.attr('data-marker-width'),
			MARKER_HEIGHT = $marker.attr('data-marker-height'),
			MARKER_CONTENT = $marker.attr('data-marker-content');

		let marker;

		/**
		 * Marker
		 */
		const argsMarker = {
			position: new google.maps.LatLng(MARKER_LAT, MARKER_LON),
			map: this.map
		};

		if (MARKER_IMG) {
			$.extend(argsMarker, {
				icon: {
					url: MARKER_IMG
				}
			});
		}

		if (MARKER_IMG && MARKER_WIDTH && MARKER_HEIGHT) {
			$.extend(argsMarker.icon, {
				scaledSize: new google.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(0, 0) // anchor
			});
		}

		marker = new google.maps.Marker(argsMarker);
		this.map.markers.push(marker);

		/**
		 * Info Window (Content)
		 */
		this._createInfoWindow({
			marker,
			content: MARKER_CONTENT
		});

	}

	_createInfoWindow({
		marker,
		content = ''
	}) {
		if (content) {
			const infoWindow = new google.maps.InfoWindow({
				content: content
			});

			marker.addListener('click', () => {
				if (this.prevInfoWindow) {
					this.prevInfoWindow.close();
				}

				this.prevInfoWindow = infoWindow;

				infoWindow.open(this.map, marker);
			});
		}
	}

	_centerMap(zoom) {
		const bounds = new google.maps.LatLngBounds();

		$.each(this.map.markers, function () {
			const item = this;

			if (typeof item.position !== 'undefined') {

				const
					lat = item.position.lat(),
					lng = item.position.lng(),
					newZoom = new google.maps.LatLng(lat, lng);

				bounds.extend(newZoom);
			}
		});

		// center single marker
		if (this.map.markers.length == 1) {
			this.map.setCenter(bounds.getCenter());
			this.map.setZoom(zoom);
		} else { // fit bounds to multiple markers
			this.map.fitBounds(bounds);
		}
	}
}

/*!========================================================================
	38. Form
	======================================================================!*/
class Form {
	constructor({
		scope,
		target
	}) {
		this.$scope = scope;
		this.$target = target;

		if (this.$scope.length) {
			this.set();
			this.run();
		}
	}

	set() {
		this.input = '.input-float__input';
		this.inputClassNotEmpty = 'input-float__input_not-empty';
		this.inputClassFocused = 'input-float__input_focused';
		this.$inputs = this.$scope.find(this.input);
	}

	run() {
		this._floatLabels();
		this._bindEvents();
		this._attachModalsEvents();
	}

	_floatLabels() {
		const self = this;

		if (!this.$inputs || !this.$inputs.length) {
			return false;
		}

		this.$inputs.each(function () {
			const
				$el = $(this),
				$controlWrap = $el.parent('.wpcf7-form-control-wrap');

			// not empty value
			if ($el.val()) {
				$el.addClass(self.inputClassNotEmpty);
				$controlWrap.addClass(self.inputClassNotEmpty);
				// empty value
			} else {
				$el.removeClass([self.inputClassFocused, self.inputClassNotEmpty]);
				$controlWrap.removeClass([self.inputClassFocused, self.inputClassNotEmpty]);
			}

			// has placeholder & empty value
			if ($el.attr('placeholder') && !$el.val()) {
				$el.addClass(self.inputClassNotEmpty);
				$controlWrap.addClass(self.inputClassNotEmpty);
			}
		});

	}

	_bindEvents() {
		const self = this;

		this.$scope
			.off('focusin')
			.on('focusin', self.input, function () {
				const
					$el = $(this),
					$controlWrap = $el.parent('.wpcf7-form-control-wrap');

				$el.addClass(self.inputClassFocused).removeClass(self.inputClassNotEmpty);
				$controlWrap.addClass(self.inputClassFocused).removeClass(self.inputClassNotEmpty);

			})
			.off('focusout')
			.on('focusout', self.input, function () {

				const
					$el = $(this),
					$controlWrap = $el.parent('.wpcf7-form-control-wrap');

				// not empty value
				if ($el.val()) {
					$el.removeClass(self.inputClassFocused).addClass(self.inputClassNotEmpty);
					$controlWrap.removeClass(self.inputClassFocused).addClass(self.inputClassNotEmpty);
				} else {
					// has placeholder & empty value
					if ($el.attr('placeholder')) {
						$el.addClass(self.inputClassNotEmpty);
						$controlWrap.addClass(self.inputClassNotEmpty);
					}

					$el.removeClass(self.inputClassFocused);
					$controlWrap.removeClass(self.inputClassFocused);
				}

			});

	}

	_attachModalsEvents() {
		window.$document.off('wpcf7submit').on('wpcf7submit', (e) => {

			const $modal = $('#modalContactForm7');
			let template;

			$modal.modal('dispose').remove();

			if (e.detail.apiResponse.status === 'mail_sent') {

				template = this._getModalTemplate({
					icon: 'icon-success.svg',
					message: e.detail.apiResponse.message,
				});

				this._createModal({
					template,
					onDismiss: () => {
						$(e.srcElement).find(this.input).parent().val('').removeClass(this.inputClassFocused).removeClass(this.inputClassNotEmpty);
					}
				});
			}

			if (e.detail.apiResponse.status === 'mail_failed') {
				template = this._getModalTemplate({
					icon: 'icon-error.svg',
					message: e.detail.apiResponse.message
				});

				this._createModal({
					template
				});
			}

		});
	}

	_getModalTemplate({
		icon,
		message
	}) {
		return `
      <div class="modal" id="modalContactForm">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content radius-img">
            <div class="modal__close" data-dismiss="modal"><img src="img/general/modal/icon-close.svg" alt="Close"></div>
              <header class="text-center mb-1">
								<img src="img/general/modal/${icon}" width="80px" height="80px" alt=""/>
                <p class="modal__message h4"><strong>${message}</strong></p>
              </header>
              <button type="button" class="button button_solid bg-dark-1 button_fullwidth" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    `;
	}

	_createModal({
		template,
		onDismiss
	}) {

		if (!template) {
			return false;
		}

		let $modal;
		window.$body.append(template);
		$modal = $('#modalContactForm');

		$modal.modal('show');
		$modal.on('hidden.bs.modal', () => {
			if (typeof onDismiss === 'function') {
				onDismiss();
			}
			$modal.modal('dispose').remove();
		});
	}
}

/*!========================================================================
	39. Form AJAX
	======================================================================!*/
class FormAJAX extends Form {
	constructor(options) {
		super(options);
		this.inputClassError = 'form__error';
		this.method = this.$target.attr('method');
		this.action = this.$target.attr('action');
		this.messages = {
			success: this.$target.attr('data-message-success'),
			error: this.$target.attr('data-message-error')
		};
		this._validate();
	}

	_validate() {
		const self = this;

		this.$target.validate({
			errorElement: 'span',
			errorPlacement: (error, element) => {
				error.appendTo(element.parent()).addClass(self.inputClassError);
			},
			submitHandler: (form) => {
				self._submit(form);
			}
		});
	}

	_submit() {
		const self = this;

		$.ajax({
			type: self.$target.attr('method'),
			url: self.$target.attr('action'),
			data: self.$target.serialize()
		}).done(() => {
			self._createModal({
				template: self._getModalTemplate({
					icon: 'icon-success.svg',
					message: self.messages.success
				}),
				onDismiss: () => {
					self.$target.trigger('reset');
					self._floatLabels();
				}
			});
		}).fail(() => {
			self._createModal({
				template: self._getModalTemplate({
					icon: 'icon-error.svg',
					message: self.messages.error
				})
			});
		});
	}
}

/*!========================================================================
	40. Grid
	======================================================================!*/
class Grid extends BaseComponent {
	constructor({
		target,
		scope,
		onArrangeComplete,
		onLayoutComplete
	}) {
		super({
			target,
			scope
		});
		this.onArrangeComplete = onArrangeComplete;
		this.onLayoutComplete = onLayoutComplete;
		this.refreshGrid = debounce(() => {
			if (typeof window.SB !== 'undefined') {
				window.SB.update();
			}

			if (this.isotopeInstance && typeof this.isotopeInstance.layout === 'function') {
				this.isotopeInstance.layout();
			}
		}, 250);
	}

	set() {
		this.equalHeights = this.$target.hasClass('js-grid-equal-heights');
	}

	run() {

		this.isotopeInstance = new Isotope(this.$target.get(0), {
			itemSelector: '.js-grid__item',
			columnWidth: '.js-grid__sizer',
			percentPosition: true,
			horizontalOrder: true,
		});

		if (this.equalHeights) {
			this._equalizeColumnsHeight();
		}

		this._bindEvents();
		ScrollTrigger.refresh();

		setTimeout(() => {
			this.isotopeInstance.layout();
			ScrollTrigger.refresh();
		}, 200);
	}

	_bindEvents() {
		if (typeof this.onArrangeComplete === 'function') {
			this.isotopeInstance.on('arrangeComplete', () => {
				this.onArrangeComplete();

				if (this.equalHeights) {
					this._equalizeColumnsHeight();
				} else {
					setTimeout(() => {
						this.isotopeInstance.layout();
						ScrollTrigger.refresh();
					}, 200);
				}
			});
		}

		if (typeof this.onLayoutComplete === 'function') {
			this.isotopeInstance.on('layoutComplete', () => {
				this.onLayoutComplete();
			});
		}

		if (this.equalHeights) {
			window.$window.on(getResponsiveResizeEvent(), debounce(() => {
				this._equalizeColumnsHeight();
			}, 250));
		}

		window.$window.one('arts/barba/transition/end', () => {
			this.isotopeInstance.layout();
		});

		const self = this;
		const $animatedElements = this.$target.find('[data-arts-os-animation]');

		if ($animatedElements.length) {
			$animatedElements.each(function () {
				$(this).one('animation/start', self.refreshGrid.bind(self));
			});
		}
	}

	_equalizeColumnsHeight() {
		this.containerWidth = this.$target.innerWidth();
		this.$items = this.$target.find('.js-grid__item');
		this.$sizer = this.$target.find('.js-grid__sizer');
		this.sizerWidth = this.$sizer.innerWidth();
		this.itemsAmount = this.$items.length;
		this.columnsAmount = Math.round(this.containerWidth / this.sizerWidth);
		this.rowsAmount = this.itemsAmount / this.columnsAmount;

		let offset = 0;

		gsap.set(this.$sizer, {
			clearProps: 'height'
		});

		gsap.set(this.$items, {
			clearProps: 'height',
			onComplete: () => {
				this.isotopeInstance.layout();
			}
		});

		if (this.columnsAmount > 1) {

			for (let row = 0; row < this.itemsAmount; row += this.columnsAmount) {

				let maxHeight = 0;
				let $currentRowItems = [];

				for (let index = row; index < row + this.columnsAmount; index++) {

					const
						targetIndex = index + offset,
						$currentItem = this.$items.eq(targetIndex),
						currentItemHeight = $currentItem.innerHeight();

					if (currentItemHeight > maxHeight) {
						maxHeight = currentItemHeight;
					}

					$currentRowItems.push($currentItem);
				}

				gsap.to($currentRowItems, {
					duration: 0.2,
					height: maxHeight,
					overwrite: true,
					onComplete: () => {
						this.isotopeInstance.layout();
					}
				});
			}
		}
	}
}

/*!========================================================================
	41. PSWP Gallery
	======================================================================!*/
class PSWPGallery extends PSWP {
	constructor({
		scope,
		target,
		options
	}) {
		super({
			scope,
			target,
			options
		});

		this.hashData = this._photoswipeParseHash();
		if (this.$target.length && !window.kinsey.theme.ajax.enabled && this.hashData.pid && this.hashData.gid) {
			this._openPhotoSwipe({
				index: this.hashData.pid,
				galleryElement: this.$target.eq(this.hashData.gid - 1),
				disableAnimation: true,
				fromURL: true
			});
		}
	}

	run() {
		this._bindClickGalleryLinks();
	}

	_bindClickGalleryLinks() {
		const self = this,
			$links = this.$target.find('a');

		$links.on('click', function (e) {
			const
				tl = new gsap.timeline(),
				$el = $(this),
				$parallaxEl = $el.find('[data-arts-parallax] > *'),
				scale = gsap.getProperty($parallaxEl.get(0), 'scale'),
				index = $links.index($el);

			e.preventDefault();

			tl
				.add(() => {
					window.$body.addClass('pointer-events-none');
				})
				.set(self.$container, {
					transition: 'none'
				})
				.to($parallaxEl, {
					scale: 1,
					duration: 0.3,
				})
				.add(() => {
					self._openPhotoSwipe({
						index,
						galleryElement: self.$target
					});
				})
				.set($parallaxEl, {
					delay: 0.1,
					scale: scale,
					overwrite: 'all',
				})
				.set($el, {
					autoAlpha: 1
				})
				.add(() => {
					window.$body.removeClass('pointer-events-none');
				});
		});
	}
}

/*!========================================================================
	42. Scroll Down
	======================================================================!*/
class ScrollDown extends BaseComponent {
	constructor({
		target,
		scope,
		duration = 0.6
	}) {
		super({
			target,
			scope
		})

		this.duration = parseFloat(duration);
	}

	run() {
		this._bindEvents();
	}

	_bindEvents() {
		this.$target.on('click', (e) => {
			e.preventDefault();
			this._scrollDown();
		});
	}

	_scrollDown() {
		Scroll.scrollTo({
			x: 0,
			y: window.innerHeight + Math.min(0, -window.$pageHeader.height()),
			duration: this.duration
		});
	}
}

/*!========================================================================
	43. Section Fixed Reveal
	======================================================================!*/
class SectionFixedReveal extends BaseComponent {
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
		this.$spacer = this.$target.parent('.js-fixed-reveal-spacer');
		this.startAnimationOffset = this.$target.data('arts-fixed-reveal-from') || '-30vh';
		this.startAnimationOpacity = this.$target.data('arts-fixed-reveal-from-opacity') === undefined ? 1 : this.$target.data('arts-fixed-reveal-from-opacity');
		this.disabledAtBreakpoint = this.$target.data('arts-fixed-reveal-disabled-at');
		this.timeline = new gsap.timeline();
		this.scrollTrigger = null;
	}

	run() {
		this._createWrapper();
		this._bindEvents();

		if (!this._isCurrentlyDisabled()) {
			this._animate();
		}
	}

	_bindEvents() {
		window.$window
			// re-create everything
			.on(getResponsiveResizeEvent(), debounce(() => {
				this._createWrapper();

				if (!this.timeline && !this._isCurrentlyDisabled()) {
					this._animate();
				}

				if (this._isCurrentlyDisabled()) {
					if (this.scrollTrigger) {
						this.scrollTrigger.disable();
					}
					gsap.set(this.$target, {
						clearProps: 'all'
					});
				} else {
					if (this.scrollTrigger) {
						this.scrollTrigger.enable();
					}
				}
			}, 250))
			// refresh ST
			.on('arts/scrolltrigger/update', (e) => {
				if (this.scrollTrigger && e.detail && e.detail.target === 'fixed-reveal') {
					this.scrollTrigger.refresh(e.detail.immediate);
				}
			});
	}

	_isCurrentlyDisabled() {
		return window.Modernizr.mq(`(${this.disabledAtBreakpoint})`) || window.innerHeight < this._getHeight();
	}

	_createWrapper() {
		if (!this.$spacer || !this.$spacer.length) {
			this.$target.wrap('<div class="js-fixed-reveal-spacer"></div>');
			this.$spacer = this.$target.parent('.js-fixed-reveal-spacer');
		}

		gsap.set(this.$target, {
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0
		});

		gsap.set(this.$spacer, {
			height: () => this._getHeight(),
			position: 'relative',
			background: this.$target.css('background-color'),
			overflow: 'hidden',
			zIndex: this.$target.css('z-index')
		});
	}

	_getHeight() {
		return this.$target.outerHeight();
	}

	_animate() {
		if (this.scrollTrigger && typeof this.scrollTrigger.kill === 'function') {
			this.scrollTrigger.kill();
		}

		this.timeline.clear().fromTo(this.$target, {
			y: this.startAnimationOffset,
			ease: 'none',
			autoAlpha: this.startAnimationOpacity
		}, {
			y: '0vh',
			autoAlpha: 1,
			ease: 'none'
		});

		this.scrollTrigger = ScrollTrigger.create({
			animation: this.timeline,
			end: () => `bottom bottom`,
			start: () => `top bottom`,
			trigger: this.$spacer,
			scrub: true,
			invalidateOnRefresh: true
		});
	}
}

/*!========================================================================
	44. Section Horizontal Scroll
	======================================================================!*/
class SectionHorizontalScroll extends BaseComponent {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});

		this.listenerAdded = false;
	}

	set() {
		this.scrollingType = this.$target.data('arts-horizontal-scroll-type') || 'modular';
		this.scrollingToggleClass = this.$target.data('arts-horizontal-scroll-toggle-class') || false;
		this.toggleClass = this.scrollingToggleClass.length && this.scrollingToggleClass !== 'false' ? this.scrollingToggleClass : false;
		this.triggers = {
			pin: null,
			sections: []
		};
		this.sections = [];
		this.savedSBDamping;
		this.$wrapper = this.$target.find('[data-arts-horizontal-scroll="wrapper"]');
		this.wrapper = this.$wrapper.get(0);
		this.$sections = this.$target.find('[data-arts-horizontal-scroll="section"]');
	}

	init() {
		this._init();
		this._initLazyImages();
		this._bindEvents();
	}

	_isEnabled() {
		return !window.Modernizr.touchevents;
	}

	_initLazyImages() {
		const
			$lazyImages = this.$wrapper.find('.lazy:not(.lazy_loaded) img[data-src]'),
			$lazyBackgrounds = this.$wrapper.find('.lazy-bg:not(.lazy_loaded)[data-src]');

		// set lazy loading images in horizontal scrolling section
		if ($lazyImages.length) {
			this.lazyImages = new LazyLoad({
				images: $lazyImages,
				appendScroll: this._getLazyScrollingContainer(),
				threshold: 0
			});

			window.$window.one('arts/barba/transition/start', this.lazyImages.destroy);

			ScrollTrigger.create({
				trigger: this.$target,
				once: true,
				invalidateOnRefresh: true,
				start: () => `top bottom`,
				onEnter: () => {
					this.lazyImages.lazyImages.update();
				}
			});
		}
		// set lazy loading backgrounds
		if ($lazyBackgrounds.length) {
			this.lazyBackgrounds = new LazyLoad({
				backgrounds: $lazyBackgrounds,
				appendScroll: this._getLazyScrollingContainer(),
				threshold: 0
			});

			window.$window.one('arts/barba/transition/start', this.lazyBackgrounds.destroy);

			ScrollTrigger.create({
				trigger: this.$target,
				once: true,
				invalidateOnRefresh: true,
				start: () => `top bottom`,
				onEnter: () => {
					this.lazyBackgrounds.lazyBackgrounds.update();
				}
			});
		}
	}

	_init() {
		this._clearContainer();
		this._calculateContainer();
		this._setWrapperHeight();
		this._handleWrapper();

		// In 'modular' scrolling mode the actual scrolling
		// is done with section-by-section translation
		if (this.scrollingType === 'modular') {
			this._setSectionTriggerData();
			this._createSectionsTriggers();
		}
		this._refreshScene();
	}

	_isSmoothScrollingEnabled() {
		return typeof window.SB !== 'undefined' && window.Modernizr.mq('(min-width: 992px)');
	}

	_calculateContainer() {
		this.scrollWidth = this._calculateSectionsTotalWidth(); // cache scroll width
		this.offsetLeft = this.target.offsetLeft; // cache offset width
		this.offsetWidth = this.target.offsetWidth; // cache offset width
		this.offsetHeight = this.target.offsetHeight; // cache offset height
		this.maxScrollWidth = Math.max(0, this.scrollWidth - this.offsetWidth);
		this.screenViews = this.scrollWidth / this.offsetWidth;
	}

	_calculateSectionsTotalWidth() {
		let totalWidth = 0;

		this.$sections.each(function () {
			totalWidth += this.offsetWidth;
		});

		return totalWidth;
	}

	_clearContainer() {
		if (this.$sections.length) {
			gsap.set(this.$sections, {
				clearProps: 'transform'
			});
		}

		if (this.$wrapper.length) {
			gsap.set(this.$wrapper, {
				clearProps: 'transform,height'
			});
		}
	}

	_saveSmoothScrollbarDamping() {
		if (this._isSmoothScrollingEnabled() && !this.savedSBDamping) {
			this.savedSBDamping = window.SB.options.damping;
			window.SB.update();
		}
	}

	_restoreSmoothScrollbarDamping() {
		if (this._isSmoothScrollingEnabled()) {
			window.SB.options.damping = this.savedSBDamping;
			window.SB.update();
		}
	}

	_bindEvents() {
		const self = this;

		window.$window.on('resize', debounce(() => {
			self._clearContainer();
			self._calculateContainer();
			self._setWrapperHeight();
			self._setSectionTriggerData();
			self._refreshScene();
		}, 250));
	}

	_getLazyScrollingContainer() {
		if (window.Modernizr.mq('(min-width: 992px)')) {
			return this.$wrapper;
		}

		return window;
	}

	_handleWrapper() {
		ScrollTrigger.matchMedia({
			'(min-width: 992px)': () => {
				const
					animation = new gsap.timeline(),
					scrollEvent = new CustomEvent('scroll');

				if (this._isEnabled()) {
					// In 'wrapper' scrolling we need to translate the whole container
					if (this.scrollingType === 'wrapper') {
						animation
							.to(this.$wrapper, {
								x: () => `-${this.maxScrollWidth}`,
								y: () => this._isSmoothScrollingEnabled() ? this.maxScrollWidth : 0,
								duration: 1,
								ease: 'none',
							})
					}

					ScrollTrigger.create({
						animation,
						trigger: this.$target,
						pin: this._isSmoothScrollingEnabled() ? false : this.$wrapper,
						pinSpacing: 'margin',
						pinType: 'fixed',
						scrub: true,
						toggleClass: this.scrollingType === 'modular' ? false : {
							targets: this.wrapper,
							className: this.toggleClass
						},
						invalidateOnRefresh: true,
						anticipatePin: 1,
						refreshPriority: 100,
						onToggle: (instance) => {
							if (this._compareVersion(gsap.version, '3.7.1') <= 0) {
								if (instance.isActive) {
									this._enableScrollMomentum(false);
								} else {
									this._enableScrollMomentum(true);
								}
							}
						},
						onUpdate: () => {
							this.wrapper.dispatchEvent(scrollEvent);
						},
						start: () => `top top`,
						end: () => `top+=${this.maxScrollWidth} top`,
					});
				} else { // only emit scrolling events, don't pin
					ScrollTrigger.create({
						trigger: this.$target,
						scrub: true,
						invalidateOnRefresh: true,
						refreshPriority: 100,
						onUpdate: () => {
							this.wrapper.dispatchEvent(scrollEvent);
						},
						start: () => `top top`,
						end: () => `top+=${this.maxScrollWidth} top`,
					});
				}
			}
		});
	}

	_enableScrollMomentum(enable = true) {
		if (enable === true) {
			this._restoreSmoothScrollbarDamping();
		} else {
			if (this._isSmoothScrollingEnabled()) {
				this._saveSmoothScrollbarDamping();
				window.SB.setMomentum(0, 0);
				window.SB.options.damping = 10;
			}
		}
	}

	_setWrapperHeight() {
		if (this.$wrapper.length && this._isSmoothScrollingEnabled()) {
			gsap.set(this.$wrapper, {
				height: () => this.wrapper.scrollWidth - (this.target.offsetWidth - this.target.offsetHeight),
			});
		} else {
			gsap.set(this.$wrapper, {
				clearProps: 'height'
			});
		}
	}

	_setSectionTriggerData() {
		const self = this;
		const isSmoothScrollingEnabled = this._isSmoothScrollingEnabled();

		if (this.$sections.length) {
			this.$sections.each(function (index) {
				const
					$this = $(this),
					left = this.offsetLeft,
					width = this.offsetWidth,
					right = left + width,
					offsetFromScreenEnd = (self.maxScrollWidth > self.offsetWidth) ? left - self.offsetWidth - (isSmoothScrollingEnabled ? self.offsetLeft : 0) : 0;

				let
					fromX = 0,
					fromY = 0,
					toX = 0,
					toY = 0,
					start,
					end,
					offsetLeft = 0;

				let position = 'scrollScreen'; // startScreen scrollScreen endScreen

				if (left <= self.target.offsetWidth) {
					position = 'startScreen';
				}

				if (right > self.target.offsetWidth * (self.screenViews - 1)) {
					position = 'endScreen';
				}

				if (isSmoothScrollingEnabled) {
					offsetLeft = self.target.offsetLeft;
				}

				switch (position) {
					case 'startScreen':
						fromX = 0;
						fromY = 0;
						toX = -right + offsetLeft;
						toY = isSmoothScrollingEnabled ? right - offsetLeft : -offsetLeft;
						start = `top top`;
						end = `top+=${right - offsetLeft} top`;

						// immediately add "in-view" class for the sections
						// which are in view
						if (self.toggleClass) {
							$this.addClass(self.toggleClass);
						}
						break;
					case 'endScreen':
						fromX = -offsetFromScreenEnd;
						fromY = isSmoothScrollingEnabled ? offsetFromScreenEnd : 0;
						toX = -self.maxScrollWidth;
						toY = isSmoothScrollingEnabled ? self.maxScrollWidth : -offsetLeft;
						start = `top+=${offsetFromScreenEnd} top`;
						end = `top+=${self.maxScrollWidth} top`;
						break;
					default:
						fromX = -offsetFromScreenEnd;
						fromY = isSmoothScrollingEnabled ? offsetFromScreenEnd : 0;
						toX = -right + offsetLeft;
						toY = isSmoothScrollingEnabled ? right - self.target.offsetLeft : -offsetLeft;
						start = `top+=${offsetFromScreenEnd} top`;
						end = `top+=${right - offsetLeft} top`;
						break;

				}

				self.sections[index] = {
					left,
					width,
					position,
					fromX,
					fromY,
					toX,
					toY,
					start,
					end
				};
			});
		}
	}

	_createSectionsTriggers() {
		const self = this;

		if (this.$sections.length) {
			ScrollTrigger.matchMedia({
				'(min-width: 992px)': () => {
					if (self._isEnabled()) {
						this.$sections.each(function (index) {
							const tl = new gsap.timeline();

							tl.fromTo(this, {
								x: () => self.sections[index].fromX,
								y: () => self.sections[index].fromY,
							}, {
								x: () => self.sections[index].toX,
								y: () => self.sections[index].toY,
								ease: 'none',
								duration: 1,
								scrollTrigger: {
									trigger: self.$target,
									scrub: true,
									invalidateOnRefresh: true,
									start: () => self.sections[index].start,
									end: () => self.sections[index].end,
									toggleClass: {
										targets: this,
										className: self.toggleClass
									},
								}
							});
						});
					}
				}
			});
		}
	}

	_refreshScene() {
		ScrollTrigger.refresh();

		if (this._isSmoothScrollingEnabled()) {
			window.SB.update();
		}
	}

	_compareVersion(e, t) {
		if ("string" != typeof e) return !1;
		if ("string" != typeof t) return !1;
		e = e.split("."), t = t.split(".");
		const a = Math.min(e.length, t.length);
		for (let n = 0; n < a; ++n) {
			if (e[n] = parseInt(e[n], 10), t[n] = parseInt(t[n], 10), e[n] > t[n]) return 1;
			if (e[n] < t[n]) return -1
		}
		return e.length == t.length ? 0 : e.length < t.length ? -1 : 1
	}
}

/*!========================================================================
	45. Slider Dots
	======================================================================!*/
class SliderDots {
	constructor({
		slider,
		container
	}) {
		this.slider = slider;
		this.$container = container;
		this.$dots = this.$container.find('.slider__dot');
		this.delay = this.slider.params.autoplay.enabled || this.slider.params.autoplay.enabledLater ? parseFloat(this.slider.params.autoplay.delay / 1000) : parseFloat(this.slider.params.speed / 1000 / 2);
		this.timeline = new gsap.timeline();
		this.initialSetTimeline = new gsap.timeline({
			paused: true
		});

		if (!this.$dots.length) {
			return false;
		}

		this.run();
	}

	run() {
		this._renderDots();
		this._prepare();
		this._bindEvents();
	}

	_renderDots() {
		this.$dots.append(this._getDotTemplate());
		this.$circles = this.$dots.find('.circle');
	}

	_prepare() {
		gsap.set(this.$circles, {
			strokeOpacity: 0,
			transformOrigin: 'center center',
			rotate: 180,
			drawSVG: '100% 100%',
		});

		const
			$currentDot = this.$dots.eq(0),
			$currentCircle = $currentDot.find('.circle');

		this.initialSetTimeline.fromTo($currentCircle, {
			strokeOpacity: 1,
			rotate: 0,
			transformOrigin: 'center center',
			drawSVG: '100% 100%',
			ease: 'power3.inOut',
		}, {
			strokeOpacity: 1,
			rotate: 180,
			transformOrigin: 'center center',
			duration: this.delay,
			drawSVG: '0% 100%',
		});
	}

	_bindEvents() {
		this.slider
			.on('autoplayStop', () => {
				this.timeline.pause();
				if (this.initialSetTimeline) {
					this.initialSetTimeline.pause();
				}
			})
			.on('autoplayStart', () => {
				this.timeline.play();
				if (this.initialSetTimeline) {
					this.initialSetTimeline.play();
				}
			})
			.on('transitionStart', () => {
				this._setCurrentDot(this.slider.realIndex);
			});
	}

	_setCurrentDot(index = 0) {
		const
			$currentDot = this.$dots.eq(index),
			$currentCircle = $currentDot.find('.circle'),
			$otherCircles = this.$circles.not($currentCircle);

		this.timeline
			.clear()
			.add(() => {
				if (this.initialSetTimeline) {
					this.initialSetTimeline.kill();
					this.initialSetTimeline = undefined;
				}
			})
			.to($otherCircles, {
				duration: this.delay / 10,
				transformOrigin: 'center center',
				drawSVG: '0% 0%',
				ease: 'expo.inOut',
			})
			.set($otherCircles, {
				strokeOpacity: 0,
			})
			.fromTo($currentCircle, {
				strokeOpacity: 1,
				rotate: 0,
				transformOrigin: 'center center',
				drawSVG: '100% 100%',
				ease: 'power3.inOut',
			}, {
				strokeOpacity: 1,
				rotate: 180,
				transformOrigin: 'center center',
				duration: this.delay,
				drawSVG: '0% 100%',
			});
	}

	_getDotTemplate() {
		return `
			<svg viewBox="0 0 152 152" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g fill="none" fill-rule="evenodd"><g transform="translate(-134.000000, -98.000000)">
					<path class="circle" d="M135,174a75,75 0 1,0 150,0a75,75 0 1,0 -150,0"></path>
				</g>
			</svg>
		`;
	}
}

/*!========================================================================
	46. Slider Text Transitions
	======================================================================!*/
class SliderTextTransitions {
	constructor({
		slider,
		direction,
		staggerHeadings = 0.2,
		staggerTexts = 0.2,
		heading,
		subheading,
		description,
		link,
		line,
		hasAnimation = false
	}) {
		// slider
		this.slider = slider;
		this.$slides = $(this.slider.slides);
		this.hasAnimation = hasAnimation;
		this.$firstSlide = hasAnimation ? $({}) : this.$slides.eq(0); // don't exclude 1st slide from animation

		// params
		this.offset;
		this.direction = direction || this.slider.params.direction;
		this.speed = parseFloat(this.slider.params.speed / 1000);

		// elements
		this.$heading = heading;
		this.$subheading = subheading;
		this.$description = description;
		this.$link = link;
		this.$line = line;

		// animation
		this.timeline = new gsap.timeline();
		this.hideTimeline = new gsap.timeline();
		this.ease = 'expo.out';
		this.staggerHeadings = staggerHeadings;
		this.staggerTexts = staggerTexts;
		this.animationDirections = this._getAnimationDirections();
		this._initialSet();
		this._bindEvents();
	}

	_bindEvents() {
		this.slider.on('slideChange', () => {
			if (this.slider.realIndex > this.slider.previousIndex) {
				this._slideChangeTransition({
					direction: 'next'
				});
			}

			if (this.slider.realIndex < this.slider.previousIndex) {
				this._slideChangeTransition({
					direction: 'prev'
				});
			}
		});
	}

	_initialSet() {
		const directions = this._getSlideAnimationDirections({
			direction: 'next'
		});

		if (this.$subheading && this.$subheading.length) {
			gsap.effects.setWords(this.$subheading.not(this.$firstSlide.find(this.$subheading)), {
				x: 0, //directions.in.x / 4,
				y: (directions.in.y || directions.in.x),
				autoAlpha: 0,
			});
		}

		if (this.$heading && this.$heading.length) {
			gsap.effects.setChars(this.$heading.not(this.$firstSlide.find(this.$heading)), {
				x: directions.in.x,
				y: directions.in.y,
			});
		}

		if (this.$description && this.$description.length) {
			gsap.effects.setLines(this.$description.not(this.$firstSlide.find(this.$description)), {
				autoAlpha: 1,
				y: '100%',
			});
		}

		if (this.$link && this.$link.length) {
			gsap.set(this.$link.not(this.$firstSlide.find(this.$link)), {
				y: (this.animationDirections.offset.y.next.in || this.animationDirections.offset.x.next.in),
				autoAlpha: 0,
			});
		}

		if (this.$line && this.$line.length) {
			gsap.set(this.$line.not(this.$firstSlide.find(this.$line)), {
				scaleX: 0
			});
		}
	}

	_slideChangeTransition({
		direction = 'next'
	}) {
		const
			self = this,
			directions = this._getSlideAnimationDirections({
				direction
			}),
			$prevSlide = this.$slides.eq(this.slider.previousIndex),
			$prevHeading = $prevSlide.find(this.$heading),
			$prevSubheading = $prevSlide.find(this.$subheading),
			$prevDescription = $prevSlide.find(this.$description),
			$prevLink = $prevSlide.find(this.$link),
			$prevLine = $prevSlide.find(this.$line),
			$activeSlide = this.$slides.eq(this.slider.realIndex),
			$activeHeading = $activeSlide.find(this.$heading),
			$activeSubheading = $activeSlide.find(this.$subheading),
			$activeDescription = $activeSlide.find(this.$description),
			$activeLink = $activeSlide.find(this.$link),
			$activeLine = $activeSlide.find(this.$line);

		this.timeline.clear();

		/**
		 * Animate out previous elements
		 * and set current elements
		 */
		if (this.$subheading && this.$subheading.length) {
			self.timeline.add([
				gsap.effects.hideWords($prevSubheading, {
					duration: self.speed / 2,
					autoAlpha: 1,
					x: 0, //directions.out.x / 4,
					y: (directions.out.y || directions.out.x),
					stagger: distributeByPosition({
						amount: self.staggerHeadings,
						from: directions.out.from
					}),
					ease: self.ease
				}),
				gsap.effects.setWords(this.$subheading.not($prevSubheading), {
					autoAlpha: 1,
					x: 0,
					y: (directions.in.y || directions.in.x),
				})
			], '0')
		}

		if (this.$heading && this.$heading.length) {
			self.timeline.add([
				gsap.effects.hideChars($prevHeading, {
					duration: self.speed,
					autoAlpha: 1,
					x: directions.out.x,
					y: directions.out.y,
					stagger: distributeByPosition({
						amount: self.staggerHeadings,
						from: directions.out.from
					}),
					ease: self.ease
				}),
				gsap.effects.setChars(this.$heading.not($prevHeading), {
					autoAlpha: 1,
					x: directions.in.x,
					y: directions.in.y,
				})
			], '0');
		}

		if (this.$description && this.$description.length) {
			self.timeline.add([
				gsap.effects.hideLines($prevDescription, {
					duration: self.speed,
					y: direction === 'next' ? '-100%' : '100%',
					stagger: distributeByPosition({
						from: direction === 'next' ? 'start' : 'end',
						amount: self.staggerTexts
					}),
					ease: self.ease,
				}),
				gsap.effects.setLines(this.$description.not($prevDescription), {
					y: direction === 'next' ? '100%' : '-100%',
				}),
			], '0')
		}

		if (this.$link && this.$link.length) {
			self.timeline.add([
				gsap.to($prevLink, {
					duration: self.speed,
					y: (directions.out.y || directions.out.x),
					autoAlpha: 0,
					ease: self.ease
				}),
				gsap.set(this.$link.not($prevLink), {
					y: (directions.in.y || directions.in.x),
					autoAlpha: 0
				})
			], '0');
		}

		if (this.$line && this.$line.length) {
			self.timeline.add([
				gsap.to($prevLine, {
					duration: self.speed,
					scaleX: 0,
					transformOrigin: direction === 'next' ? 'right center' : 'left center',
					ease: self.ease,
				}),
				gsap.set(this.$line.not($prevLine), {
					scaleX: 0
				})
			], '0');
		}

		/**
		 * All current elements are set
		 */
		self.timeline.addLabel('elementsSet');

		/**
		 * Animate in current elements
		 */
		if ($activeSubheading.length) {
			self.timeline.animateWords($activeSubheading, {
				autoAlpha: 1,
				duration: self.speed,
				stagger: distributeByPosition({
					amount: self.staggerHeadings,
					from: directions.in.from,
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeHeading.length) {
			self.timeline.animateChars($activeHeading, {
				duration: self.speed,
				stagger: distributeByPosition({
					amount: self.staggerHeadings,
					from: directions.in.from,
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeDescription.length) {
			self.timeline.animateLines($activeDescription, {
				duration: self.speed,
				autoAlpha: 1,
				stagger: distributeByPosition({
					amount: self.staggerTexts,
					from: direction === 'next' ? 'start' : 'end',
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeLink.length) {
			self.timeline.to($activeLink, {
				duration: self.speed,
				y: '0%',
				autoAlpha: 1,
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeLine.length) {
			self.timeline.to($activeLine, {
				duration: self.speed,
				scaleX: 1,
				transformOrigin: direction === 'next' ? 'left center' : 'right center',
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		this.timeline.totalDuration(this.speed * 1.5);

	}

	_getSlideAnimationDirections({
		direction = 'next'
	}) {
		const
			directions = {
				in: {
					x: 0,
					y: 0,
					from: 'start'
				},
				out: {
					x: 0,
					y: 0,
					from: 'start'
				},
			};
		if (direction === 'next') {
			// next in
			directions.in.x = this.animationDirections.offset.x.next.in;
			directions.in.y = this.animationDirections.offset.y.next.in;
			directions.in.from = this.animationDirections.from.next.in;

			// next out
			directions.out.x = this.animationDirections.offset.x.next.out;
			directions.out.y = this.animationDirections.offset.y.next.out;
			directions.out.from = this.animationDirections.from.next.out;
		}

		if (direction === 'prev') {
			// prev in
			directions.in.x = this.animationDirections.offset.x.prev.in;
			directions.in.y = this.animationDirections.offset.y.prev.in;
			directions.in.from = this.animationDirections.from.prev.in;

			// prev out
			directions.out.x = this.animationDirections.offset.x.prev.out;
			directions.out.y = this.animationDirections.offset.y.prev.out;
			directions.out.from = this.animationDirections.from.prev.out;
		}

		return directions;
	}

	_getAnimationDirections() {
		const textAlign = this.$heading ? this.$heading.css('text-align') : 'left';

		const directions = {
			offset: {
				x: {
					next: {
						in: 0,
						out: 0
					},
					prev: {
						in: 0,
						out: 0
					},
				},
				y: {
					next: {
						in: 0,
						out: 0
					},
					prev: {
						in: 0,
						out: 0
					},
				},
			},
			from: {
				next: {
					in: 'start',
					out: 'start'
				},
				prev: {
					in: 'end',
					out: 'end'
				},
			}
		};

		switch (textAlign) {
			default: // left
				// text align left & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = '104%';
					directions.offset.x.next.out = '-104%';
					directions.offset.x.prev.in = '-104%';
					directions.offset.x.prev.out = '104%';

					directions.from.next.in = 'start';
					directions.from.next.out = 'start';
					directions.from.prev.in = 'end';
					directions.from.prev.out = 'end';
				}
				// text align left & slider vertical
				if (this.direction === 'vertical') {
					directions.offset.y.next.in = '100%';
					directions.offset.y.next.out = '-100%';
					directions.offset.y.prev.in = '-100%';
					directions.offset.y.prev.out = '100%';

					directions.from.next.in = 'end';
					directions.from.next.out = 'start';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'end';
				}
				break;
			case 'center':
				// text align center & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = '-104%';
					directions.offset.x.next.out = '104%';
					directions.offset.x.prev.in = '104%';
					directions.offset.x.prev.out = '-104%';

					directions.from.next.in = 'end';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'start';
				}
				// text align left & slider vertical
				if (this.direction === 'vertical') {
					directions.offset.y.next.in = '100%';
					directions.offset.y.next.out = '-100%';
					directions.offset.y.prev.in = '-100%';
					directions.offset.y.prev.out = '100%';

					directions.from.next.in = 'center';
					directions.from.next.out = 'center';
					directions.from.prev.in = 'center';
					directions.from.prev.out = 'center';
				}
				break;
			case 'right':
				// text align right & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = '-104%';
					directions.offset.x.next.out = '104%';
					directions.offset.x.prev.in = '104%';
					directions.offset.x.prev.out = '-104%';

					directions.from.next.in = 'end';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'start';
				}
				// text align right & slider vertical
				if (this.direction === 'vertical') {

					directions.offset.y.next.in = '-100%';
					directions.offset.y.next.out = '100%';
					directions.offset.y.prev.in = '100%';
					directions.offset.y.prev.out = '-100%';

					directions.from.next.in = 'start';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'end';
					directions.from.prev.out = 'start';
				}
				break;
		}

		return directions;
	}

}

/*!========================================================================
	47. Smooth Scroll
	======================================================================!*/
class SmoothScroll {
	constructor({
		target = $('.js-smooth-scroll'),
		adminBar,
		absoluteElements,
		fixedElements
	}) {
		this.$target = target;
		this.$WPadminBar = adminBar;
		this.$absoluteElements = absoluteElements;
		this.$fixedElements = fixedElements;
		this.run();
	}

	run() {

		if (
			typeof window.Scrollbar === 'undefined' ||
			!window.kinsey.theme.smoothScroll.enabled ||
			!this.$target ||
			!this.$target.length ||
			typeof elementor !== 'undefined' || // don't launch in Elementor edit mode
			window.kinsey.theme.isElementorEditorActive || // don't launch in Elementor edit mode
			(window.Modernizr.touchevents && !this.$target.hasClass('js-smooth-scroll_enable-mobile')) || // don't launch on touch devices
			window.Modernizr.touchevents
		) {
			this._handleAnchorsScrolling();
			window.$html.removeClass('smoothscroll');
			return false;
		}

		this._registerPlugins();
		this.$target.addClass('smooth-scroll');
		window.$html.addClass('smoothscroll');

		window.SB = window.Scrollbar.init(this.$target[0], window.kinsey.theme.smoothScroll);

		this._bindEvents();

		try {
			this._handleAnchorsScrolling();
		} catch (error) {
			console.error(`Smooth anchor scrolling: Unrecognized selector expression: ${error}`)
		}

		if (typeof this.$absoluteElements !== 'undefined' && this.$absoluteElements.length) {
			this._correctAbsolutePositionElements();
		}

		if (typeof this.$fixedElements !== 'undefined' && this.$fixedElements.length) {
			this._correctFixedPositionElements();
		}

		// Immediately focus SB container so it become accessible for keyboard navigation
		window.SB.containerEl.focus();
	}

	_registerPlugins() {

		if (typeof NativeScrollEventPlugin !== 'undefined') {
			window.Scrollbar.use(NativeScrollEventPlugin);
		}

		if (typeof ProxyGSAPScrollTriggerPlugin !== 'undefined') {
			window.Scrollbar.use(ProxyGSAPScrollTriggerPlugin);
		}

		if (typeof DisableScrollPlugin !== 'undefined') {
			window.Scrollbar.use(DisableScrollPlugin);
		}

		if (window.kinsey.theme.smoothScroll.plugins.edgeEasing && typeof SoftscrollPlugin !== 'undefined') {
			window.Scrollbar.use(SoftscrollPlugin);
		}
	}

	_bindEvents() {
		// Destroy instance after page transition
		window.$window.one('arts/barba/transition/init/before', () => {
			window.SB.destroy();
		});
	}

	_handleAnchorsScrolling() {
		this.$target.find('a[href*="#"]:not([href="#"]):not(.post__comments a)').each(function () {
			const
				$current = $(this),
				url = $current.attr('href'),
				filteredUrl = url.substring(url.indexOf('#'));

			if (filteredUrl.length) {
				const $el = $(filteredUrl);

				if ($el.length) {
					$current.on('click', function (e) {
						e.preventDefault();
						Scroll.scrollTo({
							x: 0,
							y: $el.offset().top,
							duration: 0.8
						});
					});
				}
			}
		});
	}

	_correctAbsolutePositionElements() {
		const barHeight = (this.$WPadminBar.length && this.$WPadminBar.height()) || 0;

		gsap.to(this.$absoluteElements, {
			y: 0,
			duration: 0.3
		});

		this.$absoluteElements.each(function () {
			const $el = $(this);

			window.SB.addListener((scrollbar) => {
				gsap.set($el, {
					y: -scrollbar.offset.y + barHeight
				});
			});
		});
	}

	_correctFixedPositionElements() {
		const barHeight = (this.$WPadminBar.length && this.$WPadminBar.height()) || 0;

		gsap.to(this.$fixedElements, {
			y: 0,
			duration: 0.3
		});

		this.$fixedElements.each(function () {
			const $el = $(this);

			window.SB.addListener((scrollbar) => {
				gsap.set($el, {
					y: scrollbar.offset.y - barHeight
				});
			});
		});
	}
}

/*!========================================================================
	48. Mobile Bar Height
	======================================================================!*/
class MobileBarHeight {
	constructor() {
		this.vh = 0;
		this._createStyleElement();
		this._setVh();

		if (window.kinsey.theme.mobileBarFix.update) {
			this._bindEvents();
		}
	}

	_setVh() {
		this.vh = document.documentElement.clientHeight * 0.01;
		$('#arts-fix-bar').html(`:root { --fix-bar-vh: ${this.vh}px; }`);
	}

	_bindEvents() {
		const event = getResponsiveResizeEvent();

		window.$window.on(event, debounce(() => {
			this._setVh();
		}, 250));
	}

	_createStyleElement() {
		if (!$('#arts-fix-bar').length) {
			$('head').append('<style id="arts-fix-bar"></style>');
		}
	}
}

/*!========================================================================
	49. Debounce
	======================================================================!*/
function debounce(func, wait, immediate) {
	let timeout;

	return () => {
		let
			context = this,
			args = arguments;

		let later = () => {

			timeout = null;

			if (!immediate) {
				func.apply(context, args)
			};

		};

		let callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args)
		};
	};
};

/*!========================================================================
	50. Distribute By Position
	======================================================================!*/
/*
pass in an object with any of the following optional properties (just like the stagger special object):
{
  amount: amount (in seconds) that should be distributed
  from: "center" | "end" | "start" | index value (integer)
  ease: any ease, like Power1.easeOut
  axis: "x" | "y" (or omit, and it'll be based on both the x and y positions)
}
*/
function distributeByPosition(vars) {
	let ease = vars.ease,
		from = vars.from || 0,
		base = vars.base || 0,
		axis = vars.axis,
		ratio = {
			center: 0.5,
			end: 1
		} [from] || 0,
		distances;
	return function (i, target, a) {
		if (!a) {
			return 0;
		}

		let l = a.length,
			originX, originY, x, y, d, j, minX, maxX, minY, maxY, positions;
		if (!distances) {
			distances = [];
			minX = minY = Infinity;
			maxX = maxY = -minX;
			positions = [];
			for (j = 0; j < l; j++) {
				d = a[j].getBoundingClientRect();
				x = (d.left + d.right) / 2; //based on the center of each element
				y = (d.top + d.bottom) / 2;
				if (x < minX) {
					minX = x;
				}
				if (x > maxX) {
					maxX = x;
				}
				if (y < minY) {
					minY = y;
				}
				if (y > maxY) {
					maxY = y;
				}
				positions[j] = {
					x: x,
					y: y
				};
			}
			originX = isNaN(from) ? minX + (maxX - minX) * ratio : positions[from].x || 0;
			originY = isNaN(from) ? minY + (maxY - minY) * ratio : positions[from].y || 0;
			maxX = 0;
			minX = Infinity;
			for (j = 0; j < l; j++) {
				x = positions[j].x - originX;
				y = originY - positions[j].y;
				distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs((axis === "y") ? y : x);
				if (d > maxX) {
					maxX = d;
				}
				if (d < minX) {
					minX = d;
				}
			}
			distances.max = maxX - minX;
			distances.min = minX;
			distances.v = l = vars.amount || (vars.each * l) || 0;
			distances.b = (l < 0) ? base - l : base;
		}
		l = (distances[i] - distances.min) / distances.max;
		return distances.b + (ease ? ease.getRatio(l) : l) * distances.v;
	};
}

/*!========================================================================
	51. Get Color Values
	======================================================================!*/
// return array of [r,g,b,a] from any valid color. if failed returns undefined
function getColorValues(color) {
	// empty argument
	if (color === '') {
		return;
	}

	// transparent color
	if (color.toLowerCase() === 'transparent') {
		return [0, 0, 0, 0];
	}

	// HEX
	if (color[0] === '#') {
		if (color.length < 7) {
			// convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
			color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
		}

		return [parseInt(color.substr(1, 2), 16),
			parseInt(color.substr(3, 2), 16),
			parseInt(color.substr(5, 2), 16),
			color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1
		];
	}
	// RGB
	if (color.indexOf('rgb') === -1) {
		// convert named colors
		let temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
		let flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14

		temp_elem.style.color = flag;

		if (temp_elem.style.color !== flag) {
			return; // color set failed - some monstrous css rule is probably taking over the color of our object
		}

		temp_elem.style.color = color;
		if (temp_elem.style.color === flag || temp_elem.style.color === '') {
			return; // color parse failed
		}

		color = getComputedStyle(temp_elem).color;
		document.body.removeChild(temp_elem);
	}

	// RGBA
	if (color.indexOf('rgb') === 0) {
		if (color.indexOf('rgba') === -1) {
			color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
			return color.match(/[\.\d]+/g).map(function (a) {
				return +a;
			});
		}
	}
}

/*!========================================================================
	52. Get Responsive Resize Event
	======================================================================!*/
function getResponsiveResizeEvent() {
	return window.Modernizr.touchevents ? 'orientationchange' : 'resize';
}

/*!========================================================================
	53. Is Browser Firefox
	======================================================================!*/
function isBrowserFirefox() {
	return ('netscape' in window) && / rv:/.test(navigator.userAgent);
}

/*!========================================================================
	54. Run On High Performance GPU
	======================================================================!*/
function runOnHighPerformanceGPU() {
	const $webGLCanvas = $('#js-webgl');

	// don't run on mobile devices
	if (!window.Modernizr.touchevents && $webGLCanvas.length) {
		$webGLCanvas[0].getContext('webgl', {
			powerPreference: 'high-performance'
		});
	}
}

/*!========================================================================
	55. Sanitize Selector
	======================================================================!*/
function sanitizeSelector(string) {
	if (!string || !string.length) {
		return false;
	}

	return string
		.replace(/(\r\n|\n|\r)/gm, '') // remove tabs, spaces
		.replace(/(\\n)/g, '') // remove lines breaks
		.replace(/^[,\s]+|[,\s]+$/g, '') // remove redundant commas
		.replace(/\s*,\s*/g, ','); // remove duplicated commas
}

/*!========================================================================
	56. Sync Attributes
	======================================================================!*/
function syncAttributes($sourceElement, $targetElement) {
	// single element
	if ($sourceElement.length === 1 && $targetElement.length === 1) {
		const
			targetEl = $targetElement.get(0),
			targetAttributes = $targetElement.getAllAttributes(),
			sourceAttributes = $sourceElement.getAllAttributes();

		// source element doesn't have any attributes present
		if ($.isEmptyObject(sourceAttributes)) {
			// ... so remove all attributes from the target element
			[...targetEl.attributes].forEach(attr => targetEl.removeAttribute(attr.name));
		} else {
			Object.keys(targetAttributes).forEach((key) => {
				// delete key on target that doesn't exist in source element
				if (key !== 'style' && !(key in sourceAttributes)) {
					$targetElement.removeAttr(key);
				}
			});

			// sync attributes
			$targetElement.attr(sourceAttributes);
		}

		// multiple elements
	} else if ($sourceElement.length > 1 && $targetElement.length > 1 && $sourceElement.length === $targetElement.length) {

		$.each($targetElement, function (index) {
			const
				$current = $(this),
				sourceAttributes = $sourceElement.eq(index).getAllAttributes();

			// source element doesn't have any attributes present
			if ($.isEmptyObject(sourceAttributes)) {
				// ... so remove all attributes from the target element
				[...this.attributes].forEach(attr => this.removeAttribute(attr.name));
			} else {

				// sync attributes
				$current.attr(sourceAttributes);
			}
		});
	}
}

/*!========================================================================
	57. Lazy Load
	======================================================================!*/
class LazyLoad {
	constructor({
		images,
		backgrounds,
		setPaddingBottom = true,
		appendScroll = window
	}) {
		this.$images = images;
		this.$backgrounds = backgrounds;
		this.lazyImages;
		this.lazyBackgrounds;
		this.appendScroll = appendScroll;

		if (this.$images && this.$images.length) {
			if (setPaddingBottom) {
				this.setPaddingBottom();
			}

			this.lazyImages = this.loadImages({
				target: this.$images
			});
		}

		if (this.$backgrounds && this.$backgrounds.length) {
			this.lazyBackgrounds = this.loadBackgrounds({
				target: this.$backgrounds
			});
		}
	}

	setPaddingBottom() {
		this.$images.each(function () {
			const $el = $(this),
				$elParent = $el.parent('.lazy-bg, .lazy'),
				$parentWrapper = $elParent.parent('.lazy-wrapper'),
				elWidth = $el.attr('width') || 0,
				elHeight = $el.attr('height') || 0,
				elPB = parseFloat((elHeight / elWidth) * 100); // padding-bottom hack

			// we need both width and height of element
			// to calculate proper value for "padding-bottom" hack
			if (!elWidth || !elHeight) {
				return;
			}

			// position image absolutely
			gsap.set($el, {
				position: 'absolute',
				top: 0,
				left: 0,
			});

			// set padding-bottom to the parent element so it will
			// create the needed space for the image
			gsap.set($elParent, {
				position: 'relative',
				overflow: 'hidden',
				paddingBottom: elPB + '%',
				height: 0
			});

			if ($parentWrapper.length && elWidth) {
				$parentWrapper.css({
					maxWidth: parseFloat(elWidth)
				});
			}
		});
	}

	loadBackgrounds({
		target,
		callback
	}) {
		if (target && target.length) {
			const instance = target.Lazy({
				appendScroll: this.appendScroll,
				threshold: 800,
				chainable: false,
				afterLoad: (el) => {
					$(el).closest('.lazy, .lazy-bg').addClass('lazy_loaded');

					if (typeof callback === 'function') {
						callback();
					}
				}
			});

			window.$window
				.on('arts/barba/transition/start', () => {
					instance.destroy();
				})
				.on('arts/barba/transition/end', () => {
					setTimeout(() => {
						instance.update();
					}, 50);
				});
			setTimeout(() => {
				instance.update();
			}, 50);

			return instance;
		}
	}

	loadImages({
		target,
		callback
	}) {
		if (target && target.length) {
			const instance = target.Lazy({
				appendScroll: this.appendScroll,
				threshold: 800,
				chainable: false,
				afterLoad: (el) => {
					$(el).closest('.lazy, .lazy-bg').addClass('lazy_loaded');

					if (typeof callback === 'function') {
						callback();
					}
				}
			});

			window.$window
				.on('arts/barba/transition/start', () => {
					instance.destroy();
				})
				.on('arts/barba/transition/end', () => {
					setTimeout(() => {
						instance.update();
					}, 50);
				});
			setTimeout(() => {
				instance.update();
			}, 50);

			return instance;
		}
	}
}

/*!========================================================================
	58. Preloader
	======================================================================!*/
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

/*!========================================================================
	59. Header
	======================================================================!*/
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

/*!========================================================================
	60. Slider Menu
	======================================================================!*/
class SliderMenu extends Slider {

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
		this.slider = null;
		// dragging
		this._setDragging({ target: this.$target });
		this.animationSpeed = this.$target.data('animation-speed') || this.$target.data('speed') || 1200;
	}

	run() {
		this._init();
		window.$window.on('resize', debounce(() => {
			this._init();
		}, 250));
	}

	_init() {
		if (this.$target.is(':visible') && !this.slider) {
			this.slider = this._getSlider();

			// slider drag
			if (typeof this.drag === 'object') {
				this._emitDragEvents($.extend(this.drag, {
					slider: this.slider,
				}));
			}

			this._bindEvents();
		}
	}

	_bindEvents() {
		window.$pageHeader
			.on('menuOpenStart', () => {
				const
					timeScale = parseFloat(window.kinsey.theme.animations.timeScale.overlayMenuOpen) || 1,
					multiplier = 1 / timeScale;

				this.slider.update();
				this._slideTo({
					slide: 'first',
					duration: this.animationSpeed * multiplier
				});
			})
			.on('menuOpenEnd', () => {
				this.slider.update();
			})
			.on('menuCloseStart', () => {
				const
					timeScale = parseFloat(window.kinsey.theme.animations.timeScale.overlayMenuClose) || 1,
					multiplier = 1 / timeScale;

				if (this.animationSpeed > 0) {
					this._slideTo({
						slide: 'last',
						duration: this.animationSpeed * multiplier
					});
				}
			});
	}

	_slideTo({
		slide = 'first',
		timeout = 50,
		duration = 1200
	}) {
		const lastIndex = this.slider.$el.find('.swiper-slide:not(.swiper-slide-duplicate)').length - 1;

		if (this.slider.params.loop) {

			if (slide === 'first') {
				this.slider.slideToLoop(lastIndex, 0);

				setTimeout(() => {
					this.slider.slideToLoop(0, duration);
				}, timeout);
			}

			if (slide === 'last') {
				setTimeout(() => {
					this.slider.slideToLoop(Math.abs(lastIndex - this.slider.realIndex), duration);
				}, timeout);
			}

		} else {

			if (slide === 'first') {
				this.slider.slideTo(lastIndex, 0);

				setTimeout(() => {
					this.slider.slideTo(0, duration);
				}, timeout);
			}

			if (slide === 'last') {
				this.slider.slideTo(0, 0);

				setTimeout(() => {
					this.slider.slideTo(lastIndex, duration);
				}, timeout);
			}

		}
	}

	_getSlider() {
		const parentContainer = this.$target.parent('.header__wrapper-slider').get(0);

		return new Swiper(this.$target[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$target.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			grabCursor: true,
			autoHeight: this.$target.data('auto-height'),
			speed: this.$target.data('speed') || 1200,
			preloadImages: false,
			direction: 'horizontal',
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 3,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			slidesPerView: 1.33,
			centeredSlides: true,
			spaceBetween: 20,
			loop: true,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			parallax: true,
			// breakpoints,
			breakpoints: {
				991: {
					direction: 'vertical',
					spaceBetween: this.$target.data('space-between') || 60,
					slidesPerView: 'auto',
					freeMode: true,
					freeModeSticky: true,
					centeredSlides: this.$target.data('centered-slides') || false,
				}
			},
			touchEventsTarget: 'container',
			keyboard: this.$target.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			mousewheel: this.$target.data('mousewheel-enabled') ? {
				eventsTarged: parentContainer,
				eventsTarget: parentContainer,
				releaseOnEdges: true,
			} : false,
		});
	}

}

/*!========================================================================
	61. Slider Projects
	======================================================================!*/
class SliderProjects extends Slider {
	constructor({
		parent,
		target,
		$header,
		scope,
		hasAnimation = false
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
		this.hasAnimation = hasAnimation;
		this.$sliderHeader = $header ? $header : null;
		this.$sliderIndicatorSource = $header ? $header.find('.js-slider-projects__source-indicator') : null;
		this.sliderHeaderIsVisible = true;
		this.sliderIndicatorIsVisible = false;
	}

	set() {
		this.$slidesBackground = this.$target.find('[data-slide-background]');
		this.$scrollBar = this.$target.find('.js-slider-projects__scrollbar');
		this.$indicator = this.$target.find('.js-slider-projects__indicator');
		this.$arrowPrev;
		this.$arrowNext;

		if (this.$parent && this.$parent.length) {
			this.$arrowPrev = this.$parent.find('.js-slider__arrow-prev');
			this.$arrowNext = this.$parent.find('.js-slider__arrow-next');
		} else {
			this.$arrowPrev = this.$target.find('.js-slider__arrow-prev');
			this.$arrowNext = this.$target.find('.js-slider__arrow-next');
		}

		// dragging
		this._setDragging({target: this.$target});
	}

	run() {
		this.slider = this._getSlider();

		// slider drag
		if (typeof this.drag === 'object') {
			this._emitDragEvents($.extend(this.drag, {
				slider: this.slider,
			}));
		}

		if (this.$slidesBackground.length) {
			this._setBackgrounds({
				target: this.$target.closest('.js-slider-background'),
				slider: this.slider,
				header: window.$pageHeader
			});
		}

		if (this.$sliderHeader.length && this._isIndicatorEnabled()) {
			this.sliderHeaderTimeline = new gsap.timeline();
			this.animationDuration = parseFloat(this.slider.params.speed / 1000);

			this._hideHeaderOnTransition();

			if (this.$sliderIndicatorSource.length && this.$indicator.length) {
				this.sliderIndicatorTimeline = new gsap.timeline();

				this._setIndicator();
				this._showIndicatorOnTransition();
			}
		}

		if (this.$parent.length) {
			this._setAutoplayAnimation({
				parent: this.$parent,
				slider: this.slider,
			});
		}

		// initial backgrounds set
		if (this.slider && typeof this.slider.emit === 'function') {
			this.slider.emit('slideChange');
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$target,
			slider: this.slider
		});

		// update all ScrollTrigger instances when slider is resizing its height
		if (this.slider) {
			this._updateScrollTriggerOnHeightChange(this.slider);
		}

		this._updateOnTransitionEnd([
			this.slider
		]);

		this._bindEvents();
	}

	_getSlider() {
		const breakpoints = this._setBreakpoints({
			target: this.$target
		});

		return new Swiper(this.$target[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$target.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			grabCursor: true,
			autoHeight: this.$target.data('auto-height'),
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			keyboard: this.$target.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			mousewheel: this.$target.data('mousewheel-enabled') ? {
				eventsTarged: this.target,
				eventsTarget: this.target,
				releaseOnEdges: true,
			} : false,
			speed: this.$target.data('speed') || 1200,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 3,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			centeredSlides: this.$target.data('centered-slides') || false,
			slidesPerView: this.$target.data('slides-per-view') || 2,
			spaceBetween: this.$target.data('space-between') || 60,
			parallax: true,
			navigation: {
				nextEl: this.$arrowPrev ? this.$arrowNext.get(0) : null,
				prevEl: this.$arrowPrev ? this.$arrowPrev.get(0) : null
			},
			scrollbar: {
				hide: false,
				el: this.$scrollBar.get(0),
				dragClass: 'slider__scrollbar-handle'
			},
			touchEventsTarget: 'container',
			breakpoints,
		});
	}

	_bindEvents() {
		window.$window.on(getResponsiveResizeEvent(), debounce(() => {
			if (!this._isIndicatorEnabled()) {
				gsap.effects.animateLines(this.$sliderHeader, {
					duration: 0.1,
					stagger: false,
				});

				this.sliderIndicatorIsVisible = true;
			}
		}, 250));
	}

	_isIndicatorEnabled() {
		return window.Modernizr.mq(`(min-width: 991px)`);
	}

	_hideHeaderOnTransition() {
		this.slider.on('slideChange', (e) => {
			if (this.sliderHeaderIsVisible === false && e.realIndex === 0) {
				this.sliderHeaderTimeline
					.clear()
					.animateLines(this.$sliderHeader, {
						stagger: false,
						duration: this.animationDuration / 2,
						delay: this.animationDuration / 2
					});

				this.sliderHeaderIsVisible = true;
			}

			if (this.sliderHeaderIsVisible === true && e.realIndex !== 0) {
				this.sliderHeaderTimeline
					.clear()
					.hideLines(this.$sliderHeader, {
						stagger: false,
						y: '-100%',
						duration: this.animationDuration / 2
					});

				this.sliderHeaderIsVisible = false;
			}
		});
	}



	_showIndicatorOnTransition() {
		this.slider.on('slideChange', (e) => {
			if (this.sliderIndicatorIsVisible === false && e.realIndex !== 0) {
				this.sliderIndicatorTimeline
					.clear()
					.to(this.$indicator, {
						y: '0%',
						duration: this.animationDuration / 2,
						ease: 'power3.inOut'
					});

				this.sliderIndicatorIsVisible = true;
			}

			if (this.sliderIndicatorIsVisible === true && e.realIndex === 0) {
				this.sliderIndicatorTimeline
					.clear()
					.to(this.$indicator, {
						y: '100%',
						duration: this.animationDuration / 2,
						delay: this.animationDuration / 2,
						ease: 'power3.inOut'
					});

				this.sliderIndicatorIsVisible = false;
			}
		});
	}

	_setIndicator() {
		// Set indicator text
		this.$indicator.text(this.$sliderIndicatorSource.text());

		gsap.set(this.$indicator, {
			y: '100%',
		});
	}
}

/*!========================================================================
	62. Slider Projects Fullscreen
	======================================================================!*/
class SliderProjectsFullscreen extends Slider {
	constructor({
		parent,
		target,
		scope,
		hasAnimation = false
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
		this.hasAnimation = hasAnimation;
	}

	set() {
		// sliders
		this.$slider = this.$target;
		this.$sliderContent = this.$slider.find('.js-slider-projects-fullscreen__content');
		this.$sliderImages = this.$slider.find('.js-slider-projects-fullscreen__images');
		this.$sliderThumbs = this.$slider.find('.js-slider-projects-fullscreen__thumbs');

		// scrollbar
		this.$scrollBar = this.$slider.find('.js-slider-projects-fullscreen__scrollbar');

		// counter
		this.$sliderCounterCurrent = this.$target.find('.js-slider__counter-current');
		this.$sliderCounterTotal = this.$target.find('.js-slider__counter-total');

		// counter zeros amount to prepend
		this.sliderCounterZeros = this.$sliderImages.data('counter-add-zeros') || 0;

		// dynamic backgrounds slides
		this.$slidesBackground = this.$slider.find('[data-slide-background]');

		// content
		this.$heading = this.$target.find('.slider__heading');
		this.$subheading = this.$target.find('.slider__subheading');
		this.$description = this.$target.find('.slider__text');
		this.$link = this.$target.find('.slider__wrapper-button');
		this.$line = this.$target.find('.post-meta__divider');

		// params
		this.sliderSpeed = this.$sliderImages.data('speed') || 800;
		this.textTransitionsEnabled = this.$sliderContent.data('transition') === 'text' || false;
		this.textTransitionsDirection = this.$sliderContent.data('transition-direction') || this.$sliderImages.data('direction');

		// dragging
		this._setDragging({target: this.$sliderImages});

		// prefetch
		this.prefetcActiveSlideTransition = this.$sliderContent.data('prefetch-active-slide-transition') || true;
	}

	run() {
		this.sliderContent = this._getSliderContent();
		this.sliderImages = this._getSliderImages();
		this.sliderThumbs = this.$sliderThumbs.length ? this._getSliderThumbs() : null;

		// connect sliders
		this.sliderImages.controller.control.push(this.sliderContent);
		this.sliderContent.controller.control.push(this.sliderImages);

		// update slider dimensions before OS animation is started
		if (this.$parent.length) {
			this._setAutoplayAnimation({
				parent: this.$parent,
				slider: this.sliiderImages,
			});

			this.$parent.one('animation/start', () => {
				this.sliderContent.update();
				this.sliderImages.update();
			});
		}

		// slider drag
		if (typeof this.drag === 'object') {
			this._emitDragEvents($.extend(this.drag, {
				slider: this.sliderImages,
			}));
		}

		// text transitions
		if (this.textTransitionsEnabled) {
			this._setSliderTextTransitions();
		}

		// thumbs
		if (this.$sliderThumbs.length) {
			this._setThumbsNavigation();
			$(this.sliderThumbs.slides).eq(this.sliderThumbs.activeIndex).addClass('swiper-slide-thumb-active');
		}

		if (this.$slidesBackground.length) {
			this._setBackgrounds({
				target: this.$slider.closest('.js-slider-background'),
				slider: this.sliderImages,
				side: this.$slider.find('.js-slider-projects-fullscreen__sidebar'),
				header: window.$pageHeader
			});

			// initial backgrounds set
			if (this.sliderImages && typeof this.sliderImages.emit === 'function') {
				this.sliderImages.emit('slideChange');
			}
		}

		if (this.$scrollBar.length) {
			this._setScrollbar({
				slider: this.sliderImages,
				scrollbar: this.$scrollBar
			});
		}

		if (this.$sliderCounterCurrent.length && this.$sliderCounterTotal.length) {
			this._setCounter({
				slider: this.sliderImages,
				elementCurrent: this.$sliderCounterCurrent,
				elementTotal: this.$sliderCounterTotal,
				zeros: this.sliderCounterZeros
			})
		}

		// prefetch active slide transition
		if (this.sliderContent && this.prefetcActiveSlideTransition && window.kinsey.theme.ajax.enabled) {
			this._prefetchActiveSlideTransition(this.sliderContent);
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$sliderImages,
			slider: this.sliderImages
		});

		this._bindEvents();
	}

	_bindEvents() {

		window.$pageHeader
			.on('menuOpenStart', () => {
				this._setExternalControls({
					slider: this.sliderImages,
					enabled: false
				});
			})
			.on('menuCloseStart', () => {
				this._setExternalControls({
					slider: this.sliderImages,
					enabled: true
				});
			});

		if (this.$parent.length) {
			this.$parent
				.on('animation/start', () => {
					this._setExternalControls({
						slider: this.sliderImages,
						enabled: false
					});
				})
				.on('animation/complete', () => {
					this._setExternalControls({
						slider: this.sliderImages,
						enabled: true
					});
				});
		}

		this._updateOnResize([
			this.sliderImages,
			this.sliderContent,
			this.sliderThumbs
		]);

		this._updateOnTransitionEnd([
			this.sliderImages,
			this.sliderContent,
			this.sliderThumbs
		]);
	}

	_getSliderContent() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderContent
		});

		return new Swiper(this.$sliderContent[0], {
			allowTouchMove: false,
			watchSlidesVisibility: true,
			speed: this.sliderSpeed,
			slidesPerView: this.$sliderContent.data('slides-per-view') || 1,
			direction: this.textTransitionsEnabled ? 'horizontal' : this.$sliderContent.data('direction') || this.$sliderImages.data('direction'),
			centeredSlides: this.$sliderContent.data('centered-slides') || false,
			autoHeight: this.$sliderContent.data('auto-height') || false,
			controller: {
				control: [],
				by: 'container'
			},
			virtualTranslate: this.textTransitionsEnabled ? true : false,
			effect: this.textTransitionsEnabled ? 'fade' : 'slide',
			fadeEffect: {
				crossFade: true //this.textTransitionsEnabled ? false : true
			},
			parallax: true,
			breakpoints
		});
	}

	_getSliderImages() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderImages
		});

		return new Swiper(this.$sliderImages[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$sliderImages.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			grabCursor: true,
			watchSlidesVisibility: true,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$sliderImages.data('autoplay-enabled') || false,
				delay: this.$sliderImages.data('autoplay-delay') || 6000,
			},
			keyboard: this.$sliderImages.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			mousewheel: this.$sliderImages.data('mousewheel-enabled') ? {
				eventsTarged: this.$target.get(0),
				eventsTarget: this.$target.get(0),
				releaseOnEdges: true,
			} : false,
			speed: this.sliderSpeed,
			direction: this.$sliderImages.data('direction') || 'horizontal',
			slidesPerView: 1,
			navigation: {
				nextEl: this.$slider.find('.js-slider__arrow-next').get(0),
				prevEl: this.$slider.find('.js-slider__arrow-prev').get(0),
			},
			lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true
      },
			controller: {
				control: [],
				by: 'container'
			},
			thumbs: {
				swiper: this.sliderThumbs
			},
			parallax: true,
			scrollbar: {
				hide: false,
				el: this.$scrollBar.get(0),
				dragClass: 'slider__scrollbar-handle'
			},
			breakpoints,
		});
	}

	_getSliderThumbs() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderThumbs
		});

		return new Swiper(this.$sliderThumbs[0], {
			speed: this.sliderSpeed,
			slidesPerView: 3,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			simulateTouch: false,
			breakpoints
		});
	}

	_setSliderTextTransitions() {
		return new SliderTextTransitions({
			slider: this.sliderContent,
			direction: this.textTransitionsDirection,
			heading: this.$heading,
			subheading: this.$subheading,
			description: this.$description,
			line: this.$line,
			link: this.$link,
			hasAnimation: this.hasAnimation
		});
	}

	_setThumbsNavigation() {
		const self = this;

		this.sliderImages.thumbs.swiper = this.sliderThumbs;

		this.sliderThumbs.slides.each(function () {
			$(this).on('click', function () {
				self.sliderImages.slideTo($(this).index());
			});
		});
	}
}

/*!========================================================================
	63. Slider Testimonials
	======================================================================!*/
class SliderTestimonials extends Slider {
	constructor({
		parent,
		scope,
		target
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
	}

	set() {
		// sliders
		this.$slider = this.$target;

		// params
		this.sliderSpeed = this.$slider.data('speed') || 800;
		this.textTransitionsEnabled = this.$target.attr('data-transition') === 'text' || false;

		// content
		this.$heading = this.$target.find('.slider__heading');
		this.$subheading = this.$target.find('.slider__subheading');
		this.$description = this.$target.find('.slider__text');

		// dots
		this.$sliderDots = this.$parent.find('.js-slider__dots');

		// arrows
		this.$arrowNext = this.$parent.find('.js-slider__arrow-next');
		this.$arrowPrev = this.$parent.find('.js-slider__arrow-prev');
	}

	run() {
		this.slider = this._getSlider();

		if (this.slider.slides.length <= 1) {
			this.slider.destroy(true, true);

			if (this.$sliderDots.length) {
				this.$sliderDots.remove();
			}

			if (this.$arrowNext.length) {
				this.$arrowNext.remove();
			}

			if (this.$arrowPrev.length) {
				this.$arrowPrev.remove();
			}

			return;
		}

		// text transitions
		if (this.textTransitionsEnabled) {
			this._setSliderTextTransitions();
		}

		// dots
		if (this.$sliderDots.length) {
			this._getSliderDots({
				slider: this.slider,
				container: this.$sliderDots
			});
		}

		// initial backgrounds set
		if (this.slider && typeof this.slider.emit === 'function') {
			this.slider.emit('slideChange');
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$slider,
			slider: this.slider
		});

		this._updateOnTransitionEnd([
			this.slider
		]);
	}

	_getSlider() {
		return new Swiper(this.$target[0], {
			simulateTouch: false,
			grabCursor: true,
			autoHeight: true,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			keyboard: this.$target.data('keyboard-enabled') ? {
				enabled: true,
				onlyInViewport: true
			} : false,
			speed: this.$target.data('speed') || 1200,
			slidesPerView: 1,
			pagination: {
				el: this.$sliderDots.get(0),
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
			navigation: {
				nextEl: this.$arrowNext.get(0),
				prevEl: this.$arrowPrev.get(0),
			},
			virtualTranslate: this.textTransitionsEnabled ? true : false,
			effect: 'fade',
			fadeEffect: {
				crossFade: this.textTransitionsEnabled ? false : true
			},
		});
	}

	_setSliderTextTransitions() {
		return new SliderTextTransitions({
			slider: this.slider,
			direction: 'vertical',
			heading: this.$heading,
			subheading: this.$subheading,
			description: this.$description,
			hasAnimation: true
		});
	}
}

/*!========================================================================
	64. Slider Images
	======================================================================!*/
class SliderImages extends Slider {	
	constructor({
		parent,
		target,
		scope,
		captions
	}) {
		super({
			target,
			scope
		});

		this.$parent = parent;
		this.$sliderCaptions = captions;
	}

	set() {
		// sliders
		this.$slider = this.$target;

		// params
		this.sliderSpeed = this.$slider.data('speed') || 800;

		// dots
		this.$sliderDots = this.$parent.find('.js-slider__dots');

		// arrows
		this.$arrowNext = this.$parent.find('.js-slider__arrow-next');
		this.$arrowPrev = this.$parent.find('.js-slider__arrow-prev');

		// underline
		this.$underline = this.$parent.find('.js-slider-images__underline');

		// scrollbar
		this.$scrollBar = this.$parent.find('.js-slider__scrollbar');

		// dragging
		this._setDragging({target: this.$target});
	}

	run() {
		this.slider = this._getSlider();
		this.sliderCaptions = this._getSliderCaptions();

		// dots
		if (this.$sliderDots.length) {
			this._getSliderDots({
				slider: this.slider,
				container: this.$sliderDots
			});
		}

		// slider drag
		if (typeof this.drag === 'object') {
			this._emitDragEvents($.extend(this.drag, {
				slider: this.slider,
			}));
		}

		// captions
		if (this.$sliderCaptions.length) {
			this._setCaptionsNavigation();

			if (this.$underline.length) {
				this._bindEvents();
			}
		}

		if (this.$parent.length) {
			this._setAutoplayAnimation({
				parent: this.$parent,
				slider: this.slider,
			});
		}

		// initial backgrounds set
		if (this.slider && typeof this.slider.emit === 'function') {
			setTimeout(() => {
				this.slider.emit('slideChange');
			}, 250);
		}

		if (this.$scrollBar.length) {
			this._setScrollbar({
				slider: this.slider,
				scrollbar: this.$scrollBar
			});
		}

		// pause autoplay when the slider is not in view
		this._pauseAutoplayOnOutOfView({
			trigger: this.$slider,
			slider: this.slider
		});

		this._updateOnTransitionEnd([
			this.slider,
			this.sliderCaptions
		]);
	}

	_bindEvents() {
		const self = this;

		// update line position on window resize
		window.$window.on('resize', debounce(() => {
			const
				currentIndex = this.slider.realIndex,
				$targetSlide = $(this.sliderCaptions.slides[currentIndex]),
				duration = this.sliderSpeed / 1000;

			setTimeout(() => {
				self._updateLinePosition($targetSlide, duration);
			}, 750);
			self._updateLinePosition($targetSlide, duration);
		}, 250));

		this.$sliderCaptions
			.on('mouseenter', '.swiper-slide', function () {
				self._updateLinePosition($(this), self.sliderSpeed / 1500);
			})
			.on('mouseleave', '.swiper-slide', function () {
				self._updateLinePosition($(self.sliderCaptions.slides).filter('.swiper-slide-active'), self.sliderSpeed / 1500);
			});
	}

	_getSlider() {
		const breakpoints = this._setBreakpoints({
			target: this.$target
		});

		return new Swiper(this.$target[0], {
			simulateTouch: this.drag ? true : false,
			touchRatio: this.$target.data('touch-ratio') || 1.5,
			touchStartPreventDefault: this.drag ? false : true,
			autoHeight: this.$target.data('auto-height'),
			speed: this.$target.data('speed') || 1200,
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadPrevNextAmount: 4,
				loadOnTransitionStart: true
			},
			slideToClickedSlide: true,
			grabCursor: true,
			observer: true,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			centeredSlides: this.$target.data('centered-slides') || false,
			slidesPerView: this.$target.data('slides-per-view') || 1,
			autoplay: {
				disableOnInteraction: false,
				enabled: this.$target.data('autoplay-enabled') || false,
				delay: this.$target.data('autoplay-delay') || 6000,
			},
			spaceBetween: this.$slider.data('space-between') || 20,
			pagination: {
				el: this.$sliderDots.get(0),
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
			navigation: {
				nextEl: this.$arrowNext.get(0),
				prevEl: this.$arrowPrev.get(0),
			},
			scrollbar: {
				hide: false,
				el: this.$scrollBar.get(0),
				dragClass: 'slider__scrollbar-handle'
			},
			touchEventsTarget: 'container',
			thumbs: {
				autoScrollOffset: 0
			},
			breakpoints,
		});
	}

	_getSliderCaptions() {
		const breakpoints = this._setBreakpoints({
			target: this.$sliderCaptions
		});

		return new Swiper(this.$sliderCaptions[0], {
			speed: this.sliderSpeed,
			centeredSlides: this.$sliderCaptions.data('centered-slides') || false,
			slidesPerView: this.$sliderCaptions.data('slides-per-view') || 1,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			simulateTouch: false,
			breakpoints
		});
	}

	_setCaptionsNavigation() {
		const self = this;

		this.slider.controller.control = this.sliderCaptions;
		this.sliderCaptions.controller.control = this.slider;

		this.sliderCaptions.slides.each(function () {
			$(this).on('click', function () {
				self.slider.slideTo($(this).index());
			});
		});

		if (this.$underline.length) {
			this.slider.on('slideChange', () => {
				const
					currentIndex = this.slider.realIndex,
					$targetSlide = $(this.sliderCaptions.slides[currentIndex]),
					duration = this.sliderSpeed / 1000;
				this._updateLinePosition($targetSlide, duration);
			});
		}
	}

	_updateLinePosition($el, duration = 1.2) {
		if (!$el || !$el.length) {

			gsap.to(this.$underline, {
				duration,
				width: 0,
				ease: 'power3.inOut',
			});
		} else {
			const
				outerOffset = this.$sliderCaptions.offset(),
				slideWidth = $el.innerWidth(),
				slidePos = $el.position(),
				slideOffset = $el.offset();

			gsap.to(this.$underline, {
				duration,
				ease: 'power3.inOut',
				width: slideWidth,
				top: slideOffset.top - outerOffset.top,
				left: slidePos.left,
			});
		}
	}
}

/*!========================================================================
	65. Section Content
	======================================================================!*/
class SectionContent extends BaseComponent {
	constructor({
		target,
		scope
	}) {
		super({
			target,
			scope
		});
	}
}

/*!========================================================================
	66. Section Grid
	======================================================================!*/
class SectionGrid extends BaseComponent {
	constructor({
		scope,
		target,
	}) {
		super({
			scope,
			target
		});
	}

	set() {
		this.$filter = this.$target.find('.js-filter');
		this.$dropdown = this.$filter.find('.js-filter__select');
		this.$grid = this.$target.filter('.js-grid').add(this.$target.find('.js-grid'));
		this.$items = this.$grid.find('.js-grid__item');
		this.refresher;
	}

	init() {
		if (this.$grid.length) {
			this._bindGridFilter();
		}
	}

	_bindGridFilter() {
		const self = this;

		this.filter = this._createFilter();
		this.grid = this._createGrid();

		if (this.$filter.length) {
			this.filter.setActiveItem(0, 0);

			this.filter.$items.on('click', function (e) {
				const
					$el = $(this),
					filterBy = $el.attr('data-filter'),
					isLink = $el.is('a');

				ScrollTrigger.refresh();

				self._updateScrollTriggerScenes({
					interval: 60,
					immediate: false
				});

				if (!isLink) {
					if (filterBy === '*') {
						setTimeout(() => {
							self.$grid.removeClass('grid_filtered');
						}, 200);
					} else {
						setTimeout(() => {
							self.$grid.addClass('grid_filtered');
						}, 200);
					}
				}

				if (isLink && window.kinsey.theme.ajax.enabled) {
					e.preventDefault();
				}

				if (self.$dropdown.length) {
					self.$dropdown.val(filterBy);
				}

				self.grid.isotopeInstance.arrange({
					filter: filterBy
				});

			});
		}

		if (this.$dropdown.length) {
			this.$dropdown.on('change', function () {
				self.filter.$items.filter(`[data-filter="${this.value}"]`).click();
			});
		}
	}

	_updateScrollTriggerScenes({
		interval = 60,
		immediate = false
	}) {
		this.refresher = setInterval(() => {
			ScrollTrigger.refresh(immediate);
		}, interval);
	}

	_createFilter() {
		return new Filter({
			target: this.$filter,
			scope: this.$scope,
			dropdown: this.$dropdown
		});
	}

	_createGrid() {
		return new Grid({
			target: this.$grid,
			scope: this.$scope,
			onArrangeComplete: () => {
				if (this.lazyImages) {
					this.lazyImages.lazyImages.update();
				}

				if (this.lazyBackgrounds) {
					this.lazyBackgrounds.lazyBackgrounds.update();
				}

				clearInterval(this.refresher);
				this.refresher = null;
			},
			onLayoutComplete: () => {
				ScrollTrigger.refresh();
			}
		});
	}
}

/*!========================================================================
	67. Section Nav Projects
	======================================================================!*/
class SectionNavProjects extends BaseComponent {
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
		this.$progressUnderline = this.$target.find('.section-nav-projects__progress-underline');
		this.$labelNext = this.$target.find('.section-nav-projects__label_next');
		this.$inner = this.$target.find('.section-nav-projects__inner').eq(0);
		this.$spacer = this.$target.find('.section-nav-projects__spacer');
		this.$labelScroll = this.$target.find('.section-nav-projects__label_scroll');
		this.$wrapper = this.$target.parent('.js-fixed-reveal-spacer');
		this.$header = this.$target.find('.section-nav-projects__header, .section-nav-projects__next-image');
		this.$heading = this.$target.find('.section-nav-projects__heading');
		this.$trigger = this.$wrapper.length ? this.$wrapper : this.$target;
		this.$link = this.$target.find('.section-nav-projects__link');
		this.url = this.$link.attr('href');
		this.backgroundSizeHeight = '2px';
		this.backgroundSizeWidthCurrent = '0%';
		this.headingColor = '';
		this.stSpacer = null;
		this.stMain = null;
		this.stLabels = null;
		this.stPrefetch = null;
		this.spacerHeight = 0;
		this.timeline = new gsap.timeline();
		this.prefetchEnabled = window.kinsey.theme.ajax.enabled && this.$target.attr('data-arts-prefetch-enabled');
		this.disabledAtBreakpoint = this.$target.data('arts-fixed-reveal-disabled-at');
		this.startAnimationOpacity = this.$target.data('arts-fixed-reveal-from-opacity') === undefined ? 1 : this.$target.data('arts-fixed-reveal-from-opacity');

		if (this.$heading.length) {
			this.headingColor = this.$heading.css('color');
		}

		if (this.$progressUnderline.length) {
			this.backgroundSizeHeight = this.$progressUnderline.css('background-size').split(' ')[1];
		}
	}

	run() {
		this._animateProgressLine();

		if (this.$spacer.length && this._isInnerWithSpacerAnimationEnabled()) {
			this._getSpacerProperties();
			this._animateInnerWithSpacer();
		}

		if (this.prefetchEnabled) {
			this._prefetchHandler();
		}

		this._bindEvents();
	}

	_bindEvents() {
		this.$header.off('click').on('click', (e) => {
			if (window.kinsey.theme.ajax.enabled) {
				e.preventDefault();

				Scroll.scrollTo({
					y: this.$trigger,
					offsetY: -this.$trigger.height()
				});
			}
		});

		window.$window
			.one('arts/barba/transition/start', () => {
				if (this.stMain) {
					this.stMain.kill();
				}
				if (this.stLabels) {
					this.stLabels.kill();
				}
				if (this.stPrefetch) {
					this.stPrefetch.kill();
				}
				this.timeline.kill();
			})
			.on(getResponsiveResizeEvent(), debounce(() => {
				if (this.stSpacer) {
					this._getSpacerProperties();
					this.stSpacer.refresh(true);
				}
				if (this.stMain) {
					this.stMain.refresh(true);
				}

				if (this.stLabels) {
					this.stLabels.refresh(true);
				}
			}, 250));
	}

	_getSpacerProperties() {
		this.spacerHeight = this.$spacer.height();
	}

	_isInnerWithSpacerAnimationEnabled() {
		return this.$spacer.is(':visible') && !window.Modernizr.mq(`(${this.disabledAtBreakpoint})`);
	}

	_animateInnerWithSpacer() {
		const tl = new gsap.timeline();

		tl.fromTo(this.$inner, {
			y: () => `-${this.spacerHeight}`,
			autoAlpha: () => this.startAnimationOpacity,
		}, {
			y: () => `${this.spacerHeight}`,
			ease: 'none',
			autoAlpha: 1
		});

		this.stSpacer = ScrollTrigger.create({
			animation: tl,
			start: () => 'top bottom',
			end: () => 'bottom bottom',
			invalidateOnRefresh: true,
			scrub: true,
			trigger: this.$trigger,
		});
	}

	_animateProgressLine() {
		this.stLabels;
		this.stMain = ScrollTrigger.create({
			animation: this.timeline,
			trigger: this.$trigger,
			start: () => 'top+=50 center',
			end: () => 'bottom-=50 bottom',
			invalidateOnRefresh: true,
			scrub: true,
			onLeave: () => {
				if (this.stLabels) {
					this.stLabels.kill();
					this.stMain.kill();
					this.timeline.kill();
					this.timeline.progress(1);

					Scroll.lock(true);
					Scroll.stop();

					if (this.$labelNext.length) {
						gsap.to(this.$labelNext, {
							autoAlpha: 0,
							y: '-100%',
							duration: 0.3
						});
					}

					if (this.$labelScroll.length) {
						gsap.to(this.$labelScroll, {
							autoAlpha: 0,
							y: '-100%',
							duration: 0.3
						});
					}

					gsap.fromTo(this.$progressUnderline, {
						backgroundPosition: '100% 100%',
					}, {
						ease: 'expo.inOut',
						duration: 0.2,
						delay: 0.3,
						backgroundSize: `0% ${this.backgroundSizeHeight}`,
						onComplete: () => {
							this.$header.addClass('pointer-events-none').off('click');

							this.$link.get(0).click();
						}
					});
				}
			}
		});

		this.timeline.to(this.$progressUnderline, {
			backgroundSize: `100% ${this.backgroundSizeHeight}`,
			ease: 'none',
			duration: 1
		});

		if (this.$labelNext.length && this.$labelScroll.length) {
			this.stLabels = ScrollTrigger.create({
				trigger: this.$trigger,
				start: () => 'top+=50 center',
				end: () => 'bottom-=20 bottom',
				invalidateOnRefresh: true,
				onEnter: () => {
					gsap.to(this.$labelNext, {
						autoAlpha: 0,
						y: '-100%',
						duration: 0.3,
					});

					gsap.fromTo(this.$labelScroll, {
						autoAlpha: 0,
						y: '100%',
						clearProps: 'color'
					}, {
						autoAlpha: 1,
						y: '0%',
						duration: 0.3,
						color: this.headingColor
					});
				},
				onLeaveBack: () => {
					gsap.fromTo(this.$labelNext, {
						autoAlpha: 0,
						y: '100%'
					}, {
						autoAlpha: 1,
						y: '0%',
						duration: 0.3
					});

					gsap.to(this.$labelScroll, {
						autoAlpha: 0,
						y: '-100%',
						duration: 0.3,
						clearProps: 'color'
					});
				}
			});
		}
	}

	_prefetchHandler() {
		this.stPrefetch = ScrollTrigger.create({
			trigger: window.$body,
			start: 'top+=1 top',
			once: true,
			onEnter: () => {
				barba.prefetch(this.url);
			}
		});
	}
}

/*!========================================================================
	68. Section Scroll Theme Switch
	======================================================================!*/
class SectionScrollThemeSwitch extends BaseComponent {
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
		this.defaultTheme = this.$target.attr('data-arts-default-theme');
		this.defaultColor = this.$target.attr('data-arts-theme-text');
		this.scrollTheme = this.$target.attr('data-arts-scroll-theme');
		this.scrollColor = this.$target.attr('data-arts-scroll-theme-text');
		this.offset = parseFloat(this.$target.attr('data-arts-scroll-offset')) || 0;
		this.triggerHook = this.$target.attr('data-arts-scroll-trigger-hook') || 'bottom';
	}

	run() {
		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.$target,
			scrub: true,
			once: false,
			start: () => `top+=${this.offset} ${this.triggerHook}`,
			onToggle: ({
				isActive
			}) => {
				if (isActive) {
					this.$target
						.removeClass(this.defaultTheme)
						.addClass(this.scrollTheme)
						.attr('data-arts-theme-text', this.scrollColor);
				} else {
					this.$target
						.removeClass(this.scrollTheme)
						.addClass(this.defaultTheme)
						.attr('data-arts-theme-text', this.defaultColor);
				}
			}
		});
	}
}

/*!========================================================================
	69. Section Masthead
	======================================================================!*/
class SectionMasthead extends BaseComponent {
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
		this.$inner = this.$target.find('.section-masthead__inner');
		this.$maskReveal = this.$target.find('.mask-reveal');
		this.$heading = this.$target.find('.section-masthead__heading');
		this.$subheading = this.$target.find('.section-masthead__subheading');
		this.$background = this.$target.find('.section__bg');
		this.$divider = this.$target.find('.section-masthead__meta-divider');
		this.$button = this.$target.find('.section-masthead__button');

		if (this.$target.hasClass('section-masthead_fixed')) {
			this._fixMasthead();
		}
	}

	animateIn() {
		const
			$heading = this.$heading.not('.js-transition-animated'),
			$maskReveal = this.$maskReveal.not('.js-transition-animated'),
			$background = this.$background.not('.js-transition-animated');

		this.timeline
			.animateText($heading, {
				duration: 1.2,
				stagger: {
					amount: 0.3,
					from: 'left'
				}
			})
			.add([
				gsap.effects.animateText(this.$subheading, {
					// duration: 0.6,
				}),
				gsap.effects.animateHeadline(this.$divider, {
					// duration: 0.6,
				})
			], $heading.length ? '-=0.8' : '0')
			.add([
				gsap.effects.animateMask($maskReveal, {
					direction: 'down'
				}),
				gsap.effects.animateScale($background, {
					direction: 'down'
				})
			], '-=1.2');

	}

	animateOut() {
		this.timelineOut.add([
			gsap.effects.hideText(this.$target, {
				stagger: 0
			}),
			gsap.effects.hideHeadline(this.$divider),
			gsap.effects.hideMask(this.$maskReveal),
			gsap.effects.hideScale(this.$background)
		], '0');

	}

	_getFixedScrollingDistance() {
		if (typeof window.SB !== 'undefined') {
			return window.SB.containerEl.scrollHeight;
		} else {
			return Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			);
		}
	}

	_fixMasthead() {
		if (typeof window.SB === 'undefined') {

			ScrollTrigger.create({
				pin: true,
				pinType: 'fixed',
				pinSpacing: false,
				invalidateOnRefresh: true,
				anticipatePin: 1,
				trigger: this.$target,
				scrub: true,
				start: () => 'top top',
				end: () => this._getFixedScrollingDistance(),
			});
		}

		ScrollTrigger.create({
			animation: gsap.fromTo(this.$inner, {
				autoAlpha: 1,
				y: 0
			}, {
				autoAlpha: 0,
				y: '-10%'
			}),
			start: 'bottom bottom',
			end: 'bottom+=30% bottom',
			scrub: true,
			trigger: this.$inner,
			invalidateOnRefresh: true
		});
	}
}

/*!========================================================================
	70. Section Slider Images
	======================================================================!*/
class SectionSliderImages extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider-images');
		this.$sliderImages = this.$target.find('.js-slider-images__slider');
		this.$sliderCaptions = this.$target.find('.js-slider-images__captions');
	}

	init() {
		this.slider = new SliderImages({
			parent: this.$target,
			target: this.$sliderImages,
			captions: this.$sliderCaptions
		});
	}
}

/*!========================================================================
	71. Section Slider Projects Fullscreen
	======================================================================!*/
class SectionSliderProjectsFullscreen extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider-projects-fullscreen');

		this.textTransitionsEnabled = this.$target.find('.js-slider-projects-fullscreen__content').attr('data-transition') === 'text' || false;

		this.$firstSlide = this.textTransitionsEnabled ? this.$slider.find('.swiper-slide').eq(0) : this.$slider.find('.swiper-slide');
		this.$firstHeading = this.$firstSlide.find('.slider__heading');
		this.$firstSubheading = this.$firstSlide.find('.slider__subheading');
		this.$firstDescription = this.$firstSlide.find('.slider__text');
		this.$firstLine = this.$firstSlide.find('.post-meta__divider');
		this.$firstLink = this.$firstSlide.find('.slider__wrapper-button');
	}

	init() {
		this.slider = new SliderProjectsFullscreen({
			parent: this.$target,
			target: this.$slider,
			hasAnimation: this.hasAnimationScene()
		});
	}

	animateIn() {

		this.timeline
			.animateText(this.$firstHeading, {
				duration: 1.2
			}, '0')
			.add([
				gsap.effects.animateText(this.$firstSubheading, {
					autoAlpha: 1,
					duration: 1.2
				}),
				gsap.effects.animateHeadline(this.$firstLine)
			], '-=0.8')
			.animateText(this.$firstDescription, {
				duration: 1.2,
				autoAlpha: 1,
			}, '-=0.8')
			.animateJump(this.$firstLink, '-=1.0');
	}

	animateOut() {
		const
			$visibleSlide = this.$target.find('.swiper-slide-visible'),
			$headline = $visibleSlide.find('.post-meta__divider'),
			$link = $visibleSlide.find('.slider__wrapper-button');

		this.timelineOut.add([
			gsap.effects.hideText($visibleSlide),
			gsap.effects.hideHeadline($headline),
			gsap.effects.hideJump($link),
		], '0');
	}
}

/*!========================================================================
	72. Section Testimonials
	======================================================================!*/
class SectionTestimonials extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider');
		this.textTransitionsEnabled = this.$target.find('.js-slider-projects-fullscreen__content').attr('data-transition') === 'text' || false;
		this.$firstSlide = this.textTransitionsEnabled ? this.$slider.find('.swiper-slide').eq(0) : this.$slider.find('.swiper-slide');
	}

	init() {
		this.slider = new SliderTestimonials({
			parent: this.$target,
			target: this.$slider
		});
	}
}

/*!========================================================================
	73. Section Slider Projects
	======================================================================!*/
class SectionSliderProjects extends BaseComponent {
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
		this.$slider = this.$target.find('.js-slider-projects__slider');
		this.$sliderHeader = this.$target.find('.section-slider-projects__header');
	}

	init() {
		this.slider = new SliderProjects({
			parent: this.$target,
			target: this.$slider,
			$header: this.$sliderHeader.filter('.js-slider-projects__header'),
			hasAnimation: this.hasAnimationScene()
		});
	}

	animateOut() {
		const
			$visibleSlide = this.$target.find('.swiper-slide-visible'),
			$headline = $visibleSlide.find('.post-meta__divider'),
			$link = $visibleSlide.find('.slider__wrapper-button');

		this.timelineOut.add([
			gsap.effects.hideText($visibleSlide),
			gsap.effects.hideHeadline($headline),
			gsap.effects.hideJump($link),
		], '0');
	}
}


})(jQuery);
