const Message = require("../models/message-model");

async function createMessage({ sender, receiver, content }) {
	const message = new Message({ sender, receiver, content });
	await message.save();
	return message;
}

async function getMessagesBetweenUsers(userId1, userId2, limit = 50, skip = 0) {
	return await Message.find({
		$or: [
			{ sender: userId1, receiver: userId2 },
			{ sender: userId2, receiver: userId1 },
		],
	})
		.sort({ timestamp: -1 }) // Ordena do mais recente para o mais antigo
		.limit(limit)
		.skip(skip)
		.populate("sender", "name username")
		.populate("receiver", "name username")
		.exec();
}

module.exports = {
	createMessage,
	getMessagesBetweenUsers,
};
