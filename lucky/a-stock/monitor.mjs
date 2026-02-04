import https from 'node:https'
import { writeFileSync, readFileSync, accessSync } from 'node:fs'

const getStockFilterList = () => {
  const stockMap = JSON.parse(readFileSync(`data.json`, 'utf-8'))
  const stockList = Object.values(stockMap).map(
    (stock) => stock[stock.length - 1]
  )
  const filterList = stockList.filter((stock) => {
    const cyb = stock.code.startsWith('300') || stock.code.startsWith('301')
    const kcb = stock.code.startsWith('688')
    const bj = stock.code.startsWith('8') || stock.code.startsWith('92')
    const price = stock.trade <= 25
    return !cyb && !kcb && !bj && price
  })
  //   console.log(codeList)
  return filterList
}

const decodeGBK = (data) => {
  const utf8Buffer = Buffer.from(data, 'utf8')
  const decoder = new TextDecoder('gbk')
  return decoder.decode(utf8Buffer)
}

/**
 * 解析腾讯财经响应文本
 * 按 `;` 拆行，提取 `v_xxx="..."` 里的内容，返回 { key, fields }[]
 */
const parseResponse = (text) => {
  const lines = text.split(';').map((l) => l.trim()).filter(Boolean)
  const results = []
  for (const line of lines) {
    const eqIdx = line.indexOf('=')
    if (eqIdx < 0) continue
    let key = line.slice(0, eqIdx).trim()
    if (key.startsWith('v_')) key = key.slice(2)
    let raw = line.slice(eqIdx + 1).trim()
    if (raw.startsWith('"') && raw.endsWith('"')) {
      raw = raw.slice(1, -1)
    }
    const fields = raw.split('~')
    results.push({ key, fields })
  }
  return results
}

// {
//   "marketId": "1",
//   "name": "盛屯矿业",
//   "code": "600711",
//   "price": 14.42,
//   "prevClose": 14.85,
//   "open": 15.11,
//   "volume": 1464468,
//   "outerVolume": 571397,
//   "innerVolume": 893071,
//   "bid": [
//     {
//       "price": 14.41,
//       "volume": 4710
//     },
//     {
//       "price": 14.4,
//       "volume": 14703
//     },
//     {
//       "price": 14.39,
//       "volume": 4956
//     },
//     {
//       "price": 14.38,
//       "volume": 8116
//     },
//     {
//       "price": 14.37,
//       "volume": 2125
//     }
//   ],
//   "ask": [
//     {
//       "price": 14.42,
//       "volume": 2400
//     },
//     {
//       "price": 14.43,
//       "volume": 944
//     },
//     {
//       "price": 14.44,
//       "volume": 1011
//     },
//     {
//       "price": 14.45,
//       "volume": 1872
//     },
//     {
//       "price": 14.46,
//       "volume": 574
//     }
//   ],
//   "time": "20251229161125",
//   "change": -0.43,
//   "changePercent": -2.9,
//   "high": 15.11,
//   "low": 14.38,
//   "volume2": 1464468,
//   "amount": 214378,
//   "turnoverRate": 4.74,
//   "pe": 22.21,
//   "amplitude": 4.92,
//   "circulatingMarketCap": 445.67,
//   "totalMarketCap": 445.67,
//   "pb": 2.66,
//   "limitUp": 16.34,
//   "limitDown": 13.37,
//   "volumeRatio": 1.03,
//   "avgPrice": 14.64,
//   "peStatic": 19.64,
//   "peDynamic": 22.22,
//   "high52w": 15.2,
//   "low52w": 4.52,
//   "circulatingShares": 3090611551,
//   "totalShares": 3090611551,
//   "raw": [
//     "1",
//     "盛屯矿业",
//     "600711",
//     "14.42",
//     "14.85",
//     "15.11",
//     "1464468",
//     "571397",
//     "893071",
//     "14.41",
//     "4710",
//     "14.40",
//     "14703",
//     "14.39",
//     "4956",
//     "14.38",
//     "8116",
//     "14.37",
//     "2125",
//     "14.42",
//     "2400",
//     "14.43",
//     "944",
//     "14.44",
//     "1011",
//     "14.45",
//     "1872",
//     "14.46",
//     "574",
//     "",
//     "20251229161125",
//     "-0.43",
//     "-2.90",
//     "15.11",
//     "14.38",
//     "14.42/1464468/2143776153",
//     "1464468",
//     "214378",
//     "4.74",
//     "22.21",
//     "",
//     "15.11",
//     "14.38",
//     "4.92",
//     "445.67",
//     "445.67",
//     "2.66",
//     "16.34",
//     "13.37",
//     "1.03",
//     "27809",
//     "14.64",
//     "19.64",
//     "22.22",
//     "",
//     "",
//     "1.39",
//     "214377.6153",
//     "0.0000",
//     "0",
//     " ",
//     "GP-A",
//     "202.24",
//     "2.78",
//     "1.03",
//     "11.88",
//     "6.12",
//     "15.20",
//     "4.52",
//     "8.99",
//     "15.07",
//     "60.03",
//     "3090611551",
//     "3090611551",
//     "67.15",
//     "168.98",
//     "3090611551",
//     "",
//     "",
//     "209.38",
//     "0.00",
//     "",
//     "CNY",
//     "0",
//     "___D__F__N",
//     "14.35",
//     "2367"
//   ]
// }
const parseFullQuote = (f) => {
  const bid = []
  for (let i = 0; i < 5; i++) {
    bid.push({
      price: f[9 + i * 2],
      volume: f[10 + i * 2],
    })
  }
  const ask = []
  for (let i = 0; i < 5; i++) {
    ask.push({
      price: f[19 + i * 2],
      volume: f[20 + i * 2],
    })
  }
  return {
    // marketId: f[0] ?? '',
    name: decodeURIComponent(f[1]), // 名称
    code: f[2] , // 代码
    price: f[3], // 当前价格
    prevClose: f[4], // 昨日收盘价格
    open: f[5], // 开盘价格
    volume: f[6], // 成交量
    outerVolume: f[7], // 卖出成交量
    innerVolume: f[8], // 买入成交量
    // bid, // 五档买
    // ask, // 五档卖
    time: f[30], // 年月日时分秒
    change: f[31], // 涨跌
    changePercent: f[32], // 涨跌百分比
    high: f[33], // 最高价
    low: f[34], // 最低价
    volume2: f[36], // 成交量
    amount: f[37], // 成交额（万）
    turnoverRate: f[38], // 换手率
    pe: f[39], // 市盈
    amplitude: f[43], // 振幅（%）
    circulatingMarketCap: f[44], // 流通市值（亿）
    totalMarketCap: f[45], // 总市值（亿）
    pb: f[46], // 市净率
    limitUp: f[47], // 跌停
    limitDown: f[48], // 涨停
    volumeRatio: f[49], // 量比
    avgPrice: f[51],  // 盘中均价
    peDynamic: f[52], // 市盈（动）
    peStatic: f[53], // 市盈（净）
    high52w: f[67], // 近一年最高价
    low52w: f[68], // 近一年最低价
    // circulatingShares: f[72],
    // totalShares: f[73],
    // raw: f,
  }
}

