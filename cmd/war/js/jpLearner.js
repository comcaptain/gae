function JPLearner() {
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！";
	
}
JPLearner.prototype = new Application();
$.extend(JPLearner.prototype, {
	executeServerAction: function(action, params, callback) {
		var jpLearner = this;
		$.ajax({
			cache: false,
			url: "ajax/" + action,
			data: params,
			success: function(data) {
				callback.call(jpLearner, data)
			}
		});
	},
	main: function(optionStr) {
		this.executeServerAction("retrieveWordSetList", {}, function(wordSets) {
			this.wordSets = wordSets;
			var message = "There're total " + wordSets.length + " wordsets:";
			this.displayMessage(message);
			var tableMessage = new CmdDisplayTable(3);
			tableMessage.withBorder = true;
			tableMessage.addTr(["ID", "name", "description"]);
			for (var i in wordSets) {
				tableMessage.addTr([i, wordSets[i]["name"], wordSets[i]["description"]]);
			}
			this.displayMessage(new CmdMessage(tableMessage));
			this.next("Please enter the id:", this.selectWordSet);
		});
	},
	selectWordSet: function(optionStr) {
		
	}
});
JPLearner.prototype.constructor = JPLearner;