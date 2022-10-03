fetch('/user')
	.then(response => response.json())
	.then((user) => {
		console.log('user', user);
		print(`user: ${JSON.stringify(user)}`);
	});

const wsUrl = `wss://${window.location.hostname}/ws/`;

const webSocket = new WebSocket(wsUrl);
webSocket.onopen = function onopen() {
	console.log('onopen');

	setTimeout(() => webSocket.send("test send"), 1500);
};

webSocket.onmessage = function onmessage(msg) {
	console.log('onmessage', msg);
	print(msg.data);
};

function print(msg) {
	const div = document.createElement("div");
	div.innerText = msg;
	document.body.appendChild(div);
}
