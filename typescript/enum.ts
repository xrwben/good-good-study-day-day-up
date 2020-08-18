// 枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

enum Days {sun, mon, tue, wed, thu, fri, sat }

// 枚举项有两种类型：常数项（constant member）和计算所得项（computed member）

enum Color1 {Red, Green, Blue = 'blue'.length }

// enum Color {Red = 'red'.length, Green, Blue = 'blue'.length } // 报错

// 常数枚举 它会在编译阶段被删除
const enum Directions {
	up,
	down,
	left,
	right
}
let directions = [Directions.up, Directions.down, Directions.left, Directions.right];


// 外部枚举 只会用于编译时的检查，编译结果中会被删除
declare enum Directions2 {
	up,
	down,
	left,
	right
}
let directions2 = [Directions2.up, Directions2.down, Directions2.left, Directions2.right]