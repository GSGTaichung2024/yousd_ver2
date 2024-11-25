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
