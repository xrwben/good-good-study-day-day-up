import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'node:fs'

// 目标 URL
const url = "https://lotto.sina.cn/trend/qxc_qlc_proxy.d.html?lottoType=kl8&actionType=chzs&0_ala_h5baidu&_headline=baidu_ala&type=30";

// 发送 HTTP 请求
axios.get(url).then(response => {
    const html = response.data

    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(html)
    // console.log(html)

    // 查找包含数据的表格
    const table = $('#currentData')
    // console.log('>>>>>>>>>>>>>>>>>>>>>>', table)

    if (table.length > 0) {
        // 初始化数据容器
        const historyData = []

        // 查找表格中的行
        const rows = table.find('tr')
        console.log(rows.length)

        // 遍历每一行
        rows.each((index, row) => {
            // 查找每一行中的单元格
            const cells = $(row).find('td')

            cells.each((i, cell) => {
                if (i > 0) {
                    if (!historyData[i - 1]) {
                        historyData.push({
                            number: i,
                            maxMiss: 0,
                            avgMiss: 0,
                            occurrence: 0
                        })
                    }
                    if (index === 0) {
                        const maxMiss = $(cell).text().trim()
                        historyData[i - 1].maxMiss = maxMiss
                    }
                    if (index === 1) {
                        const avgMiss = $(cell).text().trim()
                        historyData[i - 1].avgMiss = avgMiss
                    }
                    if (index === 2) {
                        const occurrence = $(cell).text().trim()
                        historyData[i - 1].occurrence = occurrence
                    }
                }
            })
        })
        console.log(historyData)

        missSortByAsc(historyData)

        // 将数据写入 JSON 文件
        // fs.writeFileSync('lotto_data.json', JSON.stringify(data, null, 4), 'utf-8');

        // console.log("数据已成功写入 lotto_data.json 文件");
    } else {
        console.error("未找到包含数据的表格")
    }
}).catch(error => {
    console.error('请求失败:', error)
})

const missSortByAsc = (list) => {
    // 最大遗漏和平均遗漏升序
    const result = list.sort((a, b) => {
        return (a.maxMiss + a.avgMiss) - (b.maxMiss + b.avgMiss)
    })
    console.log(result)
}