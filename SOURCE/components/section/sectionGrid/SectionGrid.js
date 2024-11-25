class SectionGrid extends BaseComponent {
	constructor({
		scope,
		target,
	}) {
		super({
			scope,
			target
		});
	}

	set() {
		this.$filter = this.$target.find('.js-filter');
		this.$dropdown = this.$filter.find('.js-filter__select');
		this.$grid = this.$target.filter('.js-grid').add(this.$target.find('.js-grid'));
		this.$items = this.$grid.find('.js-grid__item');
		this.refresher;
	}

	init() {
		if (this.$grid.length) {
			this._bindGridFilter();
		}
	}

	_bindGridFilter() {
		const self = this;

		this.filter = this._createFilter();
		this.grid = this._createGrid();

		if (this.$filter.length) {
			this.filter.setActiveItem(0, 0);

			this.filter.$items.on('click', function (e) {
				const
					$el = $(this),
					filterBy = $el.attr('data-filter'),
					isLink = $el.is('a');

				ScrollTrigger.refresh();

				self._updateScrollTriggerScenes({
					interval: 60,
					immediate: false
				});

				if (!isLink) {
					if (filterBy === '*') {
						setTimeout(() => {
							self.$grid.removeClass('grid_filtered');
						}, 200);
					} else {
						setTimeout(() => {
							self.$grid.addClass('grid_filtered');
						}, 200);
					}
				}

				if (isLink && window.kinsey.theme.ajax.enabled) {
					e.preventDefault();
				}

				if (self.$dropdown.length) {
					self.$dropdown.val(filterBy);
				}

				self.grid.isotopeInstance.arrange({
					filter: filterBy
				});

			});
		}

		if (this.$dropdown.length) {
			this.$dropdown.on('change', function () {
				self.filter.$items.filter(`[data-filter="${this.value}"]`).click();
			});
		}
	}

	_updateScrollTriggerScenes({
		interval = 60,
		immediate = false
	}) {
		this.refresher = setInterval(() => {
			ScrollTrigger.refresh(immediate);
		}, interval);
	}

	_createFilter() {
		return new Filter({
			target: this.$filter,
			scope: this.$scope,
			dropdown: this.$dropdown
		});
	}

	_createGrid() {
		return new Grid({
			target: this.$grid,
			scope: this.$scope,
			onArrangeComplete: () => {
				if (this.lazyImages) {
					this.lazyImages.lazyImages.update();
				}

				if (this.lazyBackgrounds) {
					this.lazyBackgrounds.lazyBackgrounds.update();
				}

				clearInterval(this.refresher);
				this.refresher = null;
			},
			onLayoutComplete: () => {
				ScrollTrigger.refresh();
			}
		});
	}
}
