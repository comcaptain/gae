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



function Command(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.options = [];
}
Command.prototype = {
	addOption: function(option) {
		this.options[option.content] = option;
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
	//data format:
	//[
	// {
	//   "option": "optionObjs",
	//   "value": ["val1", "val2", ...]
	// },
	// {
	//   "option": "optionObjs",
	//   "value": ["val1", "val2", ...]
	// }
	//]
	execute: function(data) {
		if (data) return real_dump(data);
		return "default execute";
	}
}
function CommandOption(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.canCombine = true;
};
function CmdDisplayTable(columnCount) {
	this.columnCount = columnCount;
	this.withBorder = false;
	this.trs = [];
};
CmdDisplayTable.prototype = {
	addTr: function(tds) {
		if (!this.columnCount) this.columnCount = tds.length;
		this.trs.push(tds);
	}
};
(function( $ ) { 
    $.cmdConsole = function(options, $consoleDiv) {
    	this.settings = $.extend({
    		info: "This is just for fun.\nWeb console UI. \nversion 0.3",
    		rightPaste: true
    	}, options);
    	this.$consoleDiv = $consoleDiv;
    	this.consoleDiv = $consoleDiv[0];
    	this.commandHistory = [];
    	this.registeredCommands = [];
    	this.dataForDisplay = [];
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
				this.thinking();
				var cmdConsole = this;
				this.processCommand(inputStr, function() {
					var commandStr = inputStr;
					var hasOption = false;
					if (inputStr.indexOf(" ") >= 0) {
						commandStr = inputStr.substr(0, inputStr.indexOf(" "));
						var optionStr = inputStr.substr(inputStr.indexOf(" "));
						hasOption = true;
					}
					var command = cmdConsole.registeredCommands[commandStr];
					try {
						if (!command) throw "Command " + commandStr + " is not supported.";
						var result;
						if (hasOption) {
							var data = command.analyzeCommand(optionStr);
							result = command.execute(data) + "";
						}
						else {
							if (command.valueRequired) {
								throw "Value is required";
							}
							result = command.execute();
						}
						if (result) cmdConsole._addDisplayMessage(real_dump(result), "green");
					}
					catch(e) {
						if (e == "help") {
							cmdConsole._addDisplayMessage(command.toDisplayData());
						}
						else {
							cmdConsole._addDisplayMessage(e, "red");
						}
					}
					cmdConsole.displayMessage();
					cmdConsole.startNewInput();
					cmdConsole.logCommand(inputStr);					
				});
			},
			onTab: function(ele, event) {
				var inputStr = $.trim(this.$currentInput.text());
				var message = "";
				var count = 0;
				var lastMatchedCmd = undefined;
				for (var cmd in this.registeredCommands) {
					if (!inputStr || cmd.indexOf(inputStr) == 0) {
						if (message) message += "\n";
						message += cmd;
						count++;
						lastMatchedCmd = cmd;
					}
				}
				if (count == 0) message = "none";
				if (count == 1) {
					this._replaceCommand(lastMatchedCmd);
					return;
				}
				this._addDisplayMessage(message, "green");
				this.displayMessage();
				this.startNewInput();
				this._replaceCommand(inputStr);
			},
			startNewInput: function() {
    			var $inputBlock = $('<div class="cmd_console_block cmd_console_block_input cmd_console_line"></div>');
    			this.$consoleDiv.append($inputBlock);
    			$inputBlock.append('<span class="cmd_console_arrow">&gt;</span>');
    			var $cmdConsoleInput = $('<span contenteditable="true" spellcheck="false" class="cmd_console_input"></span>');
    			this.$currentInput = $cmdConsoleInput;
    			$inputBlock.append($cmdConsoleInput);
    			$cmdConsoleInput.focus();
    			this._clearDisplayData();
			},
    		displayMessage: function() {
    			var $cmdConsoleBlockResult = $('<div class="cmd_console_block cmd_console_block_result"></div>');
    			this.$consoleDiv.append($cmdConsoleBlockResult);
    			for (var color in this.dataForDisplay) {
    				var colorDisplayData = this.dataForDisplay[color];
    				for (var j in colorDisplayData) {
    					var data = colorDisplayData[j];
    	    			var colorClass = "cmd_console_text_" + color;
    					if (typeof(data) == "object") {
    						if (data.constructor.name == "CmdDisplayTable")
    							this._generateTableResult($cmdConsoleBlockResult, data, colorClass);
    					}
    					else {
        					this._generateLineResult($cmdConsoleBlockResult, data, colorClass);
    					}
    				}
    			}
    			this._clearDisplayData();
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
    			var resultLines = data.split("\n");
    			for (var i in resultLines) {
    				$container.append('<span class="cmd_console_line ' + colorClass + '">' + resultLines[i] + '</span>');
    			}
    		},
    		_clearDisplayData: function(color) {
    			if (color) delete this.dataForDisplay[color];
    			else this.dataForDisplay = [];
    		},
    		_addDisplayMessage: function(message, color) {
    			if (!color) color = "white";
    			if (!this.dataForDisplay[color]) this.dataForDisplay[color] = [];
    			if (!$.isArray(message))
    				this.dataForDisplay[color].push(message);
    			else {
    				for (var i in message) {
        				this.dataForDisplay[color].push(message[i]);
    				}
    			}
    		},
    		thinking: function() {
    			this.$currentInput.removeAttr("contenteditable");
    			this.$currentInput = undefined;
    			this._addDisplayMessage("Thinking, please wait...", "gray");
    		},
    		processCommand: function(command, callback) {
    			callback.call();
    		},
    		logCommand: function(command) {
    			this.commandHistory.push(command);
    			this.currentCommandIndex = this.commandHistory.length;
    		},
    		showNextCommand: function() {
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex >= this.commandHistory.length - 1) return;
    			this.currentCommandIndex ++;
    			this._replaceCommand(this.commandHistory[this.currentCommandIndex]);
    		},
    		showPrevCommand: function() {
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
    			this.registeredCommands[cmd.content] = cmd;
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
    			cmd.execute = function() {
    				cmdConsole._clearDisplayData();
    				cmdConsole.$consoleDiv.find(".cmd_console_block").remove();
    			};
    			return cmd;
    		},
    		_helpCommand: function() {
    			var cmd = new Command("help", "help");
    			cmd.execute = function() {
    				return "Hello world!";
    			}
    			return cmd;
    		},
    		_getRGBCommand: function() {
    			var cmd = new Command("rgb", "input hexformat color, e.g. #00FF00, get rgb format color");
    			cmd.valueRequired = true;
    			cmd.execute = function(data) {
    				var value = data[0]["value"][0];
    				var matches = value.match(/^#?([0-9a-fA-F]{6})$/);
    				if (!matches) {
    					throw "You must input a hexformat color, e.g. #00FF00 or 00FF00";
    				}
    				var hexString = matches[1];
    				return "rgb("
    						+ parseInt("0x" + hexString.substr(0, 2)) + ","
    						+ parseInt("0x" + hexString.substr(2, 2)) + ","
    						+ parseInt("0x" + hexString.substr(4, 2)) + ")";
    			}
    			return cmd;
    		},
    		_getHexColorCommand: function() {
    			var help = "input rgb format color, e.g. rgb(0,255,0) or (0,255,0) or 0,255,0 \nWarning: no space is allowed";
    			var cmd = new Command("hexColor", help);
    			cmd.valueRequired = true;
    			cmd.execute = function(data) {
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
    				return "#" + toToDigitsHex(matches[1]) + toToDigitsHex(matches[2]) + toToDigitsHex(matches[3]);
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