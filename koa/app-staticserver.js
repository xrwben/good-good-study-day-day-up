const Koa = require("Koa");
const path = require("path");
const fs = require("fs");
const koaStatic = require("koa-static");

const app = new Koa();


/*
	方法一： fs mime
	
	方法二： koa-static插件
*/
// 静态资源加载中间件 路径和配置参数
/*app.use(koaStatic(
	path.join(__dirname, "./static"), {
		index: 'index.html'
	}
))*/

// 自己实现静态资源服务
app.use(async (ctx, next) => {
	let staticPath = path.join(__dirname, "./static");
	console.log(__dirname, staticPath);

	fs.readdir(staticPath, (err, files) => {
		console.log(files)
	})
	ctx.body = files
})




app.listen("3000", () => {
	console.log("程序正在3000端口运行...");
})