let i = 0;

function timedCount () {
	i = i + 1;

	console.log("window对象为：", typeof window);
	console.log(i);

	postMessage(i);

	setTimeout(timedCount, 1000);
}



self.onmessage = function (e) {
	console.log("e>>>>", e);
	if (e.data = "start") {
		timedCount();
	}
}