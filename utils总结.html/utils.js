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

	return result[name];
}



export function getQueryUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}



export default {
	getQueryString,
	getQueryUrl
}