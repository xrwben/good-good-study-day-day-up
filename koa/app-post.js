const Koa = require("Koa");
const app = new Koa();

const bodyParser = require("koa-bodyparser"); // 用来处理post请求
app.use(bodyParser());

/*
	方法一：通过解析上下文context中的原生node.js请求对象req，将POST表单字符串数据解析出来

	方法二：koa-bodyparser第三方插件
*/

app.use(async (ctx, next) => {
	if (ctx.url === "/" && ctx.method === "GET") {
		ctx.response.body = `
			<h1>登录</h1>
	        <form action="/" method="post">
	            <p>Name: <input name="name" value=""></p>
	            <p>Password: <input name="password" type="password"></p>
	            <p><input type="submit" value="Submit"></p>
	        </form>
	    `;

	} else if (ctx.url === '/' && ctx.method === 'POST') {
		/*// 原生方法
		let postData = "";
		ctx.req.addListener('data', (data) => {
			postData += data
		})
		ctx.req.addListener("end", () => {
			console.log("postData>>>>>>>", postData)
		})*/


		// koa-bodyparser插件
		ctx.body = ctx.request.body
	}
})





app.listen(3000, () => {
	console.log("程序正在3000端口运行...")
})