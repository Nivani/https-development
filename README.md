This repository belongs with the article ["Automatic HTTPS for all your development servers" over at nvnh.io](https://nvnh.io/index.php/2022/10/24/automatic-https-for-all-your-development-servers/).

It demonstrates how you can use HTTPS in development with any server, without changing the code.  
We can do this by running a reverse proxy that will handle HTTPS for us. After trying Traefik and NGINX, Traefik was easier to configure.

The `test-app` is a test application that demonstrates the use of HTTPS, websockets (WSS) and server-sent events.

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

(If you've installed Docker without Docker Desktop, open `traefik/docker-compose.yml` and uncomment the `extra_hosts` section)

Go to the `traefik` folder  
Run `docker-compose up`

You can now access any development server running on ports between 8080 and 8099 over HTTPS by replacing `http://localhost:<port>` with `https://<port>.localhost.test`.  
For example, you can open [https://8099.localhost.test](https://8080.localhost.test) in your favorite browser to see Traefik's dashboard.

To run the test application, go to the `test-app` folder  
Run `npm install` and `npm start`

Open [https://8080.localhost.test](https://8080.localhost.test) in your favorite browser to see an API call, a websocket over WSS and Server-sent events in action.
