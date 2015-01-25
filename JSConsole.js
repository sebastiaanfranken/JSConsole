(function(w, d) {

	/*
	 * Polyfill for Array.prototype.forEach for < IE9, from Mozilla.
	 * Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	 */
	if(!Array.prototype.forEach) {
		Array.prototype.forEach = function(callback, thisArg) {
			var T, k;

			if(this == null) {
				throw new TypeError('this is null or not defined');
			}

			var O = Object(this);
			var len = O.length >>> 0;

			if(typeof callback !== "function") {
				throw new TypeError(callback + " is not a function");
			}

			if(arguments.length > 1) {
				T = thisArg;
			}

			k = 0;

			while(k < len) {
				var kValue;

				if(k in O) {
					kValue = O[k];
					callback.call(T, kValue, k, O);
				}

				k++;
			}
		};
	}

	/*
	 * Polyfill for querySelector / querySelectorAll for < IE8, from GitHub
	 * Source URL: https://github.com/inexorabletash/polyfill/blob/master/polyfill.js#L638-L668
	 */
	if(!d.querySelectorAll) {
		d.querySelectorAll = function(selectors) {
			var style = d.createElement('style'),
				elements = [],
				element;

			d.documentElement.firstChild.appendChild(style);
			d._qsa = [];

			style.styleSheet.cssText = selectors + '{x-qsa: expression(document._qsa && document._qsa.push(this))}';
			window.scrollBy(0, 0);
			style.parentNode.removeChild(style);

			while(d._qsa.length) {
				element = d._qsa.shift();
				element.style.remoteAttribute('x-qsa');
				elements.push(element);
			}

			d._qsa = null;
			return elements;
		}
	}

	if(!d.querySelector) {
		d.querySelector = function(selectors) {
			var elements = d.querySelectorAll(selectors);
			return (elements.length) ? elements[0] : null;
		}
	}
	
	function JSConsole(options) {
		var self = this,
			defaults = {
				element: '#messages',
				consoleWrapper: '<ul>:messages</ul>',
				messageWrapper: '<li>:message</li>'
			};
			
		self.messages = [];
		self.options = self.utils.merge(defaults, options || {});
		self.element = self.utils.querySelector(self.options.element);
	}
	
	JSConsole.prototype = {
		constructor: JSConsole,
		
		utils: {
		
			/*
			 * Taken from the source of TheaterJS, which was a huge inspiration
			 */
			merge: function(dest, origin) {
				for(var key in origin) {
					if(origin.hasOwnProperty(key)) {
						dest[key] = origin[key];
					}
				}
				
				return dest;
			},

			querySelector: function(element) {
				switch(element.charAt(0)) {
					case '.' : return d.querySelectorAll(element); break;
					case '#' : return d.querySelector(element);    break;
					default  : throw("Not a valid DOM selector");  break;
				}
			}
		},
		
		log: function(message) {
			var self = this;
			
			if(typeof message === 'string' && message.length > 0) {
				self.messages.push(message);
			}
			
			return self;
		},
		
		write: function() {
			var self = this,
				buffer = '';
				
			/*
			 * forEach over all messages and build the buffer with all messages, wrapping each and every one of them
			 * in the 'messageWrapper' set in the options.
			 */
			self.messages.forEach(function(msg) {
				buffer += self.options.messageWrapper.replace(':message', msg);
			});

			if(typeof self.element === 'object' && self.element.length > 1) {

				/*
				 * If 'self.element' is an object and it has more than one item in it, it's probably a 'NodeList'.
				 * Convert it to a normal array here so we can use forEach on it and be done with it
				 */
				var elements = Array.prototype.slice.call(self.element);

				elements.forEach(function(el) {
					el.innerHTML = self.options.consoleWrapper.replace(':messages', buffer);
				});
			}
			else {
				self.element.innerHTML = self.options.consoleWrapper.replace(':messages', buffer);
			}
			
			return self;
		}
	};
	
	w.JSConsole = JSConsole;
	
})(window, document);
