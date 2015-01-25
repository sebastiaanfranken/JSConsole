#JSConsole

A unified and easy Javascript console for HTML projects that require logging of sorts

Inspired by the coding style of [TheaterJS](https://github.com/Zhouzi/TheaterJS)

#Usage

```javascript

 	// Create a new JSConsole instance
	var console = new JSConsole();
	
	// Write some messages to the console
	console.log("I'm a message!");
	console.log("So am I!");
	
	// Write the console to the browser
	console.write();
```

#Options

You can pass a few options to the JSConsole constructor (as an `object`). These are:

name|default value|description
----|-------------|-----------
element|`#messages`|The default DOM node to write the message buffer to, should be a valid DOM node that can be queried with `querySelector`
consoleWrapper|`<ul>:messages</ul>`|Any HTML you would like to wrap all messages in. Be carefull to keep the `:messages`, since that gets replaced later on with the messages
messageWrapper|`<li>:message</li>`|Any HTML you would like to wrap the individual messages in. Be careful to keep the `:message`, since that gets replaced with the actual message
