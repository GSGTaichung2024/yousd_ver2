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
