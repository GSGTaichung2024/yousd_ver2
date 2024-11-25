function runOnHighPerformanceGPU() {
	const $webGLCanvas = $('#js-webgl');

	// don't run on mobile devices
	if (!window.Modernizr.touchevents && $webGLCanvas.length) {
		$webGLCanvas[0].getContext('webgl', {
			powerPreference: 'high-performance'
		});
	}
}
