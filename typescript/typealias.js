function getName(n) {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
function handleEvent(ele, event) {
    console.log(123);
}
handleEvent(document.querySelector("hello"), "click");
// handleEvent(document.querySelector("hello"), "dbclick"); // 报错
