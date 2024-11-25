const PJAXTransitionAutoScrollNext = {
	name: 'autoScrollNext',

	custom: ({
		trigger
	}) => {
		return $(trigger).attr('data-pjax-link') === 'autoScrollNext';
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			const
				$trigger = $(data.trigger),
				$navContainer = $trigger.closest('.section'),
				$image = $navContainer.find('.js-transition-img'),
				$heading = $navContainer.find('.js-transition-heading');

			PJAXSetBodyBackground(data)
				.then(() => {
					return Promise.all([
						PJAXCloneImage($image),
						PJAXCloneHeading($heading)
					]);
				})
				.then(() => {
					return Promise.all([
						PJAXSetCurrentContainer(data, true, true),
						PJAXSetNextContainer(data, true, true)
					]);
				})
				.then(() => resolve(true));
		});
	},

	enter: (data) => {
		return new Promise((resolve) => {
			PJAXInitNewPage(data).then(() => resolve(true));
		});
	},

	afterEnter: (data) => {
		return new Promise((resolve) => {
			Promise.all([
					PJAXAnimateClonedHeading(data),
					PJAXAnimateClonedImage(data),
					PJAXAnimateCurtain(data),
				])
				.then(() => PJAXClearContainer(data))
				.then(() => resolve(true))
		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}
