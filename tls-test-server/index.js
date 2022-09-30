const fs = require('node:fs');
const http = require('node:http');
const Koa = require('koa');

const { WebSocketServer } = require('ws');

startAPIServer(8080);
startWSServer(8081);

function startAPIServer(port) {
	new Promise((resolve) => {
		const app = new Koa();

		app.use(async ctx => {
			switch (ctx.request.url) {
				case '/user':
					ctx.body = { id: "1234", name: "John Doe" };
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
		});

		http.createServer(
			{},
			app.callback(),
		).listen(port);

		console.log(`API Server is running on port ${port}`);
		resolve();
	});
}

function startWSServer(port) {
	new Promise((resolve) => {
		const wss = new WebSocketServer({ port });

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

		console.log(`WS Server is running on port ${port}`);
		resolve();
	});
}
