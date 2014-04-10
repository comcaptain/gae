function real_dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += real_dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = arr;
	}
	return dumped_text;
}
function dump(v) {
	console.log(real_dump(v));
}

function Application() {
	this.console = null;
	this.currentHandler = null;
	this.name = "app";
	this.welcome = "Hello, I'm app."
	this.main = function(value) {
		this.end(new CmdMessage(value + "\nexited", "orange"));
	};
	this.start = function(optionStr) {
		this.displayMessage(new CmdMessage(this.name + " started\n" + this.welcome, "orange"))
		this.main.call(this, optionStr);
	};
}
Application.prototype = {
	registerConsole: function(console) {
		this.console = console;
	},
	wrapMessage: function(strMessage) {
		return new CmdMessage(strMessage, "green")
	},
	displayMessage: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.displayMessage(message);
	},
	end: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.onApplicationComplete(message);
	},
	next: function(message, nextHandler) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.currentHandler = nextHandler;
		this.console.onExecuteComplete(message);
	},
	setApplicationCommands: function(cmds) {
		this.console.setApplicationCommands(cmds);
	},
	clearRegisteredApplicationCommands: function() {
		this.console.clearRegisteredApplicationCommands();
	}
};
Application.prototype.constructor = Application;
function Command(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.options = [];
	this.console = null;
}
Command.prototype = {
	name: "CmdConsoleCommand",
	wrapMessage: function(strMessage) {
		return new CmdMessage(strMessage, "green")
	},
	addOption: function(option) {
		this.options[option.content] = option;
	},
	registerConsole: function(console) {
		this.console = console;
	},
	toDisplayData: function() {
		var data = new CmdDisplayTable(4);
		data.withBorder = true;
		data.addTr(["name", "hint", "require value", "can combine"]);
		data.addTr([this.content, this.hint, this.valueRequired]);
		for (var i in this.options) {
			var option = this.options[i];
			data.addTr(["-" + option.content, option.hint, option.valueRequired, option.canCombine]);
		}
		return data;
	},
	_preProcessCommand: function(str) {
		str = str.replace(/\s+/g, " ");
		str = str.trim();
		return str;
	},
	_isOptionString: function(str) {
		return str.indexOf("-") == 0;
	},
	_testHelp: function(str) {
		return str.indexOf("--help") >= 0;
	},
	_toOptionValueStringPairs: function(str) {
		var optionValueStringPairList = [];
		var optionValueStringPair = [];
		var parts = str.split(" ");
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (this._isOptionString(part)) {
				if (this._testHelp(part)) {
					throw "help";
				}
				part = part.substr(1);
				if (optionValueStringPair["value"]) {
					optionValueStringPairList.push(optionValueStringPair);
					optionValueStringPair = [];
				}
				if (!optionValueStringPair["option"]) optionValueStringPair["option"] = [part];
				else optionValueStringPair["option"].push(part);
			}
			else {
				if (!optionValueStringPair["value"]) optionValueStringPair["value"] = [part];
				else optionValueStringPair["value"].push(part);
			}
		}
		if (optionValueStringPair != []) optionValueStringPairList.push(optionValueStringPair);
		return optionValueStringPairList;
	},
	_getOptionObjFromOptionStr: function(optionStr) {
		//if there is only one single option
		if (this.options[optionStr]) return [this.options[optionStr]];
		var optionObjs = [];
		var isCombine = true;
		var combineRuleRuinedOptionObjs = [];
		for(var i = 0; i < optionStr.length; i++) {
			var optionObj = this.options[optionStr.charAt(i)];
			if (!optionObj) {
				isCombine = false;
				break;
			}
			if (!optionObj.canCombine) combineRuleRuinedOptionObjs.push(optionObj);
			optionObjs.push(optionObj);
		}
		if (isCombine) {
			if (combineRuleRuinedOptionObjs.length > 0) {
				throw "Option -" + combineRuleRuinedOptionObjs[0]["content"] + " cannot be combined."
			}
			return optionObjs;
		}
		throw "Option -"  + optionStr + " is not supported!";
	},
	_referenceOptionObj: function(optionValueStringPairList) {
		var optionValuePairList = [];
		for (var i in optionValueStringPairList) {
			var optionValueStringPair = optionValueStringPairList[i];
			var optionValueObjPair = optionValueStringPair;
			var valueRequiredOptionName = "";
			if (optionValueStringPair["option"]) {
				var optionStrList = optionValueStringPair["option"];
				var optionObjList = [];
				for (var j in optionStrList) {
					var optionStr = optionStrList[j];
					var optionObjs = this._getOptionObjFromOptionStr(optionStr);
					for (var k in optionObjs) {
						var optionObj = optionObjs[k];
						optionObjList[optionObj.content] = optionObj;
						if (optionObj.valueRequired) valueRequiredOptionName = optionObj.content;
					}
				}
				optionValueObjPair["option"] = optionObjList;
			}
			if (valueRequiredOptionName && !optionValueObjPair["value"]) {
				throw "Option -" +  valueRequiredOptionName + " requires value.";
			}
			optionValuePairList.push(optionValueObjPair); 
			valueRequiredOptionName = "";
		}
		return optionValuePairList;
	},
	analyzeCommand: function(str) {
		str = this._preProcessCommand(str);
		if (!str) return;
		var optionValueStringPairList = this._toOptionValueStringPairs(str);
		var optionValuePairList = this._referenceOptionObj(optionValueStringPairList);
		return optionValueStringPairList;
	},
	/*
	data format:
	[
	 {
	   "option": "optionObjs",
	   "value": ["val1", "val2", ...]
	 },
	 {
	   "option": "optionObjs",
	   "value": ["val1", "val2", ...]
	 }
	]
	*/
	executeImpl: function(data) {
		if (data) return real_dump(data);
		return "default execute";
	},
	execute: function(data) {
		if (!data && this.valueRequired) {
			this.end(new CmdMessage("Value is required", "red"));
			return;
		}
		this.executeImpl(data)
	},
	end: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.onExecuteComplete(message);
	},
	displayMessage: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.displayMessage(message);
	}
}
Command.prototype.constructor = Command;
function CommandOption(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.canCombine = true;
};
function CmdMessage(data, color) {
	this.data = data
	if (!color) {
		this.color = "white"
	}
	else {
		this.color = color
	}
}
function CmdDisplayTable(columnCount) {
	this.columnCount = columnCount;
	this.withBorder = true;
	this.trs = [];
};
CmdDisplayTable.prototype = {
	addTr: function(tds) {
		if (!this.columnCount || this.columnCount < tds.length) this.columnCount = tds.length;
		this.trs.push(tds);
	}
};
CmdDisplayTable.prototype.constructor = CmdDisplayTable;
(function( $ ) { 
    $.cmdConsole = function(options, $consoleDiv) {
    	this.settings = $.extend({
    		info: "This is just for fun.\nWeb console UI. \nversion 0.4",
    		rightPaste: true
    	}, options);
    	this.$consoleDiv = $consoleDiv;
    	this.consoleDiv = $consoleDiv[0];
    	this.commandHistory = [];
    	this.registeredCommands = {};
    	this.registeredApplications = {};
    	this.registeredApplicationCommands = {};
    	this.activeApplication = null;
    	this.currentCommandIndex = -1;
    	this.clipboard = undefined;
    	this.$currentInput = undefined;
    	this.init();
    };
    $.extend($.cmdConsole, {
    	prototype: {
    		utils: {
    			moveCursorToEnd: function(contentEditableElement) {
    			    var range,selection;
    			    if (document.createRange) {//Firefox, Chrome, Opera, Safari, IE 9+
    			        range = document.createRange();//Create a range (a range is a like the selection but invisible)
    			        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    			        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    			        selection = window.getSelection();//get the selection object (allows you to change selection)
    			        selection.removeAllRanges();//remove any selections already made
    			        selection.addRange(range);//make the range you have just created the visible selection
    			    }
    			    else if (document.selection) { //IE 8 and lower
    			        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
    			        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
    			        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    			        range.select();//Select the range (make it the visible selection
    			    }
    			},
    			getSelectedText: function() {
    			    if (window.getSelection) {
    			        return window.getSelection().toString();
    			    } else if (document.selection) {
    			        return document.selection.createRange().text;
    			    }
    			    return '';
    			},
    			disableRightClickMenu: function($ele) {
    				$ele.attr("oncontextmenu", "return false;");
    			},
    			scrollToBottom: function() {
    				$("body").scrollTop(document.body.scrollHeight);
    			}
    		},
    		onSelect: function(ele, event) {
    			var selectedText = $.trim(this.utils.getSelectedText());
    			if (selectedText) this.clipboard = selectedText;
    		},
    		onRightClick: function(ele, event) {
    			if (this.clipboard) {
    				this._enterCommand(this.clipboard);
    			}
    		},
			onEnter: function(ele, event) {
				var inputStr = $.trim(this.$currentInput.text());
				var cmdConsole = this;
				try {
					this.thinking();
					if (this.isApplicationRunning() && !this.isApplicationCommandRegistered()) {
						this.activeApplication.currentHandler.call(this.activeApplication, inputStr);
					}
					else {
						this.processCommand(inputStr);
					}
				}
				catch (e) {
					var message = null;
					if (e == "help") {
						message = new CmdMessage(command.toDisplayData());
					}
					else {
						message = new CmdMessage(e.toString(), "red");
					}
					this.onExecuteComplete(message);
				}
			},
			onTab: function(ele, event) {
				if (this.isApplicationRunning() && !this.isApplicationCommandRegistered()) return;
				var inputStr = $.trim(this.$currentInput.text());
				var cmdMessage = "";
				var count = 0;
				var lastMatchedCmd = undefined;
				for (var cmd in this.isApplicationRunning() ? this.registeredApplicationCommands : this.registeredCommands) {
					if (!inputStr || cmd.toLowerCase().indexOf(inputStr.toLowerCase()) == 0) {
						if (cmdMessage) cmdMessage += "\n";
						cmdMessage += cmd;
						count++;
						lastMatchedCmd = cmd;
					}
				}
				var applicationMsg = "";
				if (!this.isApplicationRunning()) {
					for (var cmd in this.registeredApplications) {
						if (!inputStr || cmd.toLowerCase().indexOf(inputStr.toLowerCase()) == 0) {
							if (applicationMsg) applicationMsg += "\n";
							applicationMsg += cmd;
							count++;
							lastMatchedCmd = cmd;
						}
					}
				}
				if (count == 1) {
					this._replaceCommand(lastMatchedCmd);
					return;
				}
				if (count == 0) this.displayMessage(new CmdMessage("none", "green"));
				else if (cmdMessage && applicationMsg) {
					this.displayMessage(new CmdMessage("Commands:", "orange"));
					this.displayMessage(new CmdMessage(cmdMessage, "green"));
					this.displayMessage(new CmdMessage("Applications:", "orange"));
					this.displayMessage(new CmdMessage(applicationMsg, "green"));
				}
				else {
					this.displayMessage(new CmdMessage(cmdMessage + applicationMsg, "green"));
				}
				this.startNewInput();
				this._replaceCommand(inputStr);
			},
			onExecuteComplete: function(message) {
				if (message) this.displayMessage(message);
				this.startNewInput();
			},
			onApplicationComplete: function(message) {
				if (message) this.displayMessage(message);
				this._stopApplication();
				this.startNewInput();
			},
			startNewInput: function() {
    			var $inputBlock = $('<div class="cmd_console_block cmd_console_block_input cmd_console_line"></div>');
    			this.$consoleDiv.append($inputBlock);
    			if (!this.isApplicationRunning() || this.isApplicationCommandRegistered()) $inputBlock.append('<span class="cmd_console_arrow">&gt;</span>');
    			var $cmdConsoleInput = $('<span contenteditable="true" spellcheck="false" class="cmd_console_input"></span>');
    			if (this.$currentInput) this.$currentInput.removeAttr("contenteditable");
    			this.$currentInput = $cmdConsoleInput;
    			$inputBlock.append($cmdConsoleInput);
    			this.utils.scrollToBottom();
    			this.utils.moveCursorToEnd($cmdConsoleInput[0]);
    			$cmdConsoleInput.focus();
			},
    		displayMessage: function(message) {
    			var $cmdConsoleBlockResult = $('<div class="cmd_console_block cmd_console_block_result"></div>');
    			this.$consoleDiv.append($cmdConsoleBlockResult);
    			var colorClass = "cmd_console_text_" + message.color;
    			var data = message.data;
				if (typeof(data) == "object") {
					if (data.constructor.name == "CmdDisplayTable")
						this._generateTableResult($cmdConsoleBlockResult, data, colorClass);
				}
				else {
					this._generateLineResult($cmdConsoleBlockResult, data, colorClass);
				}
    			this.utils.scrollToBottom();
    		},
    		_enterCommand: function(command) {
				var currentText = this.$currentInput.text();
				this.$currentInput.text(currentText + command);
				this.utils.moveCursorToEnd(this.$currentInput[0]);
    		},
    		_replaceCommand: function(command) {
    			this.$currentInput.text(command);
    			this.utils.moveCursorToEnd(this.$currentInput[0]);
    		},
    		_generateTableResult: function($container, tableData, colorClass) {
    			var tableClass = 'cmd_console_table ' + colorClass;
    			if (tableData.withBorder) {
    				tableClass += " cmd_console_with_border";
    			}
    			var $table = $('<table class="' + tableClass + '"></table>');
    			for (var i in tableData.trs) {
    				var tds = tableData.trs[i];
    				var $tr = $('<tr></tr>');
    				for (var j = 0; j < tableData.columnCount; j++) {
    					if (tds[j])
    						$tr.append('<td>' + tds[j] + '</td>');
    					else 
    						$tr.append('<td></td>');
    				}
    				$table.append($tr);
    			}
    			$container.append($table);
    		},
    		_generateLineResult: function($container, data, colorClass) {
    			data = data + "";
    			var resultLines = data.split("\n");
    			for (var i in resultLines) {
    				$container.append('<span class="cmd_console_line ' + colorClass + '">' + resultLines[i] + '</span>');
    			}
    		},
    		_startApplication: function(application, optionStr) {
    			this.activeApplication = application;
    			application.start(optionStr);
    		},
    		_stopApplication: function() {
    			this.displayMessage(new CmdMessage(this.activeApplication.name + " exited.", "orange"));
    			this.activeApplication = null;
    			this.registeredApplicationCommands = {};
    		},
    		isApplicationRunning: function() {
    			if (this.activeApplication) return true;
    			return false;
    		},
    		isApplicationCommandRegistered: function() {
    			if (!this.registeredApplicationCommands) return false;
    			for (var i in this.registeredApplicationCommands) {
    				return true;
    			}
    			return false;
    		},
    		thinking: function() {
    			this.$currentInput.removeAttr("contenteditable");
    			this.$currentInput = undefined;
    			this.displayMessage(new CmdMessage("Thinking, please wait...", "gray"));
    		},
    		processCommand: function(inputStr) {
				var commandStr = inputStr;
				var hasOption = false;
				if (inputStr.indexOf(" ") >= 0) {
					commandStr = inputStr.substr(0, inputStr.indexOf(" "));
					var optionStr = inputStr.substr(inputStr.indexOf(" "));
					hasOption = true;
				}
				this.logCommand(inputStr);
				var command = this.isApplicationRunning() ? this.registeredApplicationCommands[commandStr] : this.registeredCommands[commandStr];
				if (command) {
					if (hasOption) {
						var data = command.analyzeCommand(optionStr);
						command.execute(data);
					}
					else {
						command.execute();
					}
				}
				else if (this.registeredApplications[commandStr] && !this.isApplicationRunning()){
					if (hasOption) {
						this._startApplication(this.registeredApplications[commandStr], optionStr)
					}
					else {
						this._startApplication(this.registeredApplications[commandStr])
					}
				}
				else {
					throw "Command " + commandStr + " is not supported.";
				}
    		},
    		logCommand: function(command) {
    			this.commandHistory.push(command);
    			this.currentCommandIndex = this.commandHistory.length;
    		},
    		showNextCommand: function() {
    			if (this.isApplicationRunning()) return;
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex >= this.commandHistory.length - 1) return;
    			this.currentCommandIndex ++;
    			this._replaceCommand(this.commandHistory[this.currentCommandIndex]);
    		},
    		showPrevCommand: function() {
    			if (this.isApplicationRunning()) return;
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex == 0) return;
    			this.currentCommandIndex --;
    			this._replaceCommand(this.commandHistory[this.currentCommandIndex]);
    		},
    		init: function() {
    			this._initConsoleByHtmlInsertion();
    			this._bindEvents();
    			this._embedInternalCommand();
				if (this.settings.rightPaste) this.utils.disableRightClickMenu(this.$consoleDiv);
    		},
    		registerCommand: function(cmd) {
    			cmd.registerConsole(this);
    			this.registeredCommands[cmd.content] = cmd;
    		},
    		registerApplicationCommand: function(cmd) {
    			cmd.registerConsole(this);
    			this.registeredApplicationCommands[cmd.content] = cmd;
    		},
    		clearRegisteredApplicationCommands: function() {
    			this.registeredApplicationCommands = [];
    		},
    		registerApplication: function(app) {
    			app.registerConsole(this);
    			this.registeredApplications[app.name] = app;
    		},
    		_initConsoleByHtmlInsertion: function() {
    			this.$consoleDiv.addClass("cmd_console");
    			var $info = $(('<div class="cmd_console_info cmd_console_text_orange"></div>'));
    			this.$consoleDiv.append($info);
    			var infoLines = this.settings["info"].split("\n");
    			for (var i in infoLines) {
    				$info.append('<span class="cmd_console_line narrow">' + infoLines[i] + '</span>');
    			}
    			this.startNewInput();
    		},
    		_bindEvents: function() {
    			var cmdConsole = this;
    			this.$consoleDiv.on("keydown", ".cmd_console_input", function(event) {    				
    				//enter
    				if (event.keyCode == 13) {
    					event.preventDefault();
        				cmdConsole.onEnter(this, event);
    				}
    				//arrow up
    				else if (event.keyCode == 38) {
    					event.preventDefault();
    					cmdConsole.showPrevCommand();
    				}
    				//arrow down
    				else if (event.keyCode == 40) {
    					event.preventDefault();    		
    					cmdConsole.showNextCommand();
    				}
    				//tab
    				else if (event.keyCode == 9) {
    					event.preventDefault();
    					cmdConsole.onTab(this, event);
    				}
    			});
    			if (this.settings.rightPaste) {
        			this.$consoleDiv.mouseup(function(event) {
        				//left mouse click
        				if (event.which == 1) {
        					cmdConsole.onSelect(this, event);
        				}
        				//right mouse click
        				else if (event.which == 3) {
        					event.preventDefault();
        					cmdConsole.onRightClick(this, event);
        				}
        			});
    			}
    		},
    		//below are internal commands
    		_embedInternalCommand: function() {
    			this.registerCommand(this._clearCommand());
    			this.registerCommand(this._helpCommand());
    			this.registerCommand(this._getRGBCommand());
    			this.registerCommand(this._getHexColorCommand());
    		},
    		_clearCommand: function() {
    			var cmd = new Command("clear", "Clear all messages on the screen");
    			var cmdConsole = this;
    			cmd.executeImpl = function() {
    				cmdConsole.$consoleDiv.find(".cmd_console_block").remove();
    				this.end();
    			};
    			return cmd;
    		},
    		_helpCommand: function() {
    			var cmd = new Command("help", "help");
    			cmd.executeImpl = function() {
    				this.end(new CmdMessage("Hello world!", "green"));
    			}
    			return cmd;
    		},
    		_getRGBCommand: function() {
    			var cmd = new Command("rgb", "input hexformat color, e.g. #00FF00, get rgb format color");
    			cmd.valueRequired = true;
    			cmd.executeImpl = function(data) {
    				var value = data[0]["value"][0];
    				var matches = value.match(/^#?([0-9a-fA-F]{6})$/);
    				if (!matches) {
    					throw "You must input a hexformat color, e.g. #00FF00 or 00FF00";
    				}
    				var hexString = matches[1];
    				this.end(new CmdMessage("rgb("
    						+ parseInt("0x" + hexString.substr(0, 2)) + ","
    						+ parseInt("0x" + hexString.substr(2, 2)) + ","
    						+ parseInt("0x" + hexString.substr(4, 2)) + ")", "green"));
    			}
    			return cmd;
    		},
    		_getHexColorCommand: function() {
    			var help = "input rgb format color, e.g. rgb(0,255,0) or (0,255,0) or 0,255,0 \nWarning: no space is allowed";
    			var cmd = new Command("hexColor", help);
    			cmd.valueRequired = true;
    			cmd.executeImpl = function(data) {
    				var value = data[0]["value"][0];
    				var matches = value.match(/^\(?([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\)?$/);
    				if (!matches) {
    					throw "You must " + help;
    				}
    				var toToDigitsHex = function(numStr) {
    					var hexStr = parseInt(numStr).toString("16");
    					if (hexStr.length == 1) hexStr = "0" + hexStr;
    					return hexStr.toUpperCase();
    				}
    				this.end(new CmdMessage("#" + toToDigitsHex(matches[1]) + toToDigitsHex(matches[2]) + toToDigitsHex(matches[3]), "green"));
    			}
    			return cmd;
    		}
    	}
    
    });
    $.fn.cmdConsole = function(options) {
		if (this.length == 0) return;
		return new $.cmdConsole(options, this);
    }; 
}( jQuery ));