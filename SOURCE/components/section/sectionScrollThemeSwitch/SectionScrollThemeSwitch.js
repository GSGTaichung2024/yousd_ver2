class SectionScrollThemeSwitch extends BaseComponent {
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
		this.defaultTheme = this.$target.attr('data-arts-default-theme');
		this.defaultColor = this.$target.attr('data-arts-theme-text');
		this.scrollTheme = this.$target.attr('data-arts-scroll-theme');
		this.scrollColor = this.$target.attr('data-arts-scroll-theme-text');
		this.offset = parseFloat(this.$target.attr('data-arts-scroll-offset')) || 0;
		this.triggerHook = this.$target.attr('data-arts-scroll-trigger-hook') || 'bottom';
	}

	run() {
		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.$target,
			scrub: true,
			once: false,
			start: () => `top+=${this.offset} ${this.triggerHook}`,
			onToggle: ({
				isActive
			}) => {
				if (isActive) {
					this.$target
						.removeClass(this.defaultTheme)
						.addClass(this.scrollTheme)
						.attr('data-arts-theme-text', this.scrollColor);
				} else {
					this.$target
						.removeClass(this.scrollTheme)
						.addClass(this.defaultTheme)
						.attr('data-arts-theme-text', this.defaultColor);
				}
			}
		});
	}
}
