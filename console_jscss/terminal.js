
function dbg(txt) { if (window.console) console.log(txt); }

var Terminal = new Class({

	commandHistory: [],
	commandHistoryIndex: -1,

	initialize: function(container) {
		this.terminal = container;
		this.out('Welcome to <a id="welcomelink" href="//arjunsreedharan.org/">the real world.</a>.');
		this.out('Type \'help\' for a list of available commands.');
		this.out('&nbsp;');
		this.prompt();

		//$('welcomelink').focus();

		this.path = '.';

		// Hook events
		$(document).addEvent('keydown',  function(event) { this.keydown(event); }.bind(this));
		$(document).addEvent('keypress', function(event) { this.keypress(event); }.bind(this));
	},

	// Process keystrokes
	keydown: function(event) {
		dbg('keydown> ' + event.key + '(' + event.code + ') ' + event.control + ' - ' + event.shift + ' - ' + event.alt + ' - ' + event.meta);
		if (event.control /*|| event.shift*/ || event.alt || event.meta) return;
		var command = this.currentCommand.get('html');

		if (event.key == 'enter') {
			event.preventDefault();
			this.run();
			return;
		}

                if (event.key == 'backspace') {
                        event.preventDefault();
                        if (command.substr(command.length-6) == '&nbsp;') {
                                command = command.substr(0, command.length-6);
                        } else {
                                command = command.substr(0, command.length-1);
                        }
                        this.currentCommand.set('html', command);
                        return;
                }

	},

	keypress: function(event) {
		dbg('keypress> ' + event.key + '(' + event.code + ') ' + event.control + ' - ' + event.shift + ' - ' + event.alt + ' - ' + event.meta);
		if (event.control /*|| event.shift*/ || event.alt || event.meta) return;
		var command = this.currentCommand.get('html');

		//$('body').focus();

		if (event.key == 'enter') {
			event.preventDefault();
		//	this.run();
			return;
		}

//		if (event.key == 'backspace') {
//			event.preventDefault();
//			if (command.substr(command.length-6) == '&nbsp;') {
//				command = command.substr(0, command.length-6);
//			} else {
//				command = command.substr(0, command.length-1);
//			}
//			this.currentCommand.set('html', command);
//			return;
//		}

		// if (event.key == 'tab') {
		// 	event.preventDefault();
		// 	this.guess();
		// 	return;
		// }

		if (event.key == 'space') {
			event.preventDefault();
			command += '&nbsp;';
			this.currentCommand.set('html', command);
			return;
		}

		if (event.code == 38) { // Up arrow
			event.preventDefault();
			dbg(this.commandHistoryIndex + ', ' + this.commandHistory.length);
			if (this.commandHistoryIndex > 0) {
				this.commandHistoryIndex--;
				this.currentCommand.set('html', this.commandHistory[this.commandHistoryIndex]);
			}
			return;
		}

		if (event.code == 40) { // Down arrow
			event.preventDefault();
			dbg(this.commandHistoryIndex + ', ' + this.commandHistory.length);
			if (this.commandHistoryIndex < this.commandHistory.length) {
				this.commandHistoryIndex++;
				this.currentCommand.set('html', this.commandHistory[this.commandHistoryIndex]);
				// This can overflow the array by 1, which will clear the command line
			}
		}

		// For all typing keys
		if (this.validkey(event.code)) {
			event.preventDefault();
			if (event.code == 46) {
				command += '.';
			} else {
				command += event.key;
			}
			this.currentCommand.set('html', command);
			return;
		}
	},

	validkey: function(code) {
		return  (code > 64 && code < 91)  ||	// [A-Z]
				(code > 96 && code < 123) ||	// [a-z]
				(code == 95) || // _
				(code > 44 && code < 58);		// -./[0-9]
	},

	// Outputs a line of text
	out: function(text) {
		var p = new Element('div');
		p.set('html', text);
		this.terminal.grab(p);
	},

	// Displays the prompt for command input
	prompt: function() {
		if (this.currentPrompt)
			this.currentPrompt.getElement('.cursor').destroy();

		this.currentPrompt = new Element('div');
		this.currentPrompt.grab(new Element('span').addClass('prompt').set('text', '[guest@arjunsreedharan.org]$'));
		this.currentCommand = new Element('span').addClass('command');
		this.currentPrompt.grab(this.currentCommand);
		this.currentPrompt.grab(new Element('span').addClass('cursor'));
		this.terminal.grab(this.currentPrompt);
		$(window).scrollTo(0, this.currentPrompt.getPosition().y);
	},

	guess: function() {
		var command = this.currentCommand.get('html');
		if (command.substr(0,1) == 'c')
			command = 'copy';
		this.currentCommand.set('html', command);
	},

	// Executes a command
	run: function() {
		var command = this.currentCommand.get('text');

		this.commandHistory.push(command);
		this.commandHistoryIndex = this.commandHistory.length;

		if (command == 'help') {
			this.out('List of available commands:');
			this.out('<span class="commandhelp">blog</span>blog.')
			this.out('<span class="commandhelp">clear</span>Clear screen.')
			this.out('<span class="commandhelp">contact</span>Contact info.')
			this.out('<span class="commandhelp">date</span>Displays the current date.');
			this.out('<span class="commandhelp">exit</span>Exit');
			this.out('<span class="commandhelp">goto</span>Jump to other pages.');
			this.out('<span class="commandhelp">help</span>Displays this list.');
			//this.out('<span class="commandhelp">ls</span>List directories.');
			this.out('<span class="commandhelp">press</span>Press related links.');
			this.out('<span class="commandhelp">projects</span>List of projects Eneko is involved on.');
			this.out('<span class="commandhelp">skills</span>Professional skills.');
			this.out('<span class="commandhelp">svn</span>SVN repository address.')
			this.out('<span class="commandhelp">resume</span>Displays a compact resume.');
			this.out('<span class="commandhelp">whoami</span>Displays your username.');
			this.out('<span class="commandhelp">whois</span>Who is ..?');
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		// ---------------------
		
		if (command == 'blog') {
			this.out('<a target="_blank" href="//arjunsreedharan.org">arjunsreedharan.org</a> - Ahh nothing there');
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command == 'clear') {
			this.currentPrompt = null;
			this.terminal.empty();
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command == 'contact') {
			this.out('arjun024@gmail.com');
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command == 'copy') {
			this.out('what?');
			this.prompt();
			this.out('&nbsp;');
			return;
		}
		
		if (command == 'su') {
			this.out('Really??, you think you can take over. you are quite a work. huhh ');
			this.prompt();
			this.out('&nbsp;');
			return;
		}
		if (command == 'date') {
			this.out(new Date());
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command.substr(0,4) == 'goto') {
			var dest = command.substr(5);
			if (dest == 'home')      { window.location.href = '//arjunsreedharan.org'; }
			if (dest == 'blog')      { window.location.href = '//arjunsreedharan.org'; }
			if (dest == 'about')      { window.location.href = '//arjunsreedharan.org/about#about'; }
			if (dest == 'contact')      { window.location.href = '//arjunsreedharan.org/about#contact'; }
			if (dest == 'archives')      { window.location.href = '//arjunsreedharan.org/archives'; }
			if (dest == '') { this.out('destination: home, blog, about, contact, archives'); }
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command.substr(0,2) == 'ls') {
			var dest = command.substr(3).trim();
			var request = new Request.HTML().get('terminal.php?command=ls&path='+this.path+'/'+dest);
			request.addEvent('complete', function() {
				if (request.isSuccess()) {
					this.out(request.response.html);
				} else {
					this.out('Only superusers are allowed access to the directory tree.');
				}
				this.prompt(); // Do not show prompt until ajax call is complete
				this.out('&nbsp;');
			}.bind(this));
			return;
		}

		if (command == 'press') {
			this.out('what do you think you are doing');
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command == 'projects') {
			this.out('not interested. sorry');
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command == 'skills') {
			this.out('\0');
			this.prompt();
			this.out('&nbsp;');
			return;
		}

		if (command == 'svn') {
			this.out('nope');
			this.prompt();
			this.out('&nbsp;');
			return;
		}
		
		if (command == 'resume') {
			this.out('duhh!');
			this.prompt();
			this.out('&nbsp;');
			return;
		}
		
		if (command == 'whoami') {
			this.out('guest');
			this.prompt();
			this.out('&nbsp;');
			return;
		}
		
		if (command == 'whois') {
			this.out('who is what?');
			this.prompt();
			this.out('&nbsp;');
			return;
		}
		
		if (command == 'exit') {
			window.location.href = '//arjunsreedharan.org/'; 
			return;
		}

		if (command)
			this.out('-bash: ' + command + ': command not found');
		this.prompt();
		this.out('&nbsp;');
	}
});

$(window).addEvent('domready', function() {
	window.terminal = new Terminal($('terminal'));
});
