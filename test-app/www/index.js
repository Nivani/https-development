fetchUser();
testWebSocket();
testServerSentEvents();

function fetchUser() {
	fetch('/user')
		.then(response => response.json())
		.then((user) => {
			console.log('user', user);
			print(`GET request: ${JSON.stringify(user)}`);
		});
}

function testWebSocket() {
	const wsUrl = `wss://${window.location.hostname}/ws/`;

	const webSocket = new WebSocket(wsUrl);

	webSocket.addEventListener('open', () => {
		console.log('WebSocket: open');
		print('WebSocket: open');
		setTimeout(() => webSocket.send("test echo"), 1500);
	});

	webSocket.addEventListener('message', (msg) => {
		console.log('WebSocket message', msg);
		print(`WebSocket: ${msg.data}`);
	});
}

function testServerSentEvents() {
	const eventSource = new EventSource('/countdown-sse');

	eventSource.addEventListener('open', () => {
		console.log('Server-sent events: open');
		print('Server-sent events: open');
	});

	eventSource.addEventListener('message', (msg) => {
		console.log('Server-sent event', msg);
		print(`Server-sent event: ${msg.data}`);
	});
}

function print(msg) {
	const div = document.createElement('div');
	div.innerText = msg;
	document.getElementById('container').appendChild(div);
}
