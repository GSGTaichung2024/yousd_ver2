!function(n){"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof module&&module.exports?module.exports=function(e,u){return void 0===u&&(u="undefined"!=typeof window?require("jquery"):require("jquery")(e)),n(),u}:n(jQuery)}(function(e){"use strict";

jQuery.extend(jQuery.easing, {
	easeInOutExpo: function (x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
});

jQuery.extend(jQuery.expr[':'], {
	'in-viewport': function (el) {
		if (typeof el === 'undefined' || el === null) {
			return false;
		}

		if (el instanceof jQuery) {
			el = el.get(0);
		}

		if (typeof window.SB !== 'undefined') {
			return window.SB.isVisible(el);
		} else {
			const {top, bottom} = el.getBoundingClientRect();

			return (
				(top > 0 || bottom > 0) &&
				top < (window.innerHeight || document.documentElement.clientHeight)
			);
		}
	}
});

jQuery.event.special.touchstart = {
	setup: function( _, ns, handle ) {
			this.addEventListener('touchstart', handle, { passive: !ns.includes('noPreventDefault') });
	}
};

jQuery.event.special.touchmove = {
	setup: function( _, ns, handle ) {
			this.addEventListener('touchmove', handle, { passive: !ns.includes('noPreventDefault') });
	}
};

jQuery.event.special.wheel = {
	setup: function( _, ns, handle ){
			this.addEventListener('wheel', handle, { passive: true });
	}
};

jQuery.event.special.mousewheel = {
	setup: function( _, ns, handle ){
			this.addEventListener('mousewheel', handle, { passive: true });
	}
};

});
