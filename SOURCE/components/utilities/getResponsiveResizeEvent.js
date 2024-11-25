function getResponsiveResizeEvent() {
	return window.Modernizr.touchevents ? 'orientationchange' : 'resize';
}
