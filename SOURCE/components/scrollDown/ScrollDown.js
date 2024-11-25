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
