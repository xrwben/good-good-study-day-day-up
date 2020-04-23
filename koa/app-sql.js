const Koa = require("Koa");
const path = require("path");
const fs = require("fs");
const koaStatic = require("koa-static");
const koaView = require("koa-views");
const mysql = require("./db.js");

const app = new Koa();


// 初始化sql
let basePath = path.join(__dirname, './sql');
let sqlFiles = fs.readdirSync(basePath);
console.log(sqlFiles);
for (let key of sqlFiles) {
	console.log(path.join(__dirname, './sql', key));
	let sqlContent = fs.readFileSync(path.join(__dirname, './sql', key));
	console.log(sqlContent.toString())

	mysql(sqlContent.toString()).then((rows) => {
		// console.log(rows)
		console.log(key + "脚本执行成功...")
	}).catch((error) => {
		console.log(error)
		console.log(key + "脚本执行失败...")
	})
}


// 静态资源加载中间件 路径和配置参数
app.use(koaStatic(
	path.join(__dirname, "./static")
))

// 加载模板引擎
app.use(koaView(path.join(__dirname, './view'), {
	extension: "ejs"
}))

app.use(async (ctx) => {
	let sql = "select * from _mysql_session_store";
	let resData = await mysql(sql);
	console.log(resData[0].data)
	await ctx.render("index.ejs", {
		title: 'ejs模板',
		name: 'czb',
		session: resData[0]
	})
})




app.listen("3000", () => {
	console.log("程序正在3000端口运行...");
})