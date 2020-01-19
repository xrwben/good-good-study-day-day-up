const buf1 = Buffer.alloc(10, 'b');
console.log("buf1>>", buf1);

const buf2 = Buffer.allocUnsafe(10);
console.log(buf2);
buf2.fill(1);
console.log(buf2);

const buf3 = Buffer.from("this is a test");
console.log(buf3.toString());