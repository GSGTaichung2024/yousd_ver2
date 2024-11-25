class Grid extends BaseComponent {
	constructor({
		target,
		scope,
		onArrangeComplete,
		onLayoutComplete
	}) {
		super({
			target,
			scope
		});
		this.onArrangeComplete = onArrangeComplete;
		this.onLayoutComplete = onLayoutComplete;
		this.refreshGrid = debounce(() => {
			if (typeof window.SB !== 'undefined') {
				window.SB.update();
			}

			if (this.isotopeInstance && typeof this.isotopeInstance.layout === 'function') {
				this.isotopeInstance.layout();
			}
		}, 250);
	}

	set() {
		this.equalHeights = this.$target.hasClass('js-grid-equal-heights');
	}

	run() {

		this.isotopeInstance = new Isotope(this.$target.get(0), {
			itemSelector: '.js-grid__item',
			columnWidth: '.js-grid__sizer',
			percentPosition: true,
			horizontalOrder: true,
		});

		if (this.equalHeights) {
			this._equalizeColumnsHeight();
		}

		this._bindEvents();
		ScrollTrigger.refresh();

		setTimeout(() => {
			this.isotopeInstance.layout();
			ScrollTrigger.refresh();
		}, 200);
	}

	_bindEvents() {
		if (typeof this.onArrangeComplete === 'function') {
			this.isotopeInstance.on('arrangeComplete', () => {
				this.onArrangeComplete();

				if (this.equalHeights) {
					this._equalizeColumnsHeight();
				} else {
					setTimeout(() => {
						this.isotopeInstance.layout();
						ScrollTrigger.refresh();
					}, 200);
				}
			});
		}

		if (typeof this.onLayoutComplete === 'function') {
			this.isotopeInstance.on('layoutComplete', () => {
				this.onLayoutComplete();
			});
		}

		if (this.equalHeights) {
			window.$window.on(getResponsiveResizeEvent(), debounce(() => {
				this._equalizeColumnsHeight();
			}, 250));
		}

		window.$window.one('arts/barba/transition/end', () => {
			this.isotopeInstance.layout();
		});

		const self = this;
		const $animatedElements = this.$target.find('[data-arts-os-animation]');

		if ($animatedElements.length) {
			$animatedElements.each(function () {
				$(this).one('animation/start', self.refreshGrid.bind(self));
			});
		}
	}

	_equalizeColumnsHeight() {
		this.containerWidth = this.$target.innerWidth();
		this.$items = this.$target.find('.js-grid__item');
		this.$sizer = this.$target.find('.js-grid__sizer');
		this.sizerWidth = this.$sizer.innerWidth();
		this.itemsAmount = this.$items.length;
		this.columnsAmount = Math.round(this.containerWidth / this.sizerWidth);
		this.rowsAmount = this.itemsAmount / this.columnsAmount;

		let offset = 0;

		gsap.set(this.$sizer, {
			clearProps: 'height'
		});

		gsap.set(this.$items, {
			clearProps: 'height',
			onComplete: () => {
				this.isotopeInstance.layout();
			}
		});

		if (this.columnsAmount > 1) {

			for (let row = 0; row < this.itemsAmount; row += this.columnsAmount) {

				let maxHeight = 0;
				let $currentRowItems = [];

				for (let index = row; index < row + this.columnsAmount; index++) {

					const
						targetIndex = index + offset,
						$currentItem = this.$items.eq(targetIndex),
						currentItemHeight = $currentItem.innerHeight();

					if (currentItemHeight > maxHeight) {
						maxHeight = currentItemHeight;
					}

					$currentRowItems.push($currentItem);
				}

				gsap.to($currentRowItems, {
					duration: 0.2,
					height: maxHeight,
					overwrite: true,
					onComplete: () => {
						this.isotopeInstance.layout();
					}
				});
			}
		}
	}
}
