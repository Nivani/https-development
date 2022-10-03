
for (let port=8081; port < 8100; port++) {
	console.log(`	to-tls-test-server-${port}:`);
	console.log(`		rule: "Host(\`${port}.dev.localhost\`)"`);
	console.log(`		tls: {}`);
	console.log(`		service: tls-test-server-${port}`);
}


for (let port=8081; port < 8100; port++) {
	console.log(`	tls-test-server-${port}:`);
	console.log(`		loadBalancer:`);
	console.log(`			servers:`);
	console.log(`				- url: http://gateway.docker.internal:${port}`);
}
