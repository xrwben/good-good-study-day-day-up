// 函数
function sum(x, y) {
    return x + y;
}
sum(1, 2);
// 可选参数 可选参数后面不允许再出现必需参数了
function buildName(firstName, lastName) {
    return firstName + ' ' + lastName;
}
buildName("li");
// 默认参数
function mo(firstName, lastName) {
    if (lastName === void 0) { lastName = 'ben'; }
    return firstName + ' ' + lastName;
}
mo("li");
// 剩余参数
function push(arr) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    items.forEach(function (item) {
        arr.push(item);
    });
}
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else {
        return x.split("").reverse().join('');
    }
}
