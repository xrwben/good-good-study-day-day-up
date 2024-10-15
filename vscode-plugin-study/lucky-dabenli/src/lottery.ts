import axios from 'axios';
import * as cheerio from 'cheerio';

interface Data {
    number: number,
    maxMiss: number,
    avgMiss: number,
    occurrence: number
}

const startSpider = () => {
    // 目标 URL
    const url = "https://lotto.sina.cn/trend/qxc_qlc_proxy.d.html?lottoType=kl8&actionType=chzs&0_ala_h5baidu&_headline=baidu_ala&type=30";
    
    return new Promise<Data[]>((resolve, reject) => {
        // 发送 HTTP 请求
        axios.get(url).then(response => {
            const html = response.data;
        
            // 使用 cheerio 解析 HTML
            const $ = cheerio.load(html);
            // console.log(html)
        
            // 查找包含数据的表格
            const table = $('#currentData');
        
            if (table.length > 0) {
                // 初始化数据容器
                const historyData: Data[] = [];
        
                // 查找表格中的行
                const rows = table.find('tr');
                console.log(rows.length);
        
                // 遍历每一行
                rows.each((index, row) => {
                    // 查找每一行中的单元格
                    const cells = $(row).find('td');
        
                    cells.each((i, cell) => {
                        if (i > 0) {
                            if (!historyData[i - 1]) {
                                historyData.push({
                                    number: i,
                                    maxMiss: 0,
                                    avgMiss: 0,
                                    occurrence: 0
                                });
                            }
                            if (index === 0) {
                                const maxMiss = parseInt($(cell).text().trim());
                                historyData[i - 1].maxMiss = maxMiss;
                            }
                            if (index === 1) {
                                const avgMiss = parseInt($(cell).text().trim());
                                historyData[i - 1].avgMiss = avgMiss;
                            }
                            if (index === 2) {
                                const occurrence = parseInt($(cell).text().trim());
                                historyData[i - 1].occurrence = occurrence;
                            }
                        }
                    });
                });
                resolve(historyData);
            } else {
                reject("未找到包含数据的表格");
                console.error("未找到包含数据的表格");
            }
        }).catch(error => {
            console.error('请求失败:', error);
        });
    });
};

const missSortByAsc = (list: Data[]) => {
    // 最大遗漏和平均遗漏升序
    const result = list.sort((a, b) => {
        return (a.maxMiss + a.avgMiss) - (b.maxMiss + b.avgMiss);
    }).map(item=> {
        return item.number;
    });
    // console.log(result);
    return result.slice(0, 10);
};

const occurrenceSortByDesc = (list: Data[]) => {
    // 出现次数降序
    const sortedList = list.sort((a, b) => {
        return b.occurrence - a.occurrence;
    });
    // 去掉最多次数和最少次数的数字
    const filteredList = sortedList.filter((item, index) => {
        return index !== 0 && item !== sortedList[0];
    });
    const result = filteredList.map(item=> {
        return item.number;
    });
    return result.slice(0, 10);
};

const weightSortByDesc = (list: Data[]) => {
    // 最大遗漏权重3， 平均遗漏权重2，出现次数权重1
    const result = list.sort((a, b) => {
        return (3 * a.maxMiss + 2 * a.avgMiss + a.occurrence) - (3 * b.maxMiss + 2 * b.avgMiss + b.occurrence);
    }).map(item=> {
        return item.number;
    });
    // console.log(result);
    return result.slice(0, 10);
};

const getRandomNumber = (list: Data[]) => {
    // 随机获取一组号码
    const arr = [];
    for (let i = 0; i < 10; i++) {
        const index = Math.floor(Math.random() * list.length);
        arr.push(list[index]);
    }
    const result = arr.sort((a, b) => {
        return a.number - b.number;
    }).map(item=> {
        return item.number;
    });
    // console.log(result);
    return result;
};

export const getLuckyNumber = async () => {
    const data = await startSpider();
    const result1 = missSortByAsc(data);
    const result2 = occurrenceSortByDesc(data);
    const result3 = weightSortByDesc(data);
    const result4 = getRandomNumber(data);

    return {
        '遗漏计算': result1,
        '出现次数': result2,
        '权重计算': result3,
        '随机获取': result4
    };
};
// (async () => {
//     const result = await getLuckyNumber();
//     console.log('getLuckyNumber', result);
// })();