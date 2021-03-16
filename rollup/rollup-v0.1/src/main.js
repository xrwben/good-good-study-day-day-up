import foo from "./foo.js";
import { version, name } from "../package.json";

export default () => {
	console.log(foo);
	console.log(`version:${version}`);
	console.log(`name:${name}`);
}