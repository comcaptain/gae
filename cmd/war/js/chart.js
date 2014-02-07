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