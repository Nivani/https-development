This repository demonstrates how you can use HTTPS in development with any server, without changing any code.  
We can do this by running a reverse proxy that will handle HTTPS for us. I tried Traefik and NGINX. Traefik was easier to configure.

The `tls-test-server` is a test application that demonstrates the use of HTTPS, websockets (WSS) and server-sent events.

# Getting started

Prerequisites:
* Docker and `docker-compose`
* `mkcert`, see ["How to use HTTPS for local development"](https://web.dev/how-to-use-local-https/) for how to set up `mkcert` and trust it's root CA.
* (Node.js, if you want to run the test application)

Use `mkcert "*.localhost.test"` to create 2 files `_wildcard.localhost.test.pem` and `_wildcard.localhost.test-key.pem` in the `traefik` folder of this repository.

Configure your hosts file so that the domains you want to use resolve to localhost.  
You can do this by adding these lines to your hosts file (`/etc/hosts` on unix based systems and `C:\Windows\System32\drivers\etc\hosts` on Windows):  
```text
127.0.0.1   8080.localhost.test
127.0.0.1   8081.localhost.test
...
127.0.0.1   8099.localhost.test
```

(If you're running WSL2 on Windows, run `ip addr show eth0` and copy the IPV4 address. In `traefik/docker-compose.yml`, uncomment the `extra_hosts` section and replace the IP address with the one you just copied)

Go to the `traefik` folder  
Run `docker-compose up`

You can now access any development server running on ports between 8080 and 8099 over HTTPS by replacing `http://localhost:<port>` with `https://<port>.localhost.test`.  
For example, you can open [https://8080.localhost.test](https://8080.localhost.test) in your favorite browser. You should see Traefik's dashboard.

To run the test application, go to the `tls-test-server` folder  
Run `npm install` and `node index.js`

Open [https://8081.localhost.test](https://8081.localhost.test) in your favorite browser to see an API call, a websocket over WSS and Server-sent events in action.
