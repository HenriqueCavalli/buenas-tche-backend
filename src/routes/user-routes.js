const express = require("express");
const router = express.Router();
const { getAllUsers, getById } = require("../services/user-services");
const { authenticate } = require("../middlewares/auth-middleware");
const Message = require("../models/message-model");

router.get("/users", authenticate(), async (req, res) => {
	try {
		const users = await getAllUsers();

		const usersWithUnread = await Promise.all(
			users.map(async (user) => {
				if (user._id.toString() === req.user._id.toString()) {
					return { ...user.toObject(), unreadCount: 0 };
				}
				const count = await Message.countDocuments({
					sender: user._id,
					receiver: req.user._id,
					read: false,
				});
				return { ...user.toObject(), unreadCount: count };
			}),
		);

		return res.json(usersWithUnread);
	} catch (err) {
		console.error("Erro ao buscar usuários:", err);
		return res.status(500).json({ message: "Erro interno no servidor." });
	}
});

router.get("/users/:id", authenticate(), async (req, res) => {
	try {
		const { id } = req.params;
		const user = await getById(id);
		return res.json(user);
	} catch (err) {
		console.error("Erro ao buscar usuários:", err);
		return res.status(500).json({ message: "Erro interno no servidor." });
	}
});

module.exports = router;
