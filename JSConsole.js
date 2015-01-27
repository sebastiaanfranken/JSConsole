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

			style.styleSheet.cssText = selectors + '{x-qsa: expression(d._qsa && d._qsa.push(this))}';
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
				messageWrapper: '<li>:message</li>',
				writeToBrowserConsole: false
			};
			
		self.messages = [];
		self.options = self.utils.merge(defaults, options || {});
		self.element = self.utils.querySelector(self.options.element);
	}
	
	JSConsole.prototype = {
		constructor: JSConsole,

		nativeConsole: typeof w.console === 'object' ? w.console : false,

		version: {
			major: 0,
			minor: 3,
			revision: 1,

			toString: function() {
				var self = this;
				return (self.major + '.' + self.minor + '.' + self.revision);
			}
		},
		
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
		
		log: function() {
			var self = this,
				args = Array.prototype.slice.call(arguments);

			switch(args.length) {
				case 1: default:
					args.forEach(function(argument) {
						if(typeof argument === 'string' && argument.length > 0) {
							self.messages.push(argument);
						}
					});
				break;

				case 2:
					var self = this,
						raw = args[0],
						patterns = args[1];

					for(var key in patterns) {
						if(patterns.hasOwnProperty(key)) {
							raw = raw.replace('[' + key + ']', patterns[key]);
						}
					}

					self.log(raw);
				break;

				/**
				 * Room for expansion later on, like the Chrome console has multiple arguments which makes it behave
				 * a bit like `sprintf`.
				 *
				 * The challenge is to do the same here
				 * @todo Make this behave like `sprintf` with more than one argument
				 */
			}

			return self;
		},
		
		write: function() {
			var self = this,
				buffer = '';

			if(self.options.writeToBrowserConsole === true && self.nativeConsole) {
				self.nativeConsole.group('JSConsole');
			}
				
			/*
			 * forEach over all messages and build the buffer with all messages, wrapping each and every one of them
			 * in the 'messageWrapper' set in the options.
			 */
			self.messages.forEach(function(msg) {
				buffer += self.options.messageWrapper.replace(':message', msg);

				/*
				 * If the option 'writeToBrowerConsole' is true also write the message to the native browser's console.
				 * This is written into a group, see the if statement above and below
				 */
				if(self.options.writeToBrowserConsole === true && self.nativeConsole) {
					self.nativeConsole.log(msg);
				}
			});

			if(self.options.writeToBrowserConsole === true && self.nativeConsole) {
				self.nativeConsole.groupEnd();
			}

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
		},
	};
	
	w.JSConsole = JSConsole;
	
})(window, document);
