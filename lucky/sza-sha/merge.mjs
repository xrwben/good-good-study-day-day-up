import { writeFileSync, readFileSync } from 'node:fs'


const mergeData = async () => {
	const date = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')
	try {
		const list = JSON.parse(readFileSync(`${date}.json`, 'utf8') || [])
		const stockMap = JSON.parse(readFileSync('data.json', 'utf8') || {})
		list.forEach(item => {
			if (!stockMap[item.name]) {
				stockMap[item.name] = []
			}
			stockMap[item.name].push({
				...item,
				date
			})
		})
		writeFileSync(`data.json`, JSON.stringify(stockMap, null, 2), 'utf8')
	} catch (err) {
		console.log(err)
	}

}

mergeData()