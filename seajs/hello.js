/*
	define()用来定义模块文件
*/

define(function(require, exports, module) {
	let changeText = require("a");
	console.log(changeText)

	let jQ = require("./js/jquery.min.js");
	console.log(">>>", jQ);

	exports.jq = jQ;

	exports.sayHello = function () {
		console.log("say hello");
	}

	exports.name = "liben";

	document.querySelector(".title").innerHTML = changeText.init();
	document.querySelector(".btn").innerHTML = changeText.init();

	// $jq(".btn").html(changeText.text);

	// module.exports = {
	// 	age: 26,
	// 	say: function() {
	// 		console.log("say 你大爷");
	// 	}
	// }
})