class Filter {
	constructor({
		scope,
		target
	}) {
		this.$target = target;
		this.$scope = scope;
		this.itemClass = '.js-filter__item';
		this.itemActive = 'filter__item_active';
		this.itemActiveClass = '.filter__item_active';
		this.underlineClass = '.js-filter__underline';
		this.$items = this.$target.find(this.itemClass);
		this.$line = this.$target.find($(this.underlineClass));

		this.bindEvents();
	}

	bindEvents() {
		const self = this;

		this.$scope
			.on('mouseenter', this.itemClass, function () {
				self.updateLinePosition($(this));
			})
			.on('mouseleave', this.itemClass, function () {
				self.updateLinePosition(self.$items.filter(self.itemActiveClass))
			})
			.on('click', this.itemClass, function () {
				const $el = $(this);

				self.$items.removeClass(self.itemActive);
				$el.addClass(self.itemActive);
				self.updateLinePosition($el);
			});

		// update line position on window resize
		window.$window.on('resize', debounce(() => {
			setTimeout(() => {
				self.updateLinePosition(self.$items.filter(self.itemActiveClass));
			}, 750);
			self.updateLinePosition(self.$items.filter(self.itemActiveClass));
		}, 250));
	}

	updateLinePosition($el, duration = 0.5) {
		if (!this.$line.length) {
			return false;
		}

		if (!$el || !$el.length) {

			gsap.to(this.$line, {
				duration: 0.6,
				width: 0,
				ease: 'expo.out'
			});
		} else {
			const
				$col = $el.find('.filter__item-inner'),
				$label = $el.find('.filter__item-label'),
				outer = {
					offset: this.$target.offset()
				},
				label = {
					width: $label.innerWidth(),
					position: $label.position(),
					offset: $label.offset()
				},
				col = {
					position: $col.position()
				};

			gsap.to(this.$line, {
				duration,
				ease: 'expo.inOut',
				width: label.width,
				y: label.offset.top - outer.offset.top,
				x: label.position.left + col.position.left,
			});
		}
	}

	setActiveItem(index, duration = 0.5) {
		const $el = this.$items.eq(index);

		if (!$el.length) {
			return false;
		}

		this.$items.removeClass(this.itemActive);
		$el.addClass(this.itemActive);
		this.updateLinePosition($el, duration);
	}
}
