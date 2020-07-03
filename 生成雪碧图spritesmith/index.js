const path = require("path");
const fse = require("fs-extra");
const spritesmith = require("spritesmith");
const chalk = require("chalk");

/*	
	要生成的less文件格式如下：
	.getSprite (@w, @h, @posx, @posy) {
	    background-position: (@posx * -1)/@bf (@posy * -1)/@bf;
	    width: @w/@bf;
	    height: @h/@bf;
	}

	.set_gift_sprite () {
	    .gift-s {
	        background: url('./images/gift.png') no-repeat;
	        background-size: 614/@bf 550/@bf;
	        font-size: 0px;
	        display: block;
	    }
	    .g-bx { .getSprite(110, 109, 166, 402); }
	}
	.set_gift_sprite();
*/


// 要压缩的文件放在这个文件夹里、可以有子目录
const SPRITEDIR = path.resolve(__dirname, "./sprites");
// 压缩后的文件放在此文件夹
const IMAGEDIST = path.resolve(__dirname, "./.sprites");

let SPRITELESS = [
`.getSprite (@w, @h, @posx, @posy) {
	background-position: @posx/@bf @posy/@bf;
	width: @w/@bf;
	height: @h/@bf;
}`
]

// 雪碧图生成方法
function setSpritesmith (images, files='sprites') {
	return new Promise((resolve, reject) => {
		spritesmith.run({
			// src: [
			//     __dirname + '/sprites/sprite-icon/first.png',
			//     __dirname + '/sprites/sprite-icon/second.png',
			//     __dirname + '/sprites/sprite-icon/third.png',
			//     __dirname + '/sprites/sprite-icon/live.png'
			// ],
			src: images,
			padding: 10
		}, (err, result) => {
			if (err) {
				reject(err);
			}
			// 生成文件
			fse.writeFile(path.resolve(IMAGEDIST, `${files}.png`), result.image).then(() => {
				resolve({
					coordinates: result.coordinates,
					properties: result.properties
				})
			}).catch((err) => {
				reject(err)
			})

		});

	})

}

// 获取文件夹下的图片文件
async function getDirImage (dirPath, deepDir) {
	// 读取目录下的内容
	const files = await fse.readdir(dirPath);
	console.log("目录>>>", files);
	const images = [];
	const len = files.length;
	for (let i = 0; i < len; i++) {
		const filePath = path.resolve(dirPath, files[i]);
		const stat = await fse.stat(filePath);
		// 如果是文件则吧文件路径返回出去
		if (stat.isFile()) {
			images.push(filePath);
		}
		// 如果是目录则去再次读取该目录下的图片路径
		if (stat.isDirectory() && deepDir) {
			// getSprite(filePath);
			deepDir(filePath)
		}
	}
	return images;
}

async function getSprite (dirPath) {
	let images = await getDirImage(dirPath);
	console.log("目录下图片>>", images);
	if (images.length) {
		// 如果图片存在则调用生成雪碧图方法
		let imgData = await setSpritesmith(images, path.basename(dirPath));
		let lessData = await setSpritesLess(imgData, path.basename(dirPath));
		SPRITELESS.push(lessData);
	}
}

// 生成样式函数
async function setSpritesLess (data, className='sprites') {
	const { coordinates, properties } = data
	// 设置个图片的样式
	const imgClass = Object.keys(coordinates).map(file => {
		return `.${path.basename(file, ".png")} { .getSprite(${coordinates[file].width}, ${coordinates[file].height}, -${coordinates[file].x}, -${coordinates[file].y}); }`;
	}).join('\n\t');

	return `
.set_${className}_sprite () {
	.${className}-s {
		background: url('./images/${className}.png') no-repeat;
		background-size: ${properties.width}/@bf ${properties.height}/@bf;
		font-size: 0px;
		display: block;
	}
	${imgClass}
}
.set_${className}_sprite();
	`
}

// 开始主体函数
async function start () {
	console.log(chalk.blue("开始压缩...."));
	
	if (!fse.existsSync(SPRITEDIR)) {
		console.log(chalk.red("目录不存在！！！"));
		process.exit();
	}

	// console.log(fse.existsSync(IMAGEDIST));
	fse.ensureDir(IMAGEDIST);
	
	let images = await getDirImage(SPRITEDIR, async (dir) => {
		console.log(dir)
		let deepImages = await getDirImage(dir);
		if (deepImages.length) {
		// 如果图片存在则调用生成雪碧图方法
		let imgData = await setSpritesmith(deepImages, path.basename(dir));
		let lessData = await setSpritesLess(imgData, path.basename(dir));
		SPRITELESS.push(lessData);
	}
	});

	if (images.length) {
		// 如果图片存在则调用生成雪碧图方法
		let imgData = await setSpritesmith(images);
		let lessData = await setSpritesLess(imgData);
		SPRITELESS.push(lessData);
	}
	// console.log("SPRITELESS>>>>>", SPRITELESS);

	fse.writeFile(path.resolve(__dirname, "./sprite.less"), SPRITELESS.join("\n\t"), (err) => {
		if (err) {
			console.log(chalk.red("sprite.less样式生成失败"));
			throw err;
		}
		console.log(chalk.green("雪碧图生成完成！"))
	});
}


start();