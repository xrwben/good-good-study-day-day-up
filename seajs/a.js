define(function(require, exports, module) {
	module.exports = {
		text: "7788 a.js文件",
		init: function() {
			let textContent = [
				'yes it works',
	            'seajs demo',
	            'it is a lucky day',
	            'wish this help you',
	            'thank you for reading'
			];
			let _index = Math.floor(Math.random()*textContent.length);
			return textContent[_index];
		}
	}
})