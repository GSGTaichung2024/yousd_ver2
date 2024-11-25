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
		}, 1200);
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
