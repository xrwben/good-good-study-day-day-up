const path = require("path");
const simpleGit = require("simple-git/promise");

const gitIns = simpleGit(path.resolve(__dirname, "../"));

// git remote
// gitIns.getRemotes().then(res => {
// 	console.log(res)
// });

async function start () {
	// git remote -v
	const remote = await gitIns.listRemote(['--get-url']);
	console.log(remote)

	const status = await gitIns.status();
	console.log(status)

	// await gitIns.add("./*");
	// await gitIns.commit("simple-git测试");
}

start()