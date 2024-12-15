const { setUserOnlineStatus } = require("./user-services");
const { createMessage } = require("./message-services");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

let io;

function initializeSocket(server) {
	io = require("socket.io")(server, {
		cors: {
			origin: process.env.CLIENT_URL || "http://localhost:3001",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	// Middleware de autenticação com JWT
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(
					new Error("Authentication error: Token not provided"),
				);
			}

			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || "secret",
			);
			const user = await User.findById(decoded.id);

			if (!user) {
				return next(new Error("Authentication error: User not found"));
			}

			socket.user = user; // Anexar o usuário ao socket
			next();
		} catch (err) {
			console.error("Socket authentication error:", err);
			next(new Error("Authentication error"));
		}
	});

	io.on("connection", (socket) => {
		console.log(
			`Novo cliente conectado: ${socket.id} - Usuário: ${socket.user.username}`,
		);

		// Adicionar o usuário à sua própria sala usando seu ID
		socket.join(socket.user._id.toString());
		console.log(
			`Usuário ${socket.user.username} entrou na sala ${socket.user._id}`,
		);

		// Marcar o usuário como online
		(async () => {
			try {
				await setUserOnlineStatus(socket.user.username, true);
				io.emit("updateUserList");
			} catch (err) {
				console.error("Erro ao marcar usuário como online:", err);
			}
		})();

		// Listener para enviar mensagem
		socket.on("sendMessage", async (data) => {
			try {
				const { receiverId, content } = data;
				const senderId = socket.user._id;

				if (!receiverId || !content) {
					console.error(
						"Dados incompletos para envio de mensagem:",
						data,
					);
					return;
				}

				// Verificar se o usuário receptor existe
				const receiver = await User.findById(receiverId);
				if (!receiver) {
					console.error(
						"Usuário receptor não encontrado:",
						receiverId,
					);
					return;
				}

				// Cria e salva a mensagem no banco de dados
				const newMessage = await createMessage({
					sender: senderId,
					receiver: receiverId,
					content,
				});

				// Emitir para o receptor específico na sala correspondente
				io.to(receiverId).emit("receiveMessage", newMessage);

				// Emitir para o remetente para confirmar o envio
				socket.emit("messageSent", newMessage);

				console.log(
					`Mensagem enviada de ${senderId} para ${receiverId}: ${content}`,
				);
			} catch (err) {
				console.error("Erro ao enviar mensagem:", err);
			}
		});

		// Desconexão
		socket.on("disconnect", async () => {
			try {
				await setUserOnlineStatus(socket.user.username, false);
				io.emit("updateUserList");
				console.log(`Usuário desconectado: ${socket.user.username}`);
			} catch (err) {
				console.error("Erro ao processar desconexão:", err);
			}
		});
	});
}

module.exports = { initializeSocket };
