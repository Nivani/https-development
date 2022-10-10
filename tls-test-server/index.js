const fs = require('node:fs');
const http = require('node:http');
const Koa = require('koa');

const { WebSocketServer } = require('ws');

startAPIServer(8081);

function startAPIServer(port) {
	const handleHttpRequest = createHandleHttpRequest();
	const httpServer = http.createServer(handleHttpRequest);

	const webSocketServer = createVirtualWsServer();
	httpServer.on('upgrade', function handleUpgrade(request, socket, head) {
		webSocketServer.handleUpgrade(request, socket, head, function wsUpgraded(ws) {
			webSocketServer.emit('connection', ws, request);
		});
	});

	httpServer.listen(port);

	console.log(`API Server is running on port ${port}`);
}

function createHandleHttpRequest() {
	const app = new Koa();
	app.use(handleHttpGet);
	const handleRequestWithKoa = app.callback();

	return function handleHttpRequest(request, response) {
		if (request.method === 'GET' && request.url === '/countdown-sse') {
			handleServerSentEventsRequest(request, response);
		} else {
			handleRequestWithKoa(request, response);
		}
	};
}

function handleHttpGet(ctx) {
	switch (ctx.request.url) {
		case '/user':
			ctx.body = { id: '1234', name: 'John Doe' };
			break;
		case '/index.html':
		case '/':
			ctx.response.set('content-type', 'text/html');
			ctx.body = fs.createReadStream('./www/index.html');
			break;
		case '/index.js':
			ctx.response.set('content-type', 'text/javascript');
			ctx.body = fs.createReadStream('./www/index.js');
			break;
		default:
			console.warn(`Received request for unmapped URL '${ctx.request.url}'`);
	}
}

function handleServerSentEventsRequest(request, response) {
	response.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	})

	countdown(7, 1000, (count) => {
		console.log('SSE: sending', count);
		response.write(`data: ${count}\n\n`)
	}).then(() => response.end());
}

function createVirtualWsServer() {
	const webSocketServer = new WebSocketServer({ path: '/ws/', noServer: true });

	webSocketServer.on('connection', function connection(webSocket) {
		webSocket.on('message', function message(data) {
			console.log('received: %s, sending back', data);
			webSocket.send(`echo ${data}`);
		});

		webSocket.send('connected!');

		countdown(7, 1000, (count) => {
			console.log('WS sending', count);
			webSocket.send(`${count}`);
		}).then(() => webSocket.close());
	});

	return webSocketServer;
}

function countdown(max, intervalMs, callback) {
	return new Promise((resolve) => {
		let count = 1;
		let intervalId;
		intervalId = setInterval(() => {
			callback(count);
			count++;
			if (count > max) {
				clearInterval(intervalId);
				resolve();
			}
		}, intervalMs);
	});
}
