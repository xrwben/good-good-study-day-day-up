const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow = null;

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		// frame: false,
		// icon: "./logo.ico",
		webPreferences: {
			nodeIntegration: true,
			webviewTag: true
		}
	});

	mainWindow.loadFile("./index.html");

	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow);

ipcMain.on('asynchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.reply('asynchronous-reply', 'pong')
});

ipcMain.on('synchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
});


ipcMain.on("closeWindow", (event, arg) => {
	console.log(event, arg);
	if (arg === true) {
		app.exit();
	}
})