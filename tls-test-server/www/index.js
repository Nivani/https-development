fetchUser();
testWebSocket();
testServerSentEvents();

function fetchUser() {
	fetch('/user')
		.then(response => response.json())
		.then((user) => {
			console.log('user', user);
			print(`user: ${JSON.stringify(user)}`);
		});
}

function testWebSocket() {
	const wsUrl = `wss://${window.location.hostname}/ws/`;

	const webSocket = new WebSocket(wsUrl);

	webSocket.addEventListener('open', () => {
		console.log('WS open');
		setTimeout(() => webSocket.send("WS: test send"), 1500);
	});

	webSocket.addEventListener('message', (msg) => {
		console.log('WS message', msg);
		print(`WS: ${msg.data}`);
	});
}

function testServerSentEvents() {
	const eventSource = new EventSource('/countdown-sse');

	eventSource.addEventListener('open', () => console.log('SSE: open'));

	eventSource.addEventListener('message', (msg) => {
		console.log('SSE message', msg);
		print(`SSE: ${msg.data}`);
	});
}

function print(msg) {
	const div = document.createElement("div");
	div.innerText = msg;
	document.body.appendChild(div);
}
