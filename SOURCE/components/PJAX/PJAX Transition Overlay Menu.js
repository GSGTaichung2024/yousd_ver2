const PJAXTransitionOverlayMenu = {
	name: 'overlayMenu',

	custom: ({
		trigger
	}) => {
		const $trigger = $(trigger);
		return window.kinsey.theme.header.isOverlayOpened() || ($trigger.attr('href') !== '#' && $trigger.attr('data-pjax-link') === 'overlayMenu');
	},

	before: (data) => {
		return new Promise((resolve) => {
			PJAXStartLoading(data).then(() => resolve(true));
		});
	},

	beforeEnter: (data) => {
		return new Promise((resolve) => {
			PJAXSetNextContainer(data)
				.then(() => PJAXAnimateOverlayMenu(data))
				.then(() => PJAXSetCurrentContainer(data, false, false))
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
			PJAXClearContainer(data).then(() => resolve(true))
		});
	},

	after: (data) => {
		return new Promise((resolve) => {
			PJAXFinishLoading(data).then(() => resolve(true));
		});
	}
}
