const mongoose = require("mongoose");

async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Conexão com MongoDB estabelecida com sucesso!");
	} catch (error) {
		console.error("Erro ao conectar no MongoDB:", error);
		process.exit(1);
	}
}

module.exports = connectDB;
