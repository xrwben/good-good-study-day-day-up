// 这种的话如果值中间有=号如何处理呢？
export const getQueryString = (name) => {
	if (window.location.href.indexOf("?") < 0) {
		return;
	}
	let result = {};
	let map = window.location.href.split("?")[1].split("&");
	map.forEach(item => {
		let key = item.split("=")[0];
		let value = item.split("=")[1];
		result[key] = value;
	})

	return decodeURIComponent(result[name]);
}

export const getQueryVariable = (variable) => {
  console.log(location)
  const query = decodeURIComponent(window.location.search.substring(1))
  const vars = query.split('&')
  console.log(vars)
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    console.log(pair)
    if (pair[0] === variable) {
      let delValue = ''
      const needList = pair.filter((item) => item !== variable)
      console.log(needList)
      needList.forEach((item, index) => {
        if (index === needList.length - 1) {
          delValue += item
        } else {
          delValue += `${item}=`
        }
      })
      console.log(delValue)
      return delValue
    }
  }
  return ('')
}


export function getQueryUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 千分位格式化 
const ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// ThousandNum(20190214) => "20,190,214"



export default {
	getQueryString,
	getQueryUrl
}