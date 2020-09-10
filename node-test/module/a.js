/*
	不要混用 可能地址指向会变 导致丢失
*/

exports.add = function(a, b) {
	return a + b;
}

module.exports = {
	name: 'calculater'
}