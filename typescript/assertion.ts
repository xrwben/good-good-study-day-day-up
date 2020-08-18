// 断言 => 值 as 类型
interface Cat {
	name: string;
	run(): void;
}
interface Fish {
	name: string;
	swim(): void;
}

function getName(animal: Cat | Fish) {
	if (typeof (animal as Fish).swim === 'function') {
		return true;
	} else {
		return false;
	}
}

// 类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误
function swim(animal: Cat | Fish) {
	(animal as Fish).swim();
}

const lili: Cat = {
	name: 'lili',
	run() {
		console.log("run")
	}
}
swim(lili);


(window as any).foo = 1;


interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

let tom: Cat = {
    name: 'Tom',
    run: () => { console.log('run') }
};
let animal: Animal = tom;


interface Cat {
    run(): void;
}
interface Fish {
    swim(): void;
}

function testCat(cat: Cat) {
    return (cat as any as Fish);
}



// 类型断言 vs 类型转换 类型断言不是类型转换，它不会真的影响到变量的类型。
function toBoolean(something: any): boolean {
    return something as boolean;
}

toBoolean(1);
// 返回值为 1
function toBoolean1(something: any): boolean {
    return Boolean(something);
}

toBoolean1(1);