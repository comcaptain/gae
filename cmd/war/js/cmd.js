function realdump(arr,level) {
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
				dumped_text += realdump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
function dump(v) {
	console.log(realdump(v));
}



function Command(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.options = [];
}
Command.prototype.addOption = function(option) {
	this.options[option.content] = option;
}
Command.prototype._preProcessCommand = function(str) {
	str = str.replace(/\s+/g, " ");
	str = str.trim();
	return str;
}
Command.prototype._isOptionString = function(str) {
	return str.indexOf("-") == 0;
}
Command.prototype._toOptionValueStringPairs = function(str) {
	var optionValueStringPairList = [];
	var optionValueStringPair = [];
	var parts = str.split(" ");
	var hasValue = false;
	for (var i = 0; i < parts.length; i++) {
		var part = parts[i];
		if (this._isOptionString(part)) {
			part = part.substr(1);
			if (optionValueStringPair["value"]) {
				optionValueStringPairList.push(optionValueStringPair);
				optionValueStringPair = [];
			}
			if (!optionValueStringPair["option"]) optionValueStringPair["option"] = [part];
			else optionValueStringPair["option"].push(part);
		}
		else {
			hasValue = true;
			if (!optionValueStringPair["value"]) optionValueStringPair["value"] = [part];
			else optionValueStringPair["value"].push(part);
		}
	}
	if (optionValueStringPair != []) optionValueStringPairList.push(optionValueStringPair);
	if (!hasValue && this.valueRequired) {
		throw "Value is required";
	}
	return optionValueStringPairList;
}
Command.prototype._getOptionObjFromOptionStr = function(optionStr) {
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
}
Command.prototype._referenceOptionObj = function(optionValueStringPairList) {
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
}
Command.prototype.analyzeCommand = function(str) {
	str = this._preProcessCommand(str);
	if (!str) return;
	try {
		var optionValueStringPairList = this._toOptionValueStringPairs(str);
		var optionValuePairList = this._referenceOptionObj(optionValueStringPairList);
		return optionValueStringPairList;
	}
	catch (e) {
		return e;
	}
}
function CommandOption(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.canCombine = true;
}
(function( $ ) { 
    $.cmdConsole = function(options, $consoleDiv) {
    	this.settings = $.extend({
    		info: "This is just for fun.\nWeb console UI. \nversion 0.1"
    	}, options);
    	this.$consoleDiv = $consoleDiv;
    	this.consoleDiv = $consoleDiv[0];
    	this.commandList = [];
    	this.commandResult = [];
    	this.currentCommandIndex = -1;
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
    			}
    		},
			onEnter: function(ele, event) {
				var command = $.trim(this.$currentInput.text());
				this.thinking();
				var cmdConsole = this;
				this.processCommand(command, function() {
					var cmd = new Command("a", "a");
					cmd.addOption(new CommandOption("a", "a option"));
					var b = new CommandOption("b", "b option");
					b.valueRequired = true;
					cmd.addOption(b);
					cmd.addOption(new CommandOption("c", "c option"));
					if (command.indexOf(" "))
						dump(cmd.analyzeCommand(command.substr(command.indexOf(" "))));
					cmdConsole.displayMessage();
					cmdConsole.startNewInput();
					cmdConsole.registerCommand(command);					
				});
			},
			startNewInput: function() {
    			var $inputBlock = $('<div class="cmd_console_block cmd_console_block_input cmd_console_line"></div>');
    			this.$consoleDiv.append($inputBlock);
    			$inputBlock.append('<span class="cmd_console_arrow">&gt;</span>');
    			var $cmdConsoleInput = $('<span contenteditable="true" class="cmd_console_input"></span>');
    			this.$currentInput = $cmdConsoleInput;
    			$inputBlock.append($cmdConsoleInput);
    			$cmdConsoleInput.focus();
			},
    		displayMessage: function() {
    			var $cmdConsoleBlockResult = $('<div class="cmd_console_block cmd_console_block_result"></div>');
    			this.$consoleDiv.append($cmdConsoleBlockResult);
    			for (var color in this.commandResult) {
    				var colorClass = "cmd_console_text_" + color;
        			var resultLines = this.commandResult[color].split("\n");
        			for (var i in resultLines) {
        				$cmdConsoleBlockResult.append('<span class="cmd_console_line ' + colorClass + '">' + resultLines[i] + '</span>');
        			}
    			}
    			this.commandResult = [];
    		},
    		thinking: function() {
    			this.$currentInput.removeAttr("contenteditable");
    			this.$currentInput = undefined;
    			this.commandResult["gray"] = "Thinking, please wait...";
    		},
    		processCommand: function(command, callback) {
    			this.commandResult["white"] = command + "\n" + "this is result";
    			callback.call();
    		},
    		registerCommand: function(command) {
    			this.commandList.push(command);
    			this.currentCommandIndex = this.commandList.length;
    		},
    		showNextCommand: function() {
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex >= this.commandList.length - 1) return;
    			this.currentCommandIndex ++;
    			this.$currentInput.text(this.commandList[this.currentCommandIndex]);
    			this.utils.moveCursorToEnd(this.$currentInput[0]);
    		},
    		showPrevCommand: function() {
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex == 0) return;
    			this.currentCommandIndex --;
    			this.$currentInput.text(this.commandList[this.currentCommandIndex]);
    			this.utils.moveCursorToEnd(this.$currentInput[0]);
    		},
    		init: function() {
    			this._initConsoleByHtmlInsertion();
    			this._bindEvents();
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
    			});
    		}
    	}
    
    });
    $.fn.cmdConsole = function(options) {
		if (this.length == 0) return;
		return new $.cmdConsole(options, this);
    }; 
}( jQuery ));