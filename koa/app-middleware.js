const Koa = require("Koa");
const app = new Koa();

app.use((ctx, next) => {
	next(); // 执行中间件时，没有next()则不会往下执行中间件
	// console.log("app>>>>>>", app)
	/*
		{
			subdomainOffset: 2,
			proxy: false,
			env: 'development' 
		}
	*/
	// console.log("ctx>>>>>>", ctx)
	/*
		{
			request: { 
				method: 'GET',
			    url: '/',
			    header: { 
			     	host: 'localhost:3000',
			        connection: 'keep-alive',
			        pragma: 'no-cache',
			        'cache-control': 'no-cache',
			        'upgrade-insecure-requests': '1',
			        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
			        'sec-fetch-user': '?1',
			        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*//*;q=0.8,application/signed-exchange;v=b3',
			        'sec-fetch-site': 'cross-site',
			        'sec-fetch-mode': 'navigate',
			        'accept-encoding': 'gzip, deflate, br',
			        'accept-language': 'zh-CN,zh;q=0.9'
			    }
			},
			response: { 
				status: 200,
			    message: 'OK',
			    header: { 
			    	'content-type': 'text/plain; charset=utf-8',
			        'content-length': '11' 
			    }
			},
			app: { subdomainOffset: 2, proxy: false, env: 'development' },
			originalUrl: '/',
			req: '<original node req>',
			res: '<original node res>',
			socket: '<original node socket>' 
		}

	*/
	// console.log("next>>>>>>>>", next)
	/*
		function () { [native code] }
	*/
})

/*
	中间件的使用
*/
app.use(async (ctx, next) => {
	await next();
	console.log(`${ctx.request.method} ${ctx.request.url}`);
})

app.use(async (ctx, next) => {
	const start = new Date().getTime();
	await next();
	const ms = new Date().getTime() - start;
	console.log(`Time: ${ms}ms`)
})

app.use(async (ctx, next) => {
	await next();  // 最后一个中间件是否需要执行next()
	ctx.response.type = "text/html";
	ctx.response.body = "<h3>Hello Liben</h3>";
})



app.listen(3000, () => {
	console.log("app运行在3000端口...")
})