// 函数
function sum(x: number, y: number): number {
	return x + y;
}
sum(1, 2);

// 可选参数 可选参数后面不允许再出现必需参数了
function buildName(firstName: string, lastName?: string) {
	return firstName + ' ' + lastName;
}
buildName("li");

// 默认参数
function mo(firstName: string, lastName: string = 'ben') {
	return firstName + ' ' + lastName;
}
mo("li")

// 剩余参数
function push(arr: any[], ...items: any[]) {
	items.forEach(function(item) {
		arr.push(item)
	});
}

// 重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
	if (typeof x === 'number') {
		return Number(x.toString().split('').reverse().join(''));
	} else {
		return x.split("").reverse().join('');
	}
}