// This code generates Traefik yaml configuration that you can paste into
// the "routers" and "services" sections in traefik/config/tls-test-server.yml

const ports = {
	from: 8050,
	to: 8099,
};

console.log(`tls:
  certificates:
    - certFile: /etc/traefik/_wildcard.localhost.test.pem
      keyFile: /etc/traefik/_wildcard.localhost.test-key.pem

http:
  routers:`);

for (let port=ports.from; port <= ports.to; port++) {
	console.log(`    to-https-localhost-test-${port}:`);
	console.log(`      rule: "Host(\`${port}.localhost.test\`)"`);
	console.log(`      tls: {}`);
	console.log(`      service: https-localhost-test-${port}`);
}

console.log(`  services:`);

for (let port=ports.from; port <= ports.to; port++) {
	console.log(`    https-localhost-test-${port}:`);
	console.log(`      loadBalancer:`);
	console.log(`        servers:`);
	console.log(`          - url: http://host.docker.internal:${port}`);
}
