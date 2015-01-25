(function(w, d) {
	
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
				
			self.messages.forEach(function(msg) {
				buffer += self.options.messageWrapper.replace(':message', msg);
			});

			if(typeof self.element === 'object' && self.element.length > 1) {
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
