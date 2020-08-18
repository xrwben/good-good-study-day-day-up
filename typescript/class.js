var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
    }
    Animal.prototype.sayHi = function () {
        return "my name is " + this.name;
    };
    return Animal;
}());
var a = new Animal('liben');
// 继承
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat(name) {
        var _this = _super.call(this, name) || this;
        console.log(_this.name);
        return _this;
    }
    Cat.prototype.sayHi = function () {
        return _super.prototype.sayHi.call(this);
    };
    return Cat;
}(Animal));
var c = new Animal('tom');
// 存取器 get set
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    Object.defineProperty(Person.prototype, "name", {
        get: function () {
            return 'jack';
        },
        set: function (value) {
            console.log(value);
        },
        enumerable: false,
        configurable: true
    });
    return Person;
}());
// 静态方法 但是TypeScript 编译之后的代码中，并没有限制 private 属性在外部的可访问性
var Car = /** @class */ (function () {
    function Car() {
    }
    Car.isCar = function (a) {
        return a instanceof Animal;
    };
    return Car;
}());
Car.isCar(a);
var car = new Car();
// car.isCar(a)
// 抽象类 是不允许被实例化的
var A = /** @class */ (function () {
    function A() {
    }
    A.prototype.sayHi = function () {
        // ...
    };
    return A;
}());
var Animal2 = /** @class */ (function () {
    function Animal2(name) {
        this.name = name;
    }
    Animal2.prototype.sayHi = function () {
        return "My name is " + this.name;
    };
    return Animal2;
}());
var aa = new Animal('Jack');
console.log(aa.sayHi()); // My name is Jack
