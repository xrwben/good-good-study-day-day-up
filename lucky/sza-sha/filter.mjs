import { writeFileSync, readFileSync } from 'node:fs'

/*
    "symbol": "SZ300274",
    "net_profit_cagr": 68.70509588336502, // 北向流入
    "north_net_inflow": 0,
    "ps": 4.1149,
    "type": 11,
    "percent": -6.16,  // 当前涨跌百分比
    "has_follow": false,
    "tick_size": 0.01,
    "pb_ttm": 8.631,
    "float_shares": 1589709449,
    "current": 187.19,  // 当前价格
    "amplitude": 7.21,
    "pcf": 18.3248,
    "current_year_percent": 159.52,  // 年涨幅
    "float_market_capital": 297577711758,
    "north_net_inflow_time": 1762099200000,
    "market_capital": 388084446459,
    "dividend_yield": 1.084,
    "lot_size": 100,
    "roe_ttm": 38.71783989092371,
    "total_percent": 5831.99,
    "percent5m": 0.02,
    "income_cagr": 36.997047268434024,
    "amount": 19933490355.48, // 成交额
    "chg": -12.28,  // 涨跌幅
    "issue_date_ts": 1320163200000,
    "eps": 7.39,
    "main_net_inflows": -834047540,  // 主力流入
    "volume": 103821903,   // 成交量
    "volume_ratio": 0.97,
    "pb": 8.631,
    "followers": 1163650,
    "turnover_rate": 6.53,  // 换手率
    "mapping_quote_current": null,
    "first_percent": 13.84,
    "name": "阳光电源",
    "pe_ttm": 25.335,
    "dual_counter_mapping_symbol": null,
    "total_shares": 2073211424,
    "limitup_days": 0
*/ 
const filterResult = () => {
    const data = readFileSync(`data.json`, 'utf-8')
    const stockMap = JSON.parse(data)
    const list = []
    for (let key in stockMap) {
        const stock = stockMap[key]
        const len = stock.length
        if (len < 2) {
            // console.log(stock)
            continue
        }
        const pre = stock[len - 2]
        const cur = stock[len - 1]

        // 成交额2倍 成交量2倍 当日(最低价-开盘)/卡盘 < 0.1
        if ((cur.amount / pre.amount) > 2 && (cur.volume / pre.volume) > 2 && Number(cur.percent) > 0 && cur.symbol.indexOf('BJ') === -1) {
            list.push({
                name: key,
                code: cur.symbol,
                price: cur.current,
                percent: cur.percent
            })
        }
    }
    console.log(list, list.length)

    writeFileSync('filter.json', JSON.stringify(list, null, 2), 'utf-8')
}
filterResult()