const Koa = require("Koa");
const path = require("path");
const fs = require("fs");
const koaStatic = require("koa-static");
const koaView = require("koa-views");

const app = new Koa();


// 静态资源加载中间件 路径和配置参数
app.use(koaStatic(
	path.join(__dirname, "./static")
))

// 加载模板引擎
app.use(koaView(path.join(__dirname, './view'), {
	extension: "ejs"
}))

app.use(async (ctx) => {
	await ctx.render("index.ejs", {
		title: 'ejs模板',
		name: 'czb'
	})
})




app.listen("3000", () => {
	console.log("程序正在3000端口运行...");
})