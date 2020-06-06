## Electron快速上手  https://www.electronjs.org/docs

### Electron是什么？


### 创建一个Electron应用


### 主进程和渲染进程之间如何通信？渲染进程之间如何通信？
 
 > Electron ipcMain 模块 （主进程中使用）
	
 你可以使用它处理从渲染器进程（网页）发送出来的异步和同步信息

 > Electron ipcRenderer 模块 （渲染进程中使用）

 你可以使用它提供的一些方法从渲染进程 (web 页面) 发送同步或异步的消息到主进程 也可以接收主进程回复的消息。

 > Electron remore 模块 （渲染进程中使用）

 在渲染进程中使用主进程模块



### Electron常用模块

> app 控制应用程序的事件生命周期。

 方法： `app.quit()`尝试关闭所有窗口 、`app.relaunch()`从当前实例退出重启应用、`app.isReady()`

> BrowserWindow 创建和控制浏览器窗口。

 属性参数： frame:false(无边窗口)

> webview 在一个独立的 frame 和进程里显示外部 web 内容。


> dialog 显示用于打开和保存文件、警报等的本机系统对话框

> webContents 渲染以及控制 web 页面, 是 BrowserWindow 对象的一个属性