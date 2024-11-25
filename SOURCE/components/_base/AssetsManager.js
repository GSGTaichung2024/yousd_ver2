class AssetsManager {
	static load({
		type = undefined, // script | stylesheet
		src = null,
		id = null, // id attribute in DOM
		refElement,
		version = null,
		timeout = 15000,
		cache = false
	}) {
		return new Promise((resolve, reject) => {
			// Don't load asset that is pending to load
			if (cache && id in window.kinsey.assets.promises) {
				// return existing loading promise
				window.kinsey.assets.promises[id].then(resolve, reject);
				return;
			}

			// CSS
			if (type === 'style') {
				const stylePromise = AssetsManager.loadStyle({
					src,
					id,
					refElement,
					timeout,
					version
				});

				window.kinsey.assets.promises[id] = stylePromise;
				return stylePromise.then(resolve, reject);

			} else if (type === 'script') { // JS
				const scriptPromise = AssetsManager.loadScript({
					src,
					id,
					refElement,
					timeout,
					version
				});

				window.kinsey.assets.promises[id] = scriptPromise;

				return scriptPromise.then(resolve, reject);

			} else { // Unknown type
				reject(new TypeError('Resource type "style" or "script" is missing.'));
			}
		});
	}

	static loadScript({
		src = null,
		id = null,
		refElement = document.body,
		version = null,
		timeout = 15000
	}) {
		return new Promise((resolve, reject) => {
			const
				element = document.querySelector(`script[id="${id}"]`),
				head = document.getElementsByTagName('head')[0];

			let script, timer, preload;

			if (!src) {
				reject(new TypeError('Resource URL is missing.'));
				return;
			}

			if (!id) {
				reject(new TypeError('Resource ID attribute is missing.'));
				return;
			}

			if (typeof element === 'undefined' || element === null) {

				if (version) {
					src += `?ver=${version}`;
				}

				if (window.kinsey.theme.isFirstLoad) {
					preload = document.createElement('link');
					preload.setAttribute('rel', 'preload');
					preload.setAttribute('href', src);
					preload.setAttribute('as', 'script');
					preload.setAttribute('type', 'text/javascript');
					head.prepend(preload);
				}

				script = document.createElement('script');
				script.setAttribute('type', 'text/javascript');
				script.setAttribute('async', 'async');
				script.setAttribute('src', src);
				script.setAttribute('id', id);
				refElement.append(script);

				script.onerror = (error) => {
					cleanup();
					refElement.removeChild(script);
					script = null;
					reject(new Error(`A network error occured while trying to load resouce ${src}`));
				}

				if (script.onreadystatechange === undefined) {
					script.onload = onload;
				} else {
					script.onreadystatechange = onload;
				}

				timer = setTimeout(script.onerror, timeout);

			} else {
				resolve(element);
			}

			function cleanup() {
				clearTimeout(timer);
				timer = null;
				script.onerror = script.onreadystatechange = script.onload = null;
			}

			function onload() {
				cleanup();
				if (!script.onreadystatechange || (script.readyState && script.readyState == 'complete')) {
					resolve(script);
					return;
				}
			}
		});
	}

	static loadStyle({
		src = null,
		id = null,
		refElement = document.head.querySelector('link[type="text/css"]'),
		version = null,
		timeout = 15000
	}) {
		return new Promise((resolve, reject) => {
			const
				element = document.querySelector(`link[id="${id}"]`),
				head = document.getElementsByTagName('head')[0];

			// don't load resouce that already exists
			if (typeof element !== 'undefined' && element !== null) {
				resolve(element);
			}

			if (!src) {
				reject(new TypeError('Resource URL is missing.'));
			}

			if (!id) {
				reject(new TypeError('Resource ID attribute is missing.'))
			}

			let
				link = document.createElement('link'),
				timer,
				sheet,
				cssRules,
				preload,
				c = (timeout || 10) * 100;

			if (version) {
				src += `?ver=${version}`;
			}

			if (window.kinsey.theme.isFirstLoad) {
				preload = document.createElement('link');
				preload.setAttribute('rel', 'preload');
				preload.setAttribute('href', src);
				preload.setAttribute('as', 'style');
				preload.setAttribute('type', 'text/css');
				head.prepend(preload);
			}

			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', src);

			if (typeof refElement !== 'undefined' && refElement !== null) {
				head.insertBefore(link, refElement);
			} else {
				head.append(link);
			}

			link.onerror = function (error) {
				if (timer) {
					clearInterval(timer);
				}
				timer = null;

				reject(new Error(`A network error occured while trying to load resouce ${src}`));
			};

			if ('sheet' in link) {
				sheet = 'sheet';
				cssRules = 'cssRules';
			} else {
				sheet = 'styleSheet';
				cssRules = 'rules';
			}

			timer = setInterval(function () {
				try {
					if (link[sheet] && link[sheet][cssRules].length) {
						clearInterval(timer);
						timer = null;
						resolve(link);
						return;
					}
				} catch (e) {}

				if (c-- < 0) {
					clearInterval(timer);
					timer = null;
					reject(new Error(`A network error occured while trying to load resouce ${src}`));
				}
			}, 10);


		});
	}

	static loadGoogleMap({
		id = 'googlemap'
	}) {
		return new Promise((resolve) => {
			const mapScript = document.getElementById(id);

			if ((typeof google === 'undefined' || typeof google.maps === 'undefined') && typeof mapScript !== 'undefined' && mapScript !== null) {
				AssetsManager
					.load({
						type: 'script',
						id: mapScript.id,
						src: mapScript.src
					})
					.then(() => resolve(true));
			} else {
				resolve(true);
			}
		});
	}
}
