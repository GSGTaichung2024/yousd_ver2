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
