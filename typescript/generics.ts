// 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

// 其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了
function createArray<T>(length: number, value: T): Array<T> {
	let result: T[] = [];
	for (let i = 0; i < length; i++) {
		result[i] = value;
	}
	return result;
}

createArray<number>(3, 0);

// 多个类型参数
function swap<T, S>(tuple: [T, S]): [S, T] {
	return [tuple[1], tuple[0]];
}
swap([7, 'x'])


// 泛型约束
function loggingIdentity<T>(arg: T): T {
    // console.log(arg.length); // 由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法：
    return arg;
}

interface Lengthwise {
    length: number;
}

function loggingIdentity1<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}


// 泛型接口
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray2: CreateArrayFunc<any>;
createArray2 = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']


// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };


interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
