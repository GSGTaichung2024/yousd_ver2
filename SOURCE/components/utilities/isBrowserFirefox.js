function isBrowserFirefox() {
	return ('netscape' in window) && / rv:/.test(navigator.userAgent);
}
