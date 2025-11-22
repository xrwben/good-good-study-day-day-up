import { writeFileSync, readFileSync } from 'node:fs'

const mergeData = (date) => {
    const currentDate = new Date()
    const fDate = date ? date : `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`
    const curData = readFileSync(`${fDate}.json`, 'utf-8')
    const stockData = readFileSync('data.json', 'utf-8')
    // console.log('---', stockData, typeof stockData)
    if (!curData || !stockData) {
        console.log('----------------- 当日数据或总数据不存在,请确认数据再操作 --------------')
        return
    }
    const list = JSON.parse(curData)
    const stockMap = JSON.parse(stockData)

    list.forEach(item => {
        const stock = stockMap[item.name]
        if (!stock) {
            stockMap[item.name] = []
        }
        if (stockMap[item.name].find(item => item.date === fDate)) {
            console.log('======== 已存在历史数据 ===========')
            return
        }
        stockMap[item.name].push({
            ...item,
            date: fDate
        })
        const len = stockMap[item.name].length
        if (len > 5) {
            stockMap[item.name] = stockMap[item.name].slice(len - 5)
        }
    })
    // console.log(stockMap, typeof JSON.stringify(stockMap))

    writeFileSync('data.json', JSON.stringify(stockMap, null, 2), 'utf-8')
}
mergeData()