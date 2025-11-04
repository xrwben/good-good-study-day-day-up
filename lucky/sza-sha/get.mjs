import https from 'node:https'
import { writeFileSync, readFileSync, accessSync } from 'node:fs'

const fetchData = (pageNo = 1) => {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'stock.xueqiu.com',
			path: `/v5/stock/screener/quote/list.json?page=${pageNo}&size=100&order=desc&order_by=amount&market=CN`,
			method: 'GET',
	        headers: {
	            'Content-Type': 'application/json',
	            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
	            'Cookie': 'ssxmod_itna=1-eqUx9D0DcivfG0KGCGD8IY3xYKiKDXDUqAQtGgDYq7=GFlDCx7KBxLW04qXxwzOOTRmuwQqGWDGXx3DxiNDAc40iDC4WddD0xrtPK/R70bNeIQYyeNYF_GdONzbfIiRF86wvRS9XE7j6Xb_6U84GLDY=DCTIit4GGf4GwDGoD34DiDDPDbbrDAweD7qDF0nuiPaTDm4GW0eDmDGYQpeDgGDDBG4rDKMeQ6Dxe0WFe6pmzVWKO57DQx0UTDBdPIIBCE98e8cWDzuFQNxrD8qrrh09mmnkXxBQrogWPMPI=r1nFx2qdb_sibm_bhyex0f4DA4TqDx0DxD75QPiq7xY4DlIYY3nbm2DnReeIrjitQGQjGQiDxjiCDhrIG48moHitlRQM4DG358Y5AEdFA5GDe8ovohDjrtwEidjAAChjnDeY55G5mWxY04sEi4O_e0q3Ye12q8rDD; ssxmod_itna2=1-eqUx9D0DcivfG0KGCGD8IY3xYKiKDXDUqAQtGgDYq7=GFlDCx7KBxLW04qXxwzOOTRmuwQqGDDP2qhWGD03q_4WBeODBThjA3QlWK4NH=B10FO_6D1GWOFRb7SHj3mf7/a9bEGX5WNFlckI=rWixnazG0OyEFzKCvQ6=Y4P9_=kO0eeCadeDDtNPo41RFGGhvvPSrAY9_aNamG1KWWEKyh7ocps2okN1Okm8OhA1aGXB2jHUcp6_adFnQGddu1HSpLqC1CUrd06x6R5/9LNxpnpt/HTlZmgOdqHP8UoUzSV/4zkr/lDsK1DyjFvIbe0WK7URnIcU45li54lPUz_PzwRm_5bivFvmSWGtm78hHivU9bAKD4bglRIRfTzIGR00HeqkUTKvpQpIA9nvApRUe4MgpjnDi7gQqBfypiFLt8u3Knjx0GSKZRbTPLb3Fk9XjFacfLmadzK6BFX9YHEAx3pDqRkG_/Q0kPYxIiNhkkK0aGd4EgxE7Dw9HSo3V5zAIGZKf82OjBctpU_qwMu4rma1YXiy8OKPNL/Fw2G4Sndz5jNxHGCW09pP0CNjfTba4DvHW6mDHwC30SKniIrMmm=Eik9E8ypWihGE=xTibWrVHA81_/marP/IZdtPhrDRQD8_P7YigS4B3jQef5mleIer8=4RhWGWWjiOlG4RqWmsx9brVmU_V1jsrrxGsNhxe5ebWmz6uXCGTrhWWQYoPPeG=arnmWWrW7D_bP7PFK8YKlDghWlhuHGloneW7_9iGW57BT0_8BeCeG0M1wGGriDgDTlqthPnPBBMcqgG47w4D; xq_a_token=144a75f00fac53d1ebae9a21261446d57d4443d1; xqat=144a75f00fac53d1ebae9a21261446d57d4443d1; xq_r_token=b9b51aaaa1483ef9b74ce0216d64fd270a74d442; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTc2NDIwNjEyNSwiY3RtIjoxNzYyMTYxNDExNTk3LCJjaWQiOiJkOWQwbjRBWnVwIn0.JxqIxMoYnJPRCSpteQmW05OCNW1aoYGgZBuiYMhuFgG1cpUEML-dCu_6Z_7iCHUJsHzIBD5vp_Lr-YxXvPSzvmCwPsbyCNHsSEvZUylOz6O3XAj7SQczcX3n6jkn82RrknET2AAetPufjV4pEmCa8w9jEvV9Wv6tXoln5UGnSs1Fwdedl_tIEt6t3g85AoO7_p0VF67X9fFnch-WsL4xFU7o8Meynu-cNMu8MQgv8aueE1S7H8TEehgnN4pWK_gCs5CDp35x9ylbVeTSOKiQbEpQyhEwFm2QgrNJXlxkyOTyydYaH6DFSH4hM76ZpfPLPAZ2uKFEYtPTFyB1YdPDUw; cookiesu=901762161433586; u=901762161433586; device_id=9b8d469cc46cbbe1799c32e7c816e7fe; Hm_lvt_1db88642e346389874251b5a1eded6e3=1762161438; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1762162374; HMACCOUNT=DD3141C3A950C853'
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
		// console.log(res)
		const { list, count } = res.data

		arr = arr.concat(list)

		if (arr.length >= count) {
			isContinuReq = false
		}
		pageNo = pageNo + 1
	}
	return arr
}




const getCurrentData = async () => {
	const date = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')
	try {
		accessSync(`${date}.json`)
		return
	} catch(e) {
		const list = await getHistoryData()
		writeFileSync(`${date}.json`, JSON.stringify(list, null, 2), 'utf8')
	}

}

getCurrentData()