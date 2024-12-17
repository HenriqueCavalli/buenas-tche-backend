require("dotenv").config();
const http = require("http");
const os = require("os");
const express = require("express");
const passport = require("passport");
const cors = require("cors");

const cluster = require("cluster");
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const numCPUs = os.cpus().length;
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

const connectDB = require("./config/db");
const configurePassport = require("./config/passport-jwt");
const loadRoutes = require("./src/routes");
const { initializeSocket } = require("./src/services/socket-service");

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
	const httpServer = http.createServer();

	setupMaster(httpServer, {
		loadBalancingMethod: "least-connection",
	});

	setupPrimary();

	httpServer.listen(PORT, () => {
		console.log(`Master server listening on port ${PORT}`);
	});

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		cluster.fork();
	});
} else {
	connectDB();

	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(passport.initialize());

	configurePassport(passport);
	loadRoutes(app);

	const server = http.createServer(app);

	const io = initializeSocket(server);
	io.adapter(createAdapter());
	setupWorker(io);

	server.listen(0, () => {
		console.log(`Worker ${process.pid} está pronto para receber conexões.`);
	});
}
