function PJAXInitNextMasthead(data) {
	return new Promise((resolve) => {
		const
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead:not(.d-none)'); // no need to init the hidden masthead

		// init next page masthead
		if ($nextMasthead.length) {

			new SectionMasthead({
				target: $nextMasthead,
				scope: $nextContainer
			});

			resolve(true);
		} else {
			resolve(true);
		}
	});
}
