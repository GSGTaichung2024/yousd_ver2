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
