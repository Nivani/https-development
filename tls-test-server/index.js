const fs = require('node:fs');
const http = require('node:http');
const Koa = require('koa');

const { WebSocketServer } = require('ws');

startAPIServer(8093);

function startAPIServer(port) {
	new Promise((resolve) => {
		const app = new Koa();
		app.use(handleHttpGet);

		const server = http.createServer(app.callback());

		const wsServer = createVirtualWsServer();
		server.on('upgrade', function handleUpgrade(request, socket, head) {
			wsServer.handleUpgrade(request, socket, head, function wsUpgraded(ws) {
				wsServer.emit('connection', ws, request);
			});
		});

		server.listen(port);

		console.log(`API Server is running on port ${port}`);
		resolve();
	});
}

function createVirtualWsServer() {
	const wss = new WebSocketServer({ path: '/ws/', noServer: true });

	wss.on('connection', function connection(ws) {
		ws.on('message', function message(data) {
			console.log('received: %s, sending back', data);
			ws.send(`echo ${data}`);
		});

		ws.send('connected!');

		let c = 1;
		let intervalId;
		intervalId = setInterval(() => {
			console.log('sending', c);
			ws.send(`${c++}`);
			if (c > 7) {
				clearInterval(intervalId);
			}
		}, 1000);
	});

	return wss;
}

function handleHttpGet(ctx) {
	switch (ctx.request.url) {
		case '/user':
			ctx.body = {id: "1234", name: "John Doe"};
			break;
		case '/index.html':
		case '/':
			ctx.response.set("content-type", "text/html");
			ctx.body = fs.createReadStream('./www/index.html');
			break;
		case '/index.js':
			ctx.response.set("content-type", "text/javascript");
			ctx.body = fs.createReadStream('./www/index.js');
			break;
		default:
			console.warn(`Received request for unmapped URL '${ctx.request.url}'`);
	}
}
