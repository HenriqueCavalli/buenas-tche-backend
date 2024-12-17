const { setUserOnlineStatus } = require("./user-services");
const { createMessage } = require("./message-services");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

let io;

// Função para obter o nome da room
function getConversationRoom(userId1, userId2) {
	return `conversation_${[userId1, userId2].sort().join("_")}`;
}

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
				console.error("Token não fornecido");
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
				console.error("Usuário não encontrado");
				return next(new Error("Authentication error: User not found"));
			}

			socket.user = user; // Anexar o usuário ao socket
			next();
		} catch (err) {
			console.error("Erro na autenticação do socket:", err);
			next(new Error("Authentication error"));
		}
	});

	io.on("connection", (socket) => {
		// Listener para entrar em uma room
		socket.on("joinConversation", ({ otherUserId }) => {
			const room = getConversationRoom(
				socket.user._id.toString(),
				otherUserId,
			);
			socket.join(room);
		});

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
				const senderId = socket.user._id.toString();

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

				const structuredMessage = {
					...newMessage._doc,
					sender: {
						_id: socket.user._id,
						name: socket.user.name,
						username: socket.user.username,
					},
					receiver: {
						_id: receiver._id,
						name: receiver.name,
						username: receiver.username,
					},
				};

				delete structuredMessage.__v;

				const room = getConversationRoom(senderId, receiverId);

				// Emitir para todos menos para mim
				socket.to(room).emit("receiveMessage", structuredMessage);
			} catch (err) {
				console.error("Erro ao enviar mensagem:", err);
			}
		});

		// Desconexão
		socket.on("disconnect", async () => {
			try {
				await setUserOnlineStatus(socket.user.username, false);
				io.emit("updateUserList");
			} catch (err) {
				console.error("Erro ao processar desconexão:", err);
			}
		});
	});

	return io;
}

module.exports = { initializeSocket };
