import https from 'node:https'
import { writeFileSync, readFileSync, accessSync } from 'node:fs'


const fetchData = (pageNo = 1) => {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'vip.stock.finance.sina.com.cn',
			path: `/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=${pageNo}&num=100&sort=changepercent&asc=0&node=hs_a&symbol=&_s_r_a=sort`,
			method: 'GET',
	        headers: {
	            'Content-Type': 'application/json',
	            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
	            'Cookie': 'HMF_CI=779a403c87522c1bf39376e78a54c9cba47f39a678e91599e33d64696d398b3719d3ebcfc598fe63314b0016bd4176d47766a67991a5911bd5e4b1b451177794a1; Expires=Sun, 01-Sep-24 12:20:13 GMT; Path=/'
	        },
	        timeout: 10000 // 设置超时时间为10秒
		}
		const req = https.request(options, (res) => {
			// console.log('-----res----', res.statusCode, res.headers)
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


const getCurDateData = async () => {
	let arr = []
	let pageNo = 1
	let isContinuReq = true

	while (isContinuReq) {
		console.log('第' + pageNo + '页')
		const res = await fetchData(pageNo)
        console.log(res.length, typeof res)
		arr = arr.concat(res)
		if (res.length !== 100) {
			isContinuReq = false
		}
		pageNo = pageNo + 1
	}
	return arr
}




const start = async (date) => {
    const currentDate = new Date()
    const fDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`
    const fileName = date ? date : fDate

    try {
        accessSync(`${fileName}.json`, 'utf8')
        console.log('>>>>>>>>>>>>>>>>>> 文件数据已存在 <<<<<<<<<<<<<<<<<<<<')
        return
    } catch {
        // 文件不存在时继续
        const result = await getCurDateData()

	    writeFileSync(`${fileName}.json`, JSON.stringify(result, null, 2), 'utf8')
    }
}
start()