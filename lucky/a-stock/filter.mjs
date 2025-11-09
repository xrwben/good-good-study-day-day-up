import { writeFileSync, readFileSync } from 'node:fs'

/*
    "symbol": "sz300071",
    "code": "300071",
    "name": "福石控股",
    "trade": "5.080", // 当前股价价
    "pricechange": 0.85, // 股价涨跌
    "changepercent": 20.095,  // 当日涨幅
    "buy": "5.080",
    "sell": "0.000",
    "settlement": "4.230", // 昨日收盘价
    "open": "4.210",  // 开盘价
    "high": "5.080", // 当日最高
    "low": "4.210", // 当日最低
    "volume": 133865946, // 成交量（手）
    "amount": 638532456, // 成交额（元）
    "ticktime": "16:29:15",
    "per": -36.286, // 市盈率
    "pb": 34.914, // 市净率
    "mktcap": 489653.242688, // 总市值
    "nmc": 480238.239928, // 流通市值
    "turnoverratio": 14.16045, // 换手率，计算公式为成交量/流通股本×100%，反映股票流通性强弱
    "date": "2025-10-31"
*/ 
const filterResult = () => {
    const data = readFileSync(`data.json`, 'utf-8')
    const stockMap = JSON.parse(data)
    const list = []
    for (let key in stockMap) {
        const stock = stockMap[key]
        const len = stock.length
        if (len < 2) {
            continue
        }
        const pre = stock[len - 2]
        const cur = stock[len - 1]

        // 成交额2倍 成交量2倍 当日(最低价-开盘)/卡盘 < 0.1
        if ((cur.amount / pre.amount) > 2 && 
            (cur.volume / pre.volume) > 3 &&
            pre.changepercent > 0 &&
            cur.pricechange > 0 && 
            // cur.trade <= 25 && 
            cur.trade > cur.open &&
            pre.trade > pre.open &&
            // pre.trade > (cur.high + cur.low) / 2 && 
            // cur.turnoverratio > 10 &&
            cur.symbol.indexOf('bj') === -1) {
            list.push({
                name: key,
                code: cur.code,
                price: cur.trade,
                changepercent: cur.changepercent
            })
            // console.log(list)
        }
    }
    console.log(list, list.length)

    writeFileSync('filter.json', JSON.stringify(list, null, 2), 'utf-8')
}
filterResult()