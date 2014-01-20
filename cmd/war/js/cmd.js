(function( $ ) { 
    $.cmdConsole = function(options, consoleDiv) {
    	this.settings = $.extend({
    		info: "This is a web command line.",
    		
    	}, options);
    	this.consoleDiv = consoleDiv;
    	this.init();
    };
    $.extend($.cmdConsole, {
    	prototype: {
    		onEnter: function(element, event) {
    			
    		},
    		init: function() {
    		}
    	}
    
    });
    $.fn.cmdConsole = function(options) {
		return new $.cmdConsole(options, this[0]);
    }; 
}( jQuery ));