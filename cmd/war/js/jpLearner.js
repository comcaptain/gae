function JPLearner() {
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！"
}
JPLearner.prototype = new Application();
$.extend(JPLearner.prototype, {
});
JPLearner.prototype.constructor = JPLearner;