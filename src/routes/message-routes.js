const express = require("express");
const passport = require("passport");
const {
	getMessagesBetweenUsers,
	getAllMessages,
} = require("../services/message-services");
const { authenticate } = require("../middlewares/auth-middleware");

const router = express.Router();

router.get("/messages/:userId", authenticate(), async (req, res) => {
	const authenticatedUserId = req.user._id;
	const otherUserId = req.params.userId;

	try {
		const messages = await getMessagesBetweenUsers(
			authenticatedUserId,
			otherUserId,
		);

		res.status(200).json({ success: true, messages });
	} catch (error) {
		console.error("Erro ao buscar mensagens:", error);
		res.status(500).json({
			success: false,
			message: "Erro interno do servidor.",
		});
	}
});

router.get("/messages", authenticate(), async (req, res) => {
	try {
		const messages = await getAllMessages();
		res.status(200).json({ success: true, messages });
	} catch (error) {
		console.error("Erro ao buscar todas as mensagens:", error);
		res.status(500).json({
			success: false,
			message: "Erro interno do servidor.",
		});
	}
});

module.exports = router;
