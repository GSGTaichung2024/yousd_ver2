function syncAttributes($sourceElement, $targetElement) {
	// single element
	if ($sourceElement.length === 1 && $targetElement.length === 1) {
		const
			targetEl = $targetElement.get(0),
			targetAttributes = $targetElement.getAllAttributes(),
			sourceAttributes = $sourceElement.getAllAttributes();

		// source element doesn't have any attributes present
		if ($.isEmptyObject(sourceAttributes)) {
			// ... so remove all attributes from the target element
			[...targetEl.attributes].forEach(attr => targetEl.removeAttribute(attr.name));
		} else {
			Object.keys(targetAttributes).forEach((key) => {
				// delete key on target that doesn't exist in source element
				if (key !== 'style' && !(key in sourceAttributes)) {
					$targetElement.removeAttr(key);
				}
			});

			// sync attributes
			$targetElement.attr(sourceAttributes);
		}

		// multiple elements
	} else if ($sourceElement.length > 1 && $targetElement.length > 1 && $sourceElement.length === $targetElement.length) {

		$.each($targetElement, function (index) {
			const
				$current = $(this),
				sourceAttributes = $sourceElement.eq(index).getAllAttributes();

			// source element doesn't have any attributes present
			if ($.isEmptyObject(sourceAttributes)) {
				// ... so remove all attributes from the target element
				[...this.attributes].forEach(attr => this.removeAttribute(attr.name));
			} else {

				// sync attributes
				$current.attr(sourceAttributes);
			}
		});
	}
}
