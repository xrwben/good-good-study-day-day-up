const Koa = require("Koa");

const app = new Koa();


/*
	ctx.cookies.get(name, [options]) 读取上下文请求中的cookie

	ctx.cookies.set(name, value, [options]) 在上下文中写入cookie
*/

app.use(async (ctx, next) => {
	if (ctx.url === '/index') {
		ctx.cookies.set('cid', 'i like you', {
			domain: 'localhost',
			path: '/index',
			maxAge: 10 * 60 * 1000, // cookie有效时长
			expires: new Date('2020-04-23'), // cookie失效时间
			httpOnly: false,
			overwrite: false
		});
		ctx.body = "set cookie";
	} else {
		ctx.body = "hello world"
	}
})




app.listen("3000", () => {
	console.log("程序正在3000端口运行...");
})