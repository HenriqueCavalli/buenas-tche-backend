const express = require("express");
const passport = require("passport");
const { getMessagesBetweenUsers } = require("../services/message-services");
const { authenticate } = require("../middlewares/auth-middleware");

const router = express.Router();

router.get("/messages/:userId", authenticate(), async (req, res) => {
	const authenticatedUserId = req.user._id;
	const otherUserId = req.params.userId;
	const { limit = 50, skip = 0 } = req.query;

	try {
		const messages = await getMessagesBetweenUsers(
			authenticatedUserId,
			otherUserId,
			parseInt(limit),
			parseInt(skip),
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

module.exports = router;
