import https from 'node:https'
import { writeFileSync } from 'node:fs'

const fetchData = (pageNo = 1) => {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'webapi.sporttery.cn',
			path: `/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=100&isVerify=1&pageNo=${pageNo}`,
			method: 'GET',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        timeout: 10000 // 设置超时时间为10秒
		}
		const req = https.request(options, (res) => {
			// console.log('-----res----', res)
			let data = '';

	        res.on('data', (chunk) => {
	            data += chunk;
	        });

	        res.on('end', () => {
	            if (res.statusCode === 200) {
	                try {
	                    const jsonData = JSON.parse(data);
	                    resolve(jsonData);
	                } catch (error) {
	                    reject(new Error(`Failed to parse JSON for page ${pageNo}: ${error.message}`));
	                }
	            } else {
	                reject(new Error(`Failed to fetch data for page ${pageNo}: ${res.statusCode}`));
	            }
	        });
		})

		req.on('error', (error) => {
            reject(new Error(`Error fetching data for page ${pageNo}: ${error.message}`));
        });

        req.end();
	})
}

const getHistoryData = async () => {
	let arr = []
	let pageNo = 1
	let isContinuReq = true

	while (isContinuReq) {
		console.log('第' + pageNo + '页')
		const res = await fetchData(pageNo)
		const { list, pages, total } = res.value
		// console.log(list, pages, total)

		list.forEach(item => {
			arr.push(item.lotteryDrawResult)
		})
		// const listMap = list.map(item => {
		// 	return {
		// 		date: item.lotteryDrawTime,
		// 		num: item.lotteryDrawNum,
		// 		lucky: item.lotteryDrawResult
		// 	}
		// })
		// arr = arr.concat(listMap)
		if (pageNo >= pages) {
			isContinuReq = false
		}
		pageNo = pageNo + 1
	}
	return arr
}




const startCrawling = async () => {
	const result = await getHistoryData()
	console.log(result)
	writeFileSync('daletou.json', JSON.stringify(result, null, 2), 'utf8')

}

startCrawling()