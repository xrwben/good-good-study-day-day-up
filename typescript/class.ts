class Animal {
	public name;
	constructor(name) {
		this.name = name;
	}
	sayHi() {
		return `my name is ${this.name}`;
	}
}

let a = new Animal('liben');

// 继承
class Cat extends Animal {
	constructor(name) {
		super(name);
		console.log(this.name);
	}
	sayHi() {
		return super.sayHi();
	}
}

let c = new Animal('tom');

// 存取器 get set
class Person {
	constructor(name) {
		this.name = name;
	}
	get name() {
		return 'jack';
	}
	set name(value) {
		console.log(value);
	}
}

// 静态方法 但是TypeScript 编译之后的代码中，并没有限制 private 属性在外部的可访问性
class Car {
	static isCar(a) {
		return a instanceof Animal;
	}
}
Car.isCar(a);
let car = new Car();
// car.isCar(a)

 
// 抽象类 是不允许被实例化的
abstract class A {
	sayHi() {
		// ...
	}
}

class Animal2 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let aa: Animal2 = new Animal('Jack');
console.log(aa.sayHi()); // My name is Jack
