// This code generates Traefik yaml configuration that you can paste into
// the "routers" and "services" sections in traefik/config/tls-test-server.yml

const ports = {
	from: 8080,
	to: 8099,
};

for (let port=ports.from; port <= ports.to; port++) {
	console.log(`	to-https-localhost-test-${port}:`);
	console.log(`		rule: "Host(\`${port}.dev.localhost\`)"`);
	console.log(`		tls: {}`);
	console.log(`		service: https-localhost-test-${port}`);
}


for (let port=ports.from; port <= ports.to; port++) {
	console.log(`	https-localhost-test-${port}:`);
	console.log(`		loadBalancer:`);
	console.log(`			servers:`);
	console.log(`				- url: http://gateway.docker.internal:${port}`);
}
