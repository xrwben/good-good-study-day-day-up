const Koa = require("Koa");
const app = new Koa();

app.use(async (ctx, next) => {
	let url = ctx.url;
	console.log(ctx.request.url)

	/*
		ctx.query 等同于 ctx.request.query

		query返回对象 querystring返回字符串
		
	*/

	ctx.body = {
		url,
		req_query: ctx.request.query,
		req_querystring: ctx.request.querystring,
		ctx_query: ctx.query,
		ctx_querystring: ctx.querystring
	}

	/*	
		{
			"url":"/page/user?a=1&b=2",
			"req_query":{
				"a":"1",
				"b":"2"
			},
			"req_querystring":"a=1&b=2",
			"ctx_query":{
				"a":"1",
				"b":"2"
			},
			"ctx_querystring":"a=1&b=2"
		}
	*/
})

app.listen(3000, () => {
	console.log("程序正在3000端口运行...")
})