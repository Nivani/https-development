const fs = require('node:fs');
const path = require('node:path');
const http2 = require('node:http2');
const http = require('node:http');
const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();

app.use(cors());

app.use(async ctx => {
	switch (ctx.request.url) {
		case '/user':
			ctx.body = { id: "1234", name: "John Doe" };
			break;
		default:
			console.warn(`Received request for unmapped URL '${ctx.request.url}'`);
	}
});

const port = 8080;
http.createServer(
	{},
	app.callback(),
).listen(port);
// http2.createSecureServer(
// 	{
// 		cert: fs.readFileSync(path.resolve(`${process.env.HOME}/.local/share/mkcert/_wildcard.dev.localhost.pem`)),
// 		key: fs.readFileSync(path.resolve(`${process.env.HOME}/.local/share/mkcert/_wildcard.dev.localhost-key.pem`)),
// 	},
// 	app.callback(),
// ).listen(port);

console.log(`API is running on port 8080`);