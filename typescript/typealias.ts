type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

function getName(n: NameOrResolver): Name {
	if (typeof n === 'string') {
		return n;
	} else {
		return n();
	}
}

type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
	console.log(123);
}

handleEvent(document.querySelector("hello"), "click");
// handleEvent(document.querySelector("hello"), "dbclick"); // 报错