require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const http = require("http");

const connectDB = require("./config/db");
const configurePassport = require("./config/passport-jwt");
const loadRoutes = require("./src/routes");
const { initializeSocket } = require("./src/services/socket-service");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
const server = http.createServer(app);

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(passport.initialize());

configurePassport(passport);
loadRoutes(app);
initializeSocket(server);

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
