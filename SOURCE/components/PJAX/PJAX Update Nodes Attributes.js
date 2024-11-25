function PJAXUpdateNodesAttributes(data) {
	return new Promise((resolve) => {
		const
			$nextDOM = $($.parseHTML(data.next.html)),
			nodesToUpdate = [
				'#page-header',
				'#page-header .menu li',
				'#page-header .menu-overlay li',
				'#page-header .header__wrapper-overlay-menu',
				'#page-header .mask-reveal__layer-1',
				'#page-header .mask-reveal__layer-2',
				'#page-header .header__menu-column',
				'#page-header .header__slider-column',
				'#page-footer',
				window.kinsey.theme.ajax.updateNodesAttributes
			]; // selectors of elements that needed to update

		$.each(nodesToUpdate, function () {
			let
				$item = $(this),
				$nextItem = $nextDOM.find(this);

			// different type of menu (overlay) found on the next page
			if (this === '#page-header .menu li' && !$nextItem.length) {
				$nextItem = $nextDOM.find('#page-header .menu-overlay li');
			}

			// different type of menu (classic) found on the next page
			if (this === '#page-header .menu-overlay li' && !$nextItem.length) {
				$nextItem = $nextDOM.find('#page-header .menu li');

			}

			// save menu position classes
			if (this === '#page-header') {
				if ($item.hasClass('header_menu-left')) {
					$nextItem.addClass('header_menu-left');
				}

				if ($item.hasClass('header_menu-split-center')) {
					$nextItem.addClass('header_menu-split-center');
				}

				if ($item.hasClass('header_menu-right')) {
					$nextItem.addClass('header_menu-right');
				}
			}

			// sync attributes if element exist in the new container
			if ($nextItem.length) {
				syncAttributes($nextItem, $item);
			}
		});

		resolve(true);
	});
}
