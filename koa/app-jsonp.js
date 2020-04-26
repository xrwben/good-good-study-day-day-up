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

app.use(async (ctx, next) => {
	if (ctx.url.indexOf('/jsonp') > -1 && ctx.method === "GET") {
		
		let callback = ctx.query.callback || 'callback';
		console.log(callback);
		let returnData = {
			success: true,
			data: {
				text: '这是一个jsonp接口',
				time: new Date().getTime()
			}
		};
		ctx.type = 'text/javascript'
		ctx.body = callback + '(' + JSON.stringify(returnData) + ')';
	}
	await next();
})

/*
	客户端调用
	<script type="text/javascript">
		function getResult(data) {
			console.log("jsonp>>>>", data)
			alert(data)
		}
	</script>
	<script src="http://127.0.0.1:3000/jsonp?callback=getResult" type="text/javascript"></script>
*/

// app.use(async (ctx) => {
// 	await ctx.render("index.ejs", {
// 		title: 'ejs模板',
// 		name: 'czb',
// 		session: {
// 			data: Math.random().toString(36).substr(2)
// 		}
// 	})
// })




app.listen(3000, () => {
	console.log("程序正在3000端口运行...")
})