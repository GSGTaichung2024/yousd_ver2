class SliderTextTransitions {
	constructor({
		slider,
		direction,
		staggerHeadings = 0.2,
		staggerTexts = 0.2,
		heading,
		subheading,
		description,
		link,
		line,
		hasAnimation = false
	}) {
		// slider
		this.slider = slider;
		this.$slides = $(this.slider.slides);
		this.hasAnimation = hasAnimation;
		this.$firstSlide = hasAnimation ? $({}) : this.$slides.eq(0); // don't exclude 1st slide from animation

		// params
		this.offset;
		this.direction = direction || this.slider.params.direction;
		this.speed = parseFloat(this.slider.params.speed / 1000);

		// elements
		this.$heading = heading;
		this.$subheading = subheading;
		this.$description = description;
		this.$link = link;
		this.$line = line;

		// animation
		this.timeline = new gsap.timeline();
		this.hideTimeline = new gsap.timeline();
		this.ease = 'expo.out';
		this.staggerHeadings = staggerHeadings;
		this.staggerTexts = staggerTexts;
		this.animationDirections = this._getAnimationDirections();
		this._initialSet();
		this._bindEvents();
	}

	_bindEvents() {
		this.slider.on('slideChange', () => {
			if (this.slider.realIndex > this.slider.previousIndex) {
				this._slideChangeTransition({
					direction: 'next'
				});
			}

			if (this.slider.realIndex < this.slider.previousIndex) {
				this._slideChangeTransition({
					direction: 'prev'
				});
			}
		});
	}

	_initialSet() {
		const directions = this._getSlideAnimationDirections({
			direction: 'next'
		});

		if (this.$subheading && this.$subheading.length) {
			gsap.effects.setWords(this.$subheading.not(this.$firstSlide.find(this.$subheading)), {
				x: 0, //directions.in.x / 4,
				y: (directions.in.y || directions.in.x),
				autoAlpha: 0,
			});
		}

		if (this.$heading && this.$heading.length) {
			gsap.effects.setChars(this.$heading.not(this.$firstSlide.find(this.$heading)), {
				x: directions.in.x,
				y: directions.in.y,
			});
		}

		if (this.$description && this.$description.length) {
			gsap.effects.setLines(this.$description.not(this.$firstSlide.find(this.$description)), {
				autoAlpha: 1,
				y: '100%',
			});
		}

		if (this.$link && this.$link.length) {
			gsap.set(this.$link.not(this.$firstSlide.find(this.$link)), {
				y: (this.animationDirections.offset.y.next.in || this.animationDirections.offset.x.next.in),
				autoAlpha: 0,
			});
		}

		if (this.$line && this.$line.length) {
			gsap.set(this.$line.not(this.$firstSlide.find(this.$line)), {
				scaleX: 0
			});
		}
	}

	_slideChangeTransition({
		direction = 'next'
	}) {
		const
			self = this,
			directions = this._getSlideAnimationDirections({
				direction
			}),
			$prevSlide = this.$slides.eq(this.slider.previousIndex),
			$prevHeading = $prevSlide.find(this.$heading),
			$prevSubheading = $prevSlide.find(this.$subheading),
			$prevDescription = $prevSlide.find(this.$description),
			$prevLink = $prevSlide.find(this.$link),
			$prevLine = $prevSlide.find(this.$line),
			$activeSlide = this.$slides.eq(this.slider.realIndex),
			$activeHeading = $activeSlide.find(this.$heading),
			$activeSubheading = $activeSlide.find(this.$subheading),
			$activeDescription = $activeSlide.find(this.$description),
			$activeLink = $activeSlide.find(this.$link),
			$activeLine = $activeSlide.find(this.$line);

		this.timeline.clear();

		/**
		 * Animate out previous elements
		 * and set current elements
		 */
		if (this.$subheading && this.$subheading.length) {
			self.timeline.add([
				gsap.effects.hideWords($prevSubheading, {
					duration: self.speed / 2,
					autoAlpha: 1,
					x: 0, //directions.out.x / 4,
					y: (directions.out.y || directions.out.x),
					stagger: distributeByPosition({
						amount: self.staggerHeadings,
						from: directions.out.from
					}),
					ease: self.ease
				}),
				gsap.effects.setWords(this.$subheading.not($prevSubheading), {
					autoAlpha: 1,
					x: 0,
					y: (directions.in.y || directions.in.x),
				})
			], '0')
		}

		if (this.$heading && this.$heading.length) {
			self.timeline.add([
				gsap.effects.hideChars($prevHeading, {
					duration: self.speed,
					autoAlpha: 1,
					x: directions.out.x,
					y: directions.out.y,
					stagger: distributeByPosition({
						amount: self.staggerHeadings,
						from: directions.out.from
					}),
					ease: self.ease
				}),
				gsap.effects.setChars(this.$heading.not($prevHeading), {
					autoAlpha: 1,
					x: directions.in.x,
					y: directions.in.y,
				})
			], '0');
		}

		if (this.$description && this.$description.length) {
			self.timeline.add([
				gsap.effects.hideLines($prevDescription, {
					duration: self.speed,
					y: direction === 'next' ? '-100%' : '100%',
					stagger: distributeByPosition({
						from: direction === 'next' ? 'start' : 'end',
						amount: self.staggerTexts
					}),
					ease: self.ease,
				}),
				gsap.effects.setLines(this.$description.not($prevDescription), {
					y: direction === 'next' ? '100%' : '-100%',
				}),
			], '0')
		}

		if (this.$link && this.$link.length) {
			self.timeline.add([
				gsap.to($prevLink, {
					duration: self.speed,
					y: (directions.out.y || directions.out.x),
					autoAlpha: 0,
					ease: self.ease
				}),
				gsap.set(this.$link.not($prevLink), {
					y: (directions.in.y || directions.in.x),
					autoAlpha: 0
				})
			], '0');
		}

		if (this.$line && this.$line.length) {
			self.timeline.add([
				gsap.to($prevLine, {
					duration: self.speed,
					scaleX: 0,
					transformOrigin: direction === 'next' ? 'right center' : 'left center',
					ease: self.ease,
				}),
				gsap.set(this.$line.not($prevLine), {
					scaleX: 0
				})
			], '0');
		}

		/**
		 * All current elements are set
		 */
		self.timeline.addLabel('elementsSet');

		/**
		 * Animate in current elements
		 */
		if ($activeSubheading.length) {
			self.timeline.animateWords($activeSubheading, {
				autoAlpha: 1,
				duration: self.speed,
				stagger: distributeByPosition({
					amount: self.staggerHeadings,
					from: directions.in.from,
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeHeading.length) {
			self.timeline.animateChars($activeHeading, {
				duration: self.speed,
				stagger: distributeByPosition({
					amount: self.staggerHeadings,
					from: directions.in.from,
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeDescription.length) {
			self.timeline.animateLines($activeDescription, {
				duration: self.speed,
				autoAlpha: 1,
				stagger: distributeByPosition({
					amount: self.staggerTexts,
					from: direction === 'next' ? 'start' : 'end',
				}),
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeLink.length) {
			self.timeline.to($activeLink, {
				duration: self.speed,
				y: '0%',
				autoAlpha: 1,
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		if ($activeLine.length) {
			self.timeline.to($activeLine, {
				duration: self.speed,
				scaleX: 1,
				transformOrigin: direction === 'next' ? 'left center' : 'right center',
				ease: self.ease,
			}, `elementsSet-=${this.speed / 2}`);
		}

		this.timeline.totalDuration(this.speed * 1.5);

	}

	_getSlideAnimationDirections({
		direction = 'next'
	}) {
		const
			directions = {
				in: {
					x: 0,
					y: 0,
					from: 'start'
				},
				out: {
					x: 0,
					y: 0,
					from: 'start'
				},
			};
		if (direction === 'next') {
			// next in
			directions.in.x = this.animationDirections.offset.x.next.in;
			directions.in.y = this.animationDirections.offset.y.next.in;
			directions.in.from = this.animationDirections.from.next.in;

			// next out
			directions.out.x = this.animationDirections.offset.x.next.out;
			directions.out.y = this.animationDirections.offset.y.next.out;
			directions.out.from = this.animationDirections.from.next.out;
		}

		if (direction === 'prev') {
			// prev in
			directions.in.x = this.animationDirections.offset.x.prev.in;
			directions.in.y = this.animationDirections.offset.y.prev.in;
			directions.in.from = this.animationDirections.from.prev.in;

			// prev out
			directions.out.x = this.animationDirections.offset.x.prev.out;
			directions.out.y = this.animationDirections.offset.y.prev.out;
			directions.out.from = this.animationDirections.from.prev.out;
		}

		return directions;
	}

	_getAnimationDirections() {
		const textAlign = this.$heading ? this.$heading.css('text-align') : 'left';

		const directions = {
			offset: {
				x: {
					next: {
						in: 0,
						out: 0
					},
					prev: {
						in: 0,
						out: 0
					},
				},
				y: {
					next: {
						in: 0,
						out: 0
					},
					prev: {
						in: 0,
						out: 0
					},
				},
			},
			from: {
				next: {
					in: 'start',
					out: 'start'
				},
				prev: {
					in: 'end',
					out: 'end'
				},
			}
		};

		switch (textAlign) {
			default: // left
				// text align left & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = '104%';
					directions.offset.x.next.out = '-104%';
					directions.offset.x.prev.in = '-104%';
					directions.offset.x.prev.out = '104%';

					directions.from.next.in = 'start';
					directions.from.next.out = 'start';
					directions.from.prev.in = 'end';
					directions.from.prev.out = 'end';
				}
				// text align left & slider vertical
				if (this.direction === 'vertical') {
					directions.offset.y.next.in = '100%';
					directions.offset.y.next.out = '-100%';
					directions.offset.y.prev.in = '-100%';
					directions.offset.y.prev.out = '100%';

					directions.from.next.in = 'end';
					directions.from.next.out = 'start';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'end';
				}
				break;
			case 'center':
				// text align center & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = '-104%';
					directions.offset.x.next.out = '104%';
					directions.offset.x.prev.in = '104%';
					directions.offset.x.prev.out = '-104%';

					directions.from.next.in = 'end';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'start';
				}
				// text align left & slider vertical
				if (this.direction === 'vertical') {
					directions.offset.y.next.in = '100%';
					directions.offset.y.next.out = '-100%';
					directions.offset.y.prev.in = '-100%';
					directions.offset.y.prev.out = '100%';

					directions.from.next.in = 'center';
					directions.from.next.out = 'center';
					directions.from.prev.in = 'center';
					directions.from.prev.out = 'center';
				}
				break;
			case 'right':
				// text align right & slider horizontal
				if (this.direction === 'horizontal') {
					directions.offset.x.next.in = '-104%';
					directions.offset.x.next.out = '104%';
					directions.offset.x.prev.in = '104%';
					directions.offset.x.prev.out = '-104%';

					directions.from.next.in = 'end';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'start';
					directions.from.prev.out = 'start';
				}
				// text align right & slider vertical
				if (this.direction === 'vertical') {

					directions.offset.y.next.in = '-100%';
					directions.offset.y.next.out = '100%';
					directions.offset.y.prev.in = '100%';
					directions.offset.y.prev.out = '-100%';

					directions.from.next.in = 'start';
					directions.from.next.out = 'end';
					directions.from.prev.in = 'end';
					directions.from.prev.out = 'start';
				}
				break;
		}

		return directions;
	}

}
