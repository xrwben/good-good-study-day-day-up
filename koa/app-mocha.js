const Koa = require("koa");

const app = new Koa();

app.use(async (ctx, next) => {
	console.log(ctx.url)

	let result = {
		success: true,
		data: null
	}

	if (ctx.method === "GET") {
		if (ctx.url === "/getString.json") {
			result.data = "this is string data";
		} else if (ctx.url === "/getNumber.json") {
			result.data = 123456;
		} else {
			result.success = false;
		}
		ctx.body = result
    	next()
	} else if (ctx.method === "POST") {
		if (ctx.url === "/postData.json") {
			result.data = "ok"
		} else {
			result.success = false
		}
		ctx.body = result
		next()
	} else {
		ctx.body = "hello world";
		next()
	}
})

app.listen("3000", () => {
	console.log("程序正在端口3000运行...");
})

module.exports = app;