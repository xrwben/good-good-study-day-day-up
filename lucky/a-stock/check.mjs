import { readFileSync } from 'node:fs'

const check = (date) => {
    const currentDate = new Date()
    const fDate = date ? date : `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`
    const curData = readFileSync(`${fDate}.json`, 'utf-8')
    const stockList = JSON.parse(curData)
    const filterData = readFileSync('filter.json', 'utf-8')
    const filterList = JSON.parse(filterData).map(item => item.code)

    const ups = stockList.filter(stock => {
        return new Set(filterList).has(stock.code) && stock.pricechange > 0
    })

    const downs = stockList.filter(stock => {
        return new Set(filterList).has(stock.code) && stock.pricechange <= 0
    })

    console.log('下跌股票==>', downs, downs.length)
    console.log('上涨股票==>', ups, ups.length)
    console.log('胜率==>', filterList.length, ups.length / filterList.length)

}
check()