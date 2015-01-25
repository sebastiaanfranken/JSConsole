(function(w, d) {
	
	function JSConsole(element, options) {
		var self = this,
			defaults = {
				consoleWrapper: '<ul>:messages</ul>',
				messageWrapper: '<li>:message</li>'
			};
			
		self.element = (typeof element === 'string' && element.length > 0) ? d.querySelector(element) : d.querySelector('#messages');
		self.messages = [];
		self.options = self.utils.merge(defaults, options || {});
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
				
			self.messages.forEaech(function(msg) {
				buffer += self.options.messageWrapper.replace(':message', msg);
			});
			
			self.element.innerHTML = self.options.consoleWrapper.replace(':messages', buffer);
			
			return self;
		}
	};
	
	w.JSConsole = JSConsole;
	
})(window, document);
