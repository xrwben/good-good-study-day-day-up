function log (ctx) {
	console.log("日志中间件>>>>>>", ctx.method, ctx.header.host + ctx.url)
}

module.exports = function () {
	return async function (ctx, next) {
		log(ctx);
		await next();
	}
}