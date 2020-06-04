const { app, BrowserWindow } = require("electron");

let mainWindow = null;

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false
	});

	mainWindow.loadFile("./index.html");
}

app.whenReady().then(createWindow);