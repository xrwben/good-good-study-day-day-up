// 枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。
var Days;
(function (Days) {
    Days[Days["sun"] = 0] = "sun";
    Days[Days["mon"] = 1] = "mon";
    Days[Days["tue"] = 2] = "tue";
    Days[Days["wed"] = 3] = "wed";
    Days[Days["thu"] = 4] = "thu";
    Days[Days["fri"] = 5] = "fri";
    Days[Days["sat"] = 6] = "sat";
})(Days || (Days = {}));
// 枚举项有两种类型：常数项（constant member）和计算所得项（computed member）
var Color1;
(function (Color1) {
    Color1[Color1["Red"] = 0] = "Red";
    Color1[Color1["Green"] = 1] = "Green";
    Color1[Color1["Blue"] = 'blue'.length] = "Blue";
})(Color1 || (Color1 = {}));
var directions = [0 /* up */, 1 /* down */, 2 /* left */, 3 /* right */];
var directions2 = [Directions2.up, Directions2.down, Directions2.left, Directions2.right];
