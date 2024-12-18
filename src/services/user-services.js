const User = require("../models/user-model");

async function createUser({ name, username, password }) {
	const user = new User({ name, username, password });
	await user.save();
	return user;
}

async function findUserByUsername(username) {
	const lowercaseUsername = username.toLowerCase();
	return await User.findOne({ username: lowercaseUsername });
}

async function setUserOnlineStatus(username, isOnline) {
	await User.updateOne({ username }, { $set: { online: isOnline } });
}

async function getAllUsers() {
	return await User.find({}, "name username online");
}

async function getById(id) {
	return await User.findOne({ _id: id }, "name username online");
}

module.exports = {
	createUser,
	findUserByUsername,
	setUserOnlineStatus,
	getAllUsers,
	getById,
};
