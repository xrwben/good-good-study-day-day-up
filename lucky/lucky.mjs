import { readFileSync } from 'node:fs'

const content = readFileSync('./daletou.json', 'utf8')
console.log(typeof content)

const list = JSON.parse(content)

let redArr = []
let blueArr = []

list.forEach(item => {
	const num = item.split(' ')
	const red = num.slice(0, 5)
	const blue = num.slice(5, 7)
	redArr.push(red)
	blueArr.push(blue)
})

console.log(redArr, blueArr)


// ---------------------处理红球---------------------------
const redMap = new Map()
const redFlat = redArr.flat()
redFlat.forEach(num => {
	if (redMap.has(num)) {
		const val = redMap.get(num)
		redMap.set(num, val + 1)
	} else {
		redMap.set(num, 1)
	}
})
// console.log('红球>>>>', redMap)

const redEntries = Array.from(redMap.entries())
const redSort = redEntries.sort((a, b) => {
	return a[0] - b[0]
})
// console.log(redSort)
// console.log(new Map(redSort), list.length)


const redWeight = redEntries.reduce((total, current) => {
	return total + current[1]
}, 0)
// console.log(redEntries, redWeight)

// 抽红球
const drawnRed = new Set()
while (drawnRed.size < 5) {
    const randomValue = Math.random() * redWeight
    // console.log(randomValue)
    let cumulativeWeight = 0

    for (const [key, value] of redSort) {
        cumulativeWeight += value
        if (randomValue <= cumulativeWeight) {
            drawnRed.add(key)
            break
        }
    }
}
// console.log([...drawnRed])

// ---------------------处理蓝球---------------------------
const blueMap = new Map()
const blueFlat = blueArr.flat()
blueFlat.forEach(num => {
	if (blueMap.has(num)) {
		const val = blueMap.get(num)
		blueMap.set(num, val + 1)
	} else {
		blueMap.set(num, 1)
	}
})
// console.log('蓝球>>>>', blueMap)

const blueEntries = Array.from(blueMap.entries())
const blueSort = blueEntries.sort((a, b) => {
	return a[0] - b[0]
})
// console.log(blueSort)
// console.log(new Map(blueSort), list.length)

const blueWeight = blueEntries.reduce((total, current) => {
	return total + current[1]
}, 0)
// console.log(blueEntries, blueWeight)

// 抽蓝球
const drawnBlue = new Set()
while (drawnBlue.size < 2) {
    const randomValue = Math.random() * blueWeight
    let cumulativeWeight = 0

    for (const [key, value] of blueSort) {
        cumulativeWeight += value
        if (randomValue <= cumulativeWeight) {
            drawnBlue.add(key)
            break
        }
    }
}
// console.log([...drawnBlue])

console.log('财富号码>>>>>>', [...drawnRed],  [...drawnBlue])

const lotteryDrawRed = () => {
	const drawnRed = []
	while (drawnRed.length < 5) {
	    const randomValue = Math.random() * redWeight
	    let cumulativeWeight = 0

	    for (const [key, value] of redSort) {
	        cumulativeWeight += value
	        if (randomValue <= cumulativeWeight) {
	            drawnRed.push(key)
	            break
	        }
	    }
	}
	return [...drawnRed]
}
const lotteryDrawBlue = () => {
	const drawnBlue = []
	while (drawnBlue.length < 2) {
	    const randomValue = Math.random() * blueWeight
	    let cumulativeWeight = 0

	    for (const [key, value] of blueSort) {
	        cumulativeWeight += value
	        if (randomValue <= cumulativeWeight) {
	            drawnBlue.push(key)
	            break
	        }
	    }
	}
	return [...drawnBlue]
}
const moneyCome = (times = 1) => {
	// console.log(lotteryDrawRed(), lotteryDrawBlue())
	let _redArr = []
	let _blueArr = []
	let flag = true
	while (flag) {
		// console.log(`还有${times}次`)
		_redArr = _redArr.concat(lotteryDrawRed())
		_blueArr = _blueArr.concat(lotteryDrawBlue())
		times = times - 1
		if (times <= 0) {
			flag = false

			// console.log('必发财>>>>', _redArr, _blueArr)
			const _redMap = new Map()
			const _blueMap = new Map()
			_redArr.forEach(num => {
				if (_redMap.has(num)) {
					const val = _redMap.get(num) + 1
					_redMap.set(num, val)
				} else {
					_redMap.set(num, 1)
				}
			})
			_blueArr.forEach(num => {
				if (_blueMap.has(num)) {
					const val = _blueMap.get(num) + 1
					_blueMap.set(num, val)
				} else {
					_blueMap.set(num, 1)
				}
			})
			// console.log('map>>>>', _redMap, _blueMap)
			const _redSort = Array.from(_redMap.entries()).sort((a, b) => {
				return b[1] - a[1]
			})
			const _blueSort = Array.from(_blueMap.entries()).sort((a, b) => {
				return b[1] - a[1]
			})
			console.log(_redSort, _blueSort)
			console.log('红红红>>>', _redSort.slice(0, 5))
			console.log('蓝蓝蓝>>>', _blueSort.slice(0, 2))
		}
	}
	// const money = (times) => {
	// 	// console.log(`还有${times}次`)
	// 	_redArr = _redArr.concat(lotteryDrawRed())
	// 	_blueArr = _blueArr.concat(lotteryDrawBlue())
	// 	times = times - 1
	// 	if (times <= 0) {
	// 		console.log('必发财>>>>', _redArr, _blueArr)
	// 		const _redMap = new Map()
	// 		const _blueMap = new Map()
	// 		_redArr.forEach(num => {
	// 			if (_redMap.has(num)) {
	// 				const val = _redMap.get(num) + 1
	// 				_redMap.set(num, val)
	// 			} else {
	// 				_redMap.set(num, 1)
	// 			}
	// 		})
	// 		_blueArr.forEach(num => {
	// 			if (_blueMap.has(num)) {
	// 				const val = _blueMap.get(num) + 1
	// 				_blueMap.set(num, val)
	// 			} else {
	// 				_blueMap.set(num, 1)
	// 			}
	// 		})
	// 		const _redSort = Array.from(_redMap.entries()).sort((a, b) => {
	// 			return b[1] - a[1]
	// 		})
	// 		const _blueSort = Array.from(_blueMap.entries()).sort((a, b) => {
	// 			return b[1] - a[1]
	// 		})
	// 		console.log(_redSort, _blueSort)
	// 		console.log('红红红>>>', _redSort.slice(0, 5))
	// 		console.log('蓝蓝蓝>>>', _blueSort.slice(0, 2))
	// 		return
	// 	}
	// 	money(times)
	// }
	// money(times)
}
// moneyCome(567)