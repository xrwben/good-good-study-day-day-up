function getName(animal) {
    if (typeof animal.swim === 'function') {
        return true;
    }
    else {
        return false;
    }
}
// 类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误
function swim(animal) {
    animal.swim();
}
var lili = {
    name: 'lili',
    run: function () {
        console.log("run");
    }
};
swim(lili);
window.foo = 1;
var tom = {
    name: 'Tom',
    run: function () { console.log('run'); }
};
var animal = tom;
function testCat(cat) {
    return cat;
}
// 类型断言不是类型转换，它不会真的影响到变量的类型。
function toBoolean(something) {
    return something;
}
toBoolean(1);
// 返回值为 1
function toBoolean1(something) {
    return Boolean(something);
}
toBoolean1(1);
