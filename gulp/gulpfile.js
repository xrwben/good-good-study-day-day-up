const { series, parallel, src, dest, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const gInject = require("gulp-inject");
const gHtmlmin = require("gulp-htmlmin");
const gBabel = require("gulp-babel");
const gUglify = require("gulp-uglify");
const gLess = require("gulp-less");
const gAutoprefixer = require("gulp-autoprefixer");
const gMinifyCss = require("gulp-minify-css");
const gImagemin = require("gulp-imagemin");
const gClean = require("gulp-clean");
const gConcat = require("gulp-concat");
const gRename = require("gulp-rename");
const gPlumber = require("gulp-plumber");
const gNotify = require("gulp-notify");

const js = () => {
	return src("./src/js/**/*.js")
		.pipe(gBabel())
		.pipe(gUglify({
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		}))
		.pipe(dest("dist/js/"));
}
exports.js = js;

const css = () => {
	return src("./src/less/*.less")
		.pipe(gLess())
		.pipe(gAutoprefixer())
		// .pipe(gConcat("style.min.css"))
		.pipe(gMinifyCss())
		.pipe(dest("dist/css/"));
}
exports.css = css;

const images = () => {
	return src("./src/images/*")
		.pipe(gImagemin())
		.pipe(dest("dist/images/"));
}
exports.images = images;

const html = () => {
	return src("./src/**/*.html")
		.pipe(gInject(src([/*"./dist/js/*.js", */"./dist/css/reset.css"], { read: false})))
		.pipe(dest("dist/"));
}
exports.html = html;

const clean = () => {
	return src("./dist", {allowEmpty: true})
		.pipe(gClean());
}
exports.clean = clean;

// const watcher = () => {
// 	watch("src/**/*.html", series(html)).on("change", browserSync.reload);
// 	watch("src/less/**/*.less", series(css)).on("change", browserSync.reload);
// 	watch("src/js/**/*.js", series(js)).on("change", browserSync.reload);
// 	watch("src/images/*", series(images)).on("change", browserSync.reload);	
// }
// exports.watcher = watcher;

const devServer = () => {
	watch("src/**/*.html", series(html)).on("change", browserSync.reload);
	watch("src/less/**/*.less", series(css)).on("change", browserSync.reload);
	watch("src/js/**/*.js", series(js)).on("change", browserSync.reload);
	watch("src/images/*", series(images)).on("change", browserSync.reload);	
	browserSync.init({
		server: {
			baseDir: "dist"
		},
		port: 9999
	});
}

exports.dev = series(parallel(js, css, images, html), devServer);

exports.build = series(clean, parallel(js, css, images), html);