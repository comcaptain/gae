//layers:
//{
//  "line": {
//      "data": [1, 2, 3],
//      "option": {}
//  }
//}
//options:
//{
//  "width": 800,
//  "height": 600,
//  "labels": [
//    "age1",
//    "age2",
//    "age3"
//  ]
//}
function checkDataAndGetMaxMinValue(layers, dataCount) {
	var max = 0, min = 0;
	for (var type in layers) {
		var data = layers[type]["data"];
		if (dataCount != data.length) {
			throw "data count and label count should be exactly the same.";
		}
		for (var i in data) {
			int value = parseInt(data[i]);
			if (value > max) max = value;
			if (value < min) min = value;
		}
	}
	return [min, max];
}
function printAxis(min, max, options) {
	//y axis
	
}
Raphael.fn.chart = function(options, layers) {
	var paper = this;
	var labels = options["labels"];
	var minmax = checkDataAndGetMaxMinValue(layers, labels.length);
	var min = minmax[0];
	var max = minmax[1];
	printAxis(min, max, options);
}