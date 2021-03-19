import foo from "./foo.js";
import { version, name } from "../package.json";

export var cl = function () {
	console.log(foo);
	console.log(`version:${version}`);
	console.log(`name:${name}`);
}

export default {
	cl,
	foo,
	version,
	name
}