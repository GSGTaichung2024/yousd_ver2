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
