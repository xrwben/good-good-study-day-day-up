'use strict';

var foo = "hello world!";

var name = "rollup-v0.1";
var version = "1.0.0";

function main () {
	console.log(foo);
	console.log(`version:${version}`);
	console.log(`name:${name}`);
}

module.exports = main;
