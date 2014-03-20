$(document).ready(function() {
	var paper = Raphael(document.getElementById('test'), 500, 500);
//	var tetronimo = paper.path("M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z");
//	tetronimo.attr({
//		gradient: '90-#526c7a-#64a0c1',
//		stroke: '#3b4449',
//		'stroke-width': 10,
//		'stroke-linejoin': 'round',
//		transform: "r90"
//	});
//	tetronimo.animate({
//		transform: "r180",
//		path: "M 250 250 l 0 -50 l -50 0 l 0 -50 l -100 0 l 0 50 l 50 0 l 0 50 z"
//	}, 2000, 'bounce');
//	var circ = paper.circle(250, 250, 40);
//    circ.attr({fill: '#000', stroke: 'none'});
//    var text = paper.text(250, 250, 'Bye Bye Circle!')
//    text.attr({opacity: 0, 'font-size': 12}).toBack();
//    $(circ.node).on("mouseover", function() {
//    	$(this).css("cursor", "pointer");
//    });;
//    $(circ.node).on("click", function() {
//    	text.animate({opacity: 1}, 2000);
//    	circ.animate({opacity: 0}, 2000, function() {this.remove();});
//    });
	paper.path("M 10 10 l -5 0 l 5 0 l 0 30 l -5 0 l 5 0 l 0 30 l -5 0 l 5 0 l 0 30 l -5 0 l 5 0 l 0 30 l -5 0 l 5 0 l 0 30 l -5 0 l 5 0 l 0 30");
});
function MyString(str) {
	for (var i = 0; i < str.length; i++) {
		this[i] = str[i];
	}
	this.length = str.length;
	this.toString = function() {return str;}
	this.valueOf = this.toString;
	this.charAt = function (i) {
		i = parseInt(i);
		if (isNaN(i)) return this[0];
		if (i < 0 || i >= this.length) {
			return "";
		}
		return this[i];
	};
	this.concat = function(nextPart) {
		return str + nextPart;
	};
	this.slice = function(start, end) {
		if (end < 0) end = this.length + end;
		if (end > this.length) end = this.length;
		if (start < 0 || end <= start) return "";
		var result = "";
		for (var i = start; i < end; i++) {
			result += this[i];
		}
		return result;
	};
	this.split = function(seperator) {
		var parts = [];
		var lastIndex = 0;
		var myString = this;
		str.replace(new RegExp(seperator, "g"), function() {
			var index = arguments[1];
			parts.push(myString.slice(lastIndex, index));
			lastIndex = index + 1;
		});
		parts.push(this.slice(lastIndex, s.length));
		return parts;
	}
	this.reverse = function() {
		var result = "";
		for (var i = this.length - 1; i >= 0; i--) {
			result += this[i];
		}
		return result;
	};
}