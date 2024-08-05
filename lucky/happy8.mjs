import { readFileSync } from 'node:fs'

const content = readFileSync('./kuaileba.json', 'utf8')
console.log(typeof content)

const list = JSON.parse(content).slice(0, 100)
console.log(list)

let redArr = []

list.forEach(item => {
	const red = item.split(',')
	redArr.push(...red)
})

// console.log(redArr)

// ---------------------处理红球---------------------------
const redMap = new Map()
redArr.forEach(num => {
	if (redMap.has(num)) {
		const val = redMap.get(num)
		redMap.set(num, val + 1)
	} else {
		redMap.set(num, 1)
	}
})
// console.log('统计>>>>', redMap)

const redEntries = Array.from(redMap.entries())
const redSort = redEntries.sort((a, b) => {
	return a[0] - b[0]
})
console.log(redSort)
// console.log(new Map(redSort), list.length)


// const numSort = redEntries.sort((a, b) => {
// 	return a[1] - b[1]
// })
// console.log(numSort)

const redWeight = redEntries.reduce((total, current) => {
	return total + current[1]
}, 0)

// 抽红球
const lotteryDrawRed = () => {
	const drawnRed = []
	while (drawnRed.length < 10) {
	    const randomValue = Math.random() * redWeight
	    let cumulativeWeight = 0

	    for (const [key, value] of redSort) {
	        cumulativeWeight += value
	        if (randomValue <= cumulativeWeight) {
	        	if (!drawnRed.includes(key)) {
	            	drawnRed.push(key)
	        	}
	            break
	        }
	    }
	}
	return [...drawnRed]
}
const moneyCome = (times = 1) => {
	let _redArr = []
	let flag = true
	while (flag) {
		// console.log(`还有${times}次`)
		_redArr = _redArr.concat(lotteryDrawRed())
		times = times - 1
		if (times <= 0) {
			flag = false
			const _redMap = new Map()
			_redArr.forEach(num => {
				if (_redMap.has(num)) {
					const val = _redMap.get(num) + 1
					_redMap.set(num, val)
				} else {
					_redMap.set(num, 1)
				}
			})
			const _redSort = Array.from(_redMap.entries()).sort((a, b) => {
				return b[1] - a[1]
			})
			console.log('红红红>>>', _redSort)
			console.log('happy8 财富号码>>>>>>', _redSort.slice(0, 10).map(key => key[0]))
		}
	}
}
moneyCome(1)