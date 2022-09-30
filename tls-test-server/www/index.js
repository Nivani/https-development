fetch('/user')
	.then(response => response.json())
	.then((user) => {
		console.log('user', user);
	});

const wsUrl = 'wss://8080.dev.localhost/ws/';
// const wsUrl = 'ws://localhost:8070/ws/';

const webSocket = new WebSocket(wsUrl);
webSocket.onopen = function onopen() {
	console.log('onopen');

	setTimeout(() => webSocket.send("test send"), 1500);
};

webSocket.onmessage = function onmessage(msg) {
	console.log('onmessage', msg);
};
