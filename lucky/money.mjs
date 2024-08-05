import { readFileSync } from 'node:fs'

const content = readFileSync('./shuangseqiu.json', 'utf8')
console.log(typeof content)

const list = JSON.parse(content).slice(0, 30)
console.log(list)

let redArr = []
let blueArr = []

list.forEach(item => {
	const red = item.red.split(',')
	const blue = item.blue
	redArr.push(...red)
	blueArr.push(blue)
})

console.log(redArr, blueArr)

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
console.log('红球>>>>', redMap)

const redEntries = Array.from(redMap.entries())
const redSort = redEntries.sort((a, b) => {
	return a[0] - b[0]
})
console.log(redSort)
// console.log(new Map(redSort), list.length)


const redWeight = redEntries.reduce((total, current) => {
	return total + current[1]
}, 0)
// console.log(redEntries, redWeight)

// 抽红球
const drawnRed = new Set()
while (drawnRed.size < 6) {
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
blueArr.forEach(num => {
	if (blueMap.has(num)) {
		const val = blueMap.get(num)
		blueMap.set(num, val + 1)
	} else {
		blueMap.set(num, 1)
	}
})
console.log('蓝球>>>>', blueMap)

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
while (drawnBlue.size < 1) {
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