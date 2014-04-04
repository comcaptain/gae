function JPLearner() {
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！";
	this.wordSet = null;
	this.lessonList = [];
	this.chosenLessons = [];
	this.words = [];
}
JPLearner.prototype = new Application();
$.extend(JPLearner.prototype, {
	loadLessonList: function() {
		this.lessonList = [];
		for (var i in this.words) {
			var word = this.words[i];
			var lessonNo = word["lessonNo"];
			if (this.lessonList[lessonNo]) {
				this.lessonList[lessonNo] ++;
			}
			else {
				this.lessonList[lessonNo] = 1;
			}
		}
	},
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
		var inputIndex = parseInt(optionStr);
		var wordSet = this.wordSets[inputIndex];
		this.wordSet = wordSet;
		if (!wordSet) throw "Invalid word set id, please enter again:";
		this.executeServerAction("retrieveWordList", {wordSetId: wordSet["wordSetId"]}, function(data) {
			this.words = data;
			this.loadLessonList();
			this.displayMessage(new CmdMessage("WordSet " + this.wordSet["name"] + " has been loaded.\n" + 
					"There're " + this.words.length + " words in this wordSet.", "green"));
			this.next("You can choose any lessons in 1-" + (this.lessonList.length - 1) + ", e.g. 1 2 7-8", this.selectLessons);
		})
	},
	selectLessons: function(optionStr) {
		var lessonParts = optionStr.trim().split(/\s+/);
		try {
			this.chosenLessons = [];
			for (var i in lessonParts) {
				var lessonPart = lessonParts[i];
				if (/^\d+$/.test(lessonPart)) {
					var lesson = parseInt(lessonPart);
					if (this.lessonList[lesson]) {
						this.chosenLessons.push(lesson);
					}
				}
				else {
					var boundaries = lessonPart.split("-");
					if (boundaries.length != 2) throw "error";
					var start = parseInt(boundaries[0])
					var end = parseInt(boundaries[1])
					if (!(start && end && start <= end)) {
						throw "error";
					}
					for (var lesson = start; lesson <= end; lesson++) {
						if (this.lessonList[lesson]) {
							this.chosenLessons.push(lesson)
						}
					}
				}
			}
			if (this.chosenLessons.length == 0) throw "error";
		}
		catch(e) {
			throw "Invalid lesson list, please enter again:"
		}
		this.end(this.chosenLessons.toString());
	}
});
JPLearner.prototype.constructor = JPLearner;