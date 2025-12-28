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

const fetchData = (codeList) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'qt.gtimg.cnn',
      path: `/?q=${codeList.join(',')}`,
      method: 'GET',
      headers: {
        Referer: 'https://qt.gtimg.cn',
        'Content-Type': 'application/json',
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
            const jsonData = JSON.parse(data)
            console.log(jsonData)
            resolve(jsonData)
          } catch (error) {
            reject(new Error(`parseJSON>>> ${error.message}`))
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

const getCurDateData = async (codeList) => {
  const num = 500
  const count = Math.ceil(codeList.length / num)
  for (let i = 0; i < count; i++) {
    console.log(i, codeList.slice(i * num, (i + 1) * num))
    const res = await fetchData(codeList.slice(i * num, (i + 1) * num))
    // console.log(res)
  }
}

const start = async () => {
  const codeList = getStockFilterList().map((item) => item.symbol)
  console.log(codeList)
  getCurDateData(codeList)
}
start()
