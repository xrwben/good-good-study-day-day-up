import fs from 'fs'
import path from 'path'

const projectName = 'sdc_web'
const description = '描述'

const cwd = process.cwd()
const srcDir = path.resolve(cwd, './srcDir')
const targetDir = path.resolve(cwd, 'destinationDir')
console.log(srcDir, targetDir)

const copy = (srcDir, targetDir) => {
	const files = fs.readdirSync(srcDir)
	console.log(files)

	files.forEach(file => {
		const _path = path.resolve(srcDir, file)
		const _target = path.resolve(targetDir, file)
		if (fs.statSync(_path).isDirectory()) {
			console.log(file, '-> 文件夹')
			fs.mkdirSync(_target, { recursive: true })
			copy(_path, _target)
		} else {
			console.log(file, '-> 文件')
			fs.copyFileSync(_path, _target)
		}
	})
}

copy(srcDir, targetDir)

const pkgPath = path.resolve(targetDir, './package.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
pkg.name = projectName
console.log('pkg>>>>', pkg)

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))