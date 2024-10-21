// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getLuckyNumber } from './lottery';

let timeoutId: NodeJS.Timeout | undefined;

const scheduleRestReminder = async () => {
	// console.log('定时提醒');
	if (timeoutId) {
		clearTimeout(timeoutId);
	}
	// 每天下午6点提示
	const now = new Date();
	const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

	if (now > targetTime) {
		targetTime.setDate(targetTime.getDate() + 1);
	}

	const timeUntilTarget = targetTime.getTime() - now.getTime();
	
	timeoutId = setTimeout(async () => {
		const richerNumber = await getLuckyNumber();
		vscode.window.showInformationMessage(`今晚（${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}）快乐8推荐号码为： ${JSON.stringify(richerNumber)}`);
		scheduleRestReminder();
	}, timeUntilTarget);
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	scheduleRestReminder();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lucky-dabenli" is now active!');
	const richerNumber = await getLuckyNumber();
	console.log('getLuckyNumber', richerNumber);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('lucky-dabenli.happy8', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage(`今晚快乐8推荐号码为： ${JSON.stringify(richerNumber)}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (timeoutId) {
		clearTimeout(timeoutId);
	}
}
