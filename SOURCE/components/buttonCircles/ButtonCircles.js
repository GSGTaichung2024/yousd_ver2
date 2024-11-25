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
