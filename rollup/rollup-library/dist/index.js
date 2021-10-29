(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.dll = factory());
}(this, (function () { 'use strict';

	const name = 'liben';

	const getName = () => {
		console.log('name is liben !!!');
	};

	var index = {
		name,
		getName
	};

	return index;

})));
