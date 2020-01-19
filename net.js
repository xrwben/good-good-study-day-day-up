const net = require("net");
const server = net.createServer(socket => {
    socket.end("hello world!");
}).on("err", err => {
    throw err;
});

server.listen(() => {
    console.log("打开服务器", server.address());
})