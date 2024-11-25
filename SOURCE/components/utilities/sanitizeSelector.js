function sanitizeSelector(string) {
	if (!string || !string.length) {
		return false;
	}

	return string
		.replace(/(\r\n|\n|\r)/gm, '') // remove tabs, spaces
		.replace(/(\\n)/g, '') // remove lines breaks
		.replace(/^[,\s]+|[,\s]+$/g, '') // remove redundant commas
		.replace(/\s*,\s*/g, ','); // remove duplicated commas
}
