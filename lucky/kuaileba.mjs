import https from 'node:https'
import { writeFileSync } from 'node:fs'


const fetchData = (pageNo = 1) => {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'www.cwl.gov.cn',
			path: `/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=kl8&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=${pageNo}&pageSize=1000&week=&systemType=PC`,
			method: 'GET',
	        headers: {
	            'Content-Type': 'application/json',
	            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
	            'Cookie': 'HMF_CI=a353232cb4160874dcc1afb1725b58c090565696bfb00288456d5924c898af66900b571a5446a5c8bca723f07dedabfe4cff590f61ce83e09a1e8b721c546214f9; Expires=Tue, 03-Sep-24 04:53:16 GMT; Path=/'
	        },
	        timeout: 10000 // 设置超时时间为10秒
		}
		const req = https.request(options, (res) => {
			console.log('-----res----', res.statusCode, res.headers)
		
			let data = '';

	        res.on('data', (chunk) => {
	            data += chunk;
	        });

	        res.on('end', () => {
	            if (res.statusCode === 200) {
	                try {
	                    const jsonData = JSON.parse(data);
	                    // console.log(jsonData)
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
		const { result, pageNum, total } = res
		// console.log(list, pages, total)

		result.forEach(item => {
			arr.push(item.red)
		})
		if (pageNo >= pageNum) {
			isContinuReq = false
		}
		pageNo = pageNo + 1
	}
	return arr
}




const startCrawling = async () => {
	const result = await getHistoryData()
	// console.log(result)
	writeFileSync('kuaileba.json', JSON.stringify(result, null, 2), 'utf8')

}

startCrawling()