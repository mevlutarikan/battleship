# BattleShip Game

API server is built by Nodejs and express application is built by reactjs.

- [Node.js](https://nodejs.org/) : Version 16.2
- [Express](https://expressjs.com/) : Version 4.17
- [React](https://reactjs.org/)

## Getting Started

```sh
$ git clone https://github.com/mevlutarikan/battleship.git
$ cd battleship/
```

## Installing

Install dependecies of Node API server

```sh
$ cd node-api
$ npm install
```

Install dependecies of React App

```sh
$ cd reactapp
$ npm install
```

## Executing program

First start Node API server.

```
$ cd node-api
$ npm start
```

To start React App in development server, enter:

```
$ cd react
$ npm start
```

Open your browser and go to (http://localhost:3000)

To build application, enter command below in reactapp folder:

```
$ npm build
```

Node server serves reactapp/build folder in 8080 port.
Type (http://localhost:8080) in your browser.

You can also serve ./reactapp/build folder by your web server. (Nginx, Apache etc..)

## Test

To test Node API server, type below in node-api folder.

```
$ npm test
```

## Authors

---

👤 **Mevlut Arikan**

Computer Engineer, Backend Developer

- linkedin: [@arikanmevlut](https://www.linkedin.com/in/arikanmevlut/)
- Twitter: [@mevlutarikan](https://twitter.com/mevlutarikan)
- Github: [@mevlutarikan](https://github.com/mevlutarikan)