const fetchData = (codeList) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'qt.gtimg.cn',
      path: `/?q=${codeList.join(',')}`,
      method: 'GET',
      headers: {
        Referer: 'https://qt.gtimg.cn',
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
      timeout: 5000 // 设置超时时间为5秒
    }
    const req = https.request(options, (res) => {
      // console.log('-----res----', res.statusCode, res.headers)
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            // console.log(typeof data, data)
            // const jsonData = decodeGBK(data)
            // console.log(jsonData)
            resolve(data)
          } catch (error) {
            reject(new Error(`请求正常，接口返回数据解析错误>>> ${error.message}`))
          }
        } else {
          reject(new Error(`reject>>> ${res.statusCode}`))
        }
      })
    })
    req.on('error', (error) => {
      reject(new Error(`onError>>> ${error.message}`))
    })
    req.end()
  })
}

const getAllData = async (codeList) => {
  let list = []
  const num = 800
  const count = Math.ceil(codeList.length / num)
  for (let i = 0; i < count; i++) {
    // console.log(i, codeList.slice(i * num, (i + 1) * num))
    const res = await fetchData(codeList.slice(i * num, (i + 1) * num))
    const parseRes = parseResponse(res)
    const parseFiled = parseRes.map(item => {
      return {
        key: item.key,
        ...parseFullQuote(item.fields)
      }
    })
    // console.log(parseFiled)
    list.push(...parseFiled)
  }
  // console.log(list)
  return list
}

const filterStock = (compareStocks, realTimeStocks) => {
  const list = realTimeStocks.filter(stock => {
    const compare = compareStocks.find(c => c.code === stock.code)
    // console.log(compare.name)
    return stock.amount > compare.amount
      // stock.volumeRatio > 1.5 &&
      && stock.changePercent > 1
      // stock.innerVolume > stock.outerVolume
  }).map(stock => {
    return {
      name: stock.name,
      code: stock.code,
      price: stock.price,
      changePercent: stock.changePercent
    }
  })
  console.log(list, list.length)
  return list
}

const start = async () => {
  const monitorStocks = getStockFilterList()
  const codeList = monitorStocks.map((item) => item.symbol)
  let timerIns = null
  const loop = async () => {
    const curHours = new Date().getHours()
    const curMin = new Date().getMinutes()
    console.log('>>>>>当前时间', curHours + ':' + curMin)
    if (curHours < 9 || (curHours === 9 && curMin < 30) || (curHours === 11 && curMin > 30) || (curHours > 11 && curHours < 13) || curHours >= 15) {
      console.log('=======非交易时间======')
      return
    } 
    if (timerIns) {
      clearTimeout(timerIns)
    }
    const stockList = await getAllData(codeList)
    // console.log(stockList)
    filterStock(monitorStocks, stockList)
    timerIns = setTimeout(() => {
      loop()
    }, 30000)
  }
  loop()
}
start()
