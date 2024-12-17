const express = require("express");
const router = express.Router();
const { getAllUsers, getById } = require("../services/user-services");
const { authenticate } = require("../middlewares/auth-middleware");

router.get("/users", authenticate(), async (req, res) => {
	try {
		const users = await getAllUsers();
		return res.json(users);
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
