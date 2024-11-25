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
