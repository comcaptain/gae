var isDragging = false;
var dragMouseInitialX = 0;
var dragMouseInitialY = 0;
var dragComponentInitialX = 0;
var dragComponentInitialY = 0;
var $draggingEle = null;
$(document).ready(function() {
	$(document).mouseup(function(e) {
		isDragging = false;
	});
	$(document).on("mousedown", ".draggable", function(e) {
		dragMouseInitialX = e.screenX;
		dragMouseInitialY = e.screenY;
		dragComponentInitialX = $(this).position().left;
		dragComponentInitialY = $(this).position().top;
		isDragging = true;
		$draggingEle = $(this);
	});
	$(document).on("mousemove", function(e) {
		if (isDragging) {
			$draggingEle.css("left", e.screenX - dragMouseInitialX + dragComponentInitialX);
			$draggingEle.css("top", e.screenY - dragMouseInitialY + dragComponentInitialY);
			$draggingEle.css("right", "auto");
		}
	});
	$(document).on("click", ".draggable .close", function() {
		$(this).parents(".draggable").hide();
	});
}) 
function JPLearner() {
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！";
	this.wordSet = null;
	this.chosenLessons = [];
	this.chosenWords = [];
	this.words = {};
	this.userHistory = {};
	this.chineseVisible = false;
	this.hiraganaVisible = false;
	this.kanjiVisible = false;
	this.currentWord = null;
	this.currentIndex = -1;
	this.startTime = -1;
	this.clock = -1;
	this.lastWordCompleteTime = -1;
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
	updateStatusBox: function() {
		if (!this.$statusBox) {
			var statusBoxHtml = 
				'<div class="statusArea draggable">                                                                             ' +
				'	<div class="header">                                                                                        ' +
				'		<label>STATUS</label>                                                                                   ' +
				'		<button type="button" class="close">&times;</button>                                                    ' +
				'	</div>                                                                                                      ' +
				'	<div class="body">                                                                                          ' +
				'		<div class="status">                                                                                    ' +
				'			<label>E/R</label><span class="col2 timeElapsed">0</span><span class="col3 timeRemaining">0</span>  ' +
				'		</div>                                                                                                  ' +
				'		<div class="status">                                                                                    ' +
				'			<label>Word</label><span class="col2 wordsElapsed">0</span><span class="col3 wordsInTotal">0</span> ' +
				'		</div>                                                                                                  ' +
				'		<div class="status">                                                                                    ' +
				'			<label>Speed</label><span class="col2 learningSpeed">0</span><span class="col3">s/w</span>          ' +
				'		</div>                                                                                                  ' +
				'	</div>                                                                                                      ' +
				'</div>                                                                                                         ';
			this.$statusBox = $(statusBoxHtml);
			this.$statusBox.hide();
			this.console.$consoleDiv.append(this.$statusBox);
		}
		var timeElapsed = ((new Date()).getTime() - this.startTime) / 1000;
		var wordsElapsed = this.currentIndex;
		var wordsInTotal = this.chosenWords.length;
		this.$statusBox.find(".timeElapsed").text(this.formatTime(timeElapsed));
		this.$statusBox.find(".wordsInTotal").text(wordsInTotal);
		if (wordsElapsed > 0) {
			var speed = (this.lastWordCompleteTime - this.startTime) / 1000 / wordsElapsed;
			var timeRemaining = (wordsInTotal - wordsElapsed) * speed;
			this.$statusBox.find(".timeRemaining").text(this.formatTime(timeRemaining));
			this.$statusBox.find(".wordsElapsed").text(wordsElapsed);
			this.$statusBox.find(".learningSpeed").text(Math.round(speed * 100) / 100);
		}
		this.$statusBox.show();
	},
	formatTime: function(time) {
		time = Math.round(time);
		if (time < 60) return time;
		if (time < 3600) return (Math.round(time / 60)) + ":" + time % 60;
		var second = time % 60;
		time = Math.round(time / 60);
		var min = time % 60;
		hour = Math.round(time / 60);
		return hour + ":" + min + ":" + second;
	},
	generateWordsView: function(words, showAll) {
		var displayTable = new CmdDisplayTable();
		var ths = ["lesson", "type"];
		if (this.chineseVisible || showAll) {
			ths.push("chinese");
		}
		if (this.hiraganaVisible || showAll) {
			ths.push("hiragana");
		}
		if (this.kanjiVisible || showAll) {
			ths.push("kanji");
		}
		displayTable.addTr(ths);
		for (var i in words) {
			var tr = [];
			var word = words[i];
			tr.push(word["lessonNo"]);
			tr.push(word["type"]);
			if (this.chineseVisible || showAll) {
				tr.push(word["chinese"]);
			}
			if (this.hiraganaVisible || showAll) {
				tr.push(word["hiragana"]);
			}
			if (this.kanjiVisible || showAll) {
				tr.push(word["kanji"]);
			}
			displayTable.addTr(tr);
		}
		return new CmdMessage(displayTable);
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
		this.resetLearningCycleData();
		this.startLearningCycle();
	},
	resetLearningCycleData: function() {
		this.currentIndex = -1;
		this.currentWord = null;
		this.startTime = -1;
		window.clearInterval(this.clock);
	},
	nextWord: function(optionStr) {
		this.currentIndex++;
		this.currentWord = this.chosenWords[this.currentIndex];
		if (!this.currentWord) this.finishLearningCycle();
		this.next(this.generateWordsView([this.currentWord]));
		this.updateStatusBox();
	},
	finishLearningCycle: function() {
		
	},
	startLearningCycle: function() {
		this.console.registerApplicationCommand(this.console._clearCommand());
		this.console.registerApplicationCommand(this._tickCommand("0"));
		this.console.registerApplicationCommand(this._tickCommand("y"));
		this.console.registerApplicationCommand(this._tickCommand("n"));
		this.startTime = (new Date()).getTime();
		var app = this;
		this.clock = window.setInterval(function() {
			app.updateStatusBox();
		}, 1000);
		this.nextWord();
	},
	_tickCommand: function(tick) {
		var hints = {
			"0": "Learnt",
			"y": "Test pass",
			"n": "Test failed"
		};
		var counts = {
			"0": 0,
			"y": 0,
			"n": 0
		};
		counts[tick]++;
		var app = this;
		var cmd = new Command(tick, hints[tick]);
		cmd.executeImpl = function(data) {
			var wordId = app.currentWord.wordId;
			if (typeof app.userHistory[wordId] == "undefined") {
				app.userHistory[wordId] = {
					learnCount: counts["0"],
					testCount: counts["y"] + counts["n"],
					testPassCount: counts["y"]
				};
			}
			else {
				app.userHistory[wordId] = {
					learnCount: app.userHistory[wordId].learnCount + counts["0"],
					testCount: app.userHistory[wordId].testCount + counts["y"] + counts["n"],
					testPassCount: app.userHistory[wordId].testPassCount + counts["y"]
				};
				
			}
			app.lastWordCompleteTime = (new Date()).getTime();
			app.updateStatusBox();
			app.displayMessage(this.hint);
			app.nextWord();
		}
		return cmd;
	}
});
JPLearner.prototype.constructor = JPLearner;