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
