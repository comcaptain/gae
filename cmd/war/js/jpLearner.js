function JPLearner() {
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！";
	this.wordSet = null;
	this.chosenLessons = [];
	this.chosenWords = [];
	this.words = [];
	this.chineseVisible = false;
	this.hiraganaVisible = false;
	this.kanjiVisible = false;
	this.currentWord = null;
}
JPLearner.prototype = new Application();
$.extend(JPLearner.prototype, {
	organizeWordsByLesson: function() {
		lessonOrganizedList = [];
		for (var i in this.words) {
			var word = this.words[i];
			var lessonNo = word["lessonNo"];
			if (typeof lessonOrganizedList[lessonNo] != "undefined") {
				lessonOrganizedList[lessonNo].push(word)
			}
			else {
				lessonOrganizedList[lessonNo] = [word];
			}
		}
		this.words = lessonOrganizedList;
	},
	showWords: function(showAll, words) {
		
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
			this.organizeWordsByLesson();
			this.displayMessage(new CmdMessage("WordSet " + this.wordSet["name"] + " has been loaded.\n" + 
					"There're " + this.words.length + " words in this wordSet.", "green"));
			this.next("You can choose any lessons in 1-" + (this.words.length - 1) + ", e.g. 1 2 7-8", this.selectLessons);
		})
	},
	selectLessons: function(optionStr) {
		var lessonParts = optionStr.trim().split(/\s+/);
		try {
			this.chosenLessons = [];
			this.chosenWords = [];
			var duplicate = {};
			for (var i in lessonParts) {
				var lessonPart = lessonParts[i];
				if (/^\d+$/.test(lessonPart)) {
					var lesson = parseInt(lessonPart);
					if (this.words[lesson]) {
						if (typeof duplicate[lesson] == "undefined") {
							duplicate[lesson] = 1;
						}
						else {
							continue;
						}
						this.chosenLessons.push(lesson);
						this.chosenWords = this.chosenWords.concat(this.words[lesson]);
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
						if (this.words[lesson]) {
							if (typeof duplicate[lesson] == "undefined") {
								duplicate[lesson] = 1;
							}
							else {
								continue;
							}
							this.chosenLessons.push(lesson);
							this.chosenWords = this.chosenWords.concat(this.words[lesson]);
						}
					}
				}
			}
			if (this.chosenLessons.length == 0) throw "error";
		}
		catch(e) {
			throw "Invalid lesson list, please enter again:"
		}
		this.displayMessage(this.chosenLessons.length + " lesson(s) and " + this.chosenWords.length + " word(s) have been selected.");
		this.next("Please choose the visible word parts: c(Chinese中国語) h(hiragana平仮名) kanji(kanji漢字)," + 
				" e.g. ch, means only show Chinese and hiragana",this.selectVisibleParts);
	},
	selectVisibleParts: function(optionStr) {
		optionStr = optionStr.replace(/\s/g, "");
		if (!/^[chk]+$/.test(optionStr)) throw "Invalid, please enter again:";
		if (optionStr.search("c") >= 0) this.chineseVisible = true;
		if (optionStr.search("h") >= 0) this.hiraganaVisible = true;
		if (optionStr.search("k") >= 0) this.kanjiVisible = true;
		this.next("", this.startLearning);
	},
	startLearning: function(optionStr) {
		
	}
});
JPLearner.prototype.constructor = JPLearner;