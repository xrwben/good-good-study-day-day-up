export let a = "liben" // or export default a;

// let a1 = "liben"

// export a1;  // 报错 Uncaught SyntaxError: Unexpected token 'export'因为没有提供对外的接口, 要么export default a1 或者 export {a1}

export function liben () {
	console.log("123")
}
// 上面liben等同于
// export let liben = function () {
// 	console.log("123")
// }

export default function () {
	console.log("default")
}