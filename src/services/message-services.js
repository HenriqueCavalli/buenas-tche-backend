const Message = require("../models/message-model");

async function createMessage({ sender, receiver, content }) {
	const message = new Message({ sender, receiver, content });
	await message.save();
	return message;
}

async function getMessagesBetweenUsers(userId1, userId2) {
	const messages = await Message.find({
		$or: [
			{ sender: userId1, receiver: userId2 },
			{ sender: userId2, receiver: userId1 },
		],
	})
		.sort({ timestamp: -1 })
		.populate("sender", "name username")
		.populate("receiver", "name username")
		.exec();

	await Message.updateMany(
		{ sender: userId2, receiver: userId1, read: false },
		{ $set: { read: true } },
	);

	return messages;
}

async function getUnreadMessagesCount(userId) {
	const count = await Message.countDocuments({
		receiver: userId,
		read: false,
	});
	return count;
}

module.exports = {
	createMessage,
	getMessagesBetweenUsers,
	getUnreadMessagesCount,
};
