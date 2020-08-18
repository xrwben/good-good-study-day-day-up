// 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
// 其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了
function createArray(length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 0);
// 多个类型参数
function swap(tuple) {
    return [tuple[1], tuple[0]];
}
swap([7, 'x']);
// 泛型约束
function loggingIdentity(arg) {
    console.log(arg.length);
    return arg;
}
