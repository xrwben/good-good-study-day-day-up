// 快乐8
const lotteryDrawHappy8 = () => {
	let drawnRed = []
	const times = 10
	while (drawnRed.length < times) {
	    const key = Math.ceil(Math.random() * 80)

	    if (!drawnRed.includes(key)) {
        	drawnRed.push(key)
    	} else {
    		drawnRed.push(key + 1)
    	}
	}
	return drawnRed
}

console.log('第一注：', lotteryDrawHappy8())
console.log('第二注：', lotteryDrawHappy8())
console.log('第三注：', lotteryDrawHappy8())