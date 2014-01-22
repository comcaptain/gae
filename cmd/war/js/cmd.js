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
					cmdConsole.showCmdResult();
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
    		showCmdResult: function() {
    			var $cmdConsoleBlockResult = $('<div class="cmd_console_block cmd_console_block_result"></div>');
    			this.$consoleDiv.append($cmdConsoleBlockResult);
    			for (var color in this.commandResult) {
    				var colorClass = "cmd_console_text_" + color;
        			var resultLines = this.commandResult[color].split("\n");
        			for (var i in resultLines) {
        				$cmdConsoleBlockResult.append('<span class="cmd_console_line ' + colorClass + '">' + resultLines[i] + '</span>');
        			}
    			}
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