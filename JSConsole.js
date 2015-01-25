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
		self.element = d.querySelector(self.options.element);
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
			
			self.element.innerHTML = self.options.consoleWrapper.replace(':messages', buffer);
			
			return self;
		}
	};
	
	w.JSConsole = JSConsole;
	
})(window, document);
