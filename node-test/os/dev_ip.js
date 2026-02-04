const os = require("os");

console.log(os.networkInterfaces());

Object.values(os.networkInterfaces())
	.flat(Infinity)
	.filter((detail) => detail.address && (detail.family === 'IPv4' || detail.family === 4))
	.forEach(detail => {
		if (detail.address.includes('127.0.0.1')) {
			console.log(`Local: `, detail.address)
        } else {
			console.log(`Network: `, detail.address)
        }
	})