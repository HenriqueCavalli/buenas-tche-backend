const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const { createUser, findUserByUsername } = require("../services/user-services");

router.post("/register", async (req, res) => {
	try {
		const { name, username, password } = req.body;
		if (!name || !username || !password) {
			return res.status(400).json({ message: "Dados incompletos." });
		}

		const existingUser = await findUserByUsername(username);
		if (existingUser) {
			return res.status(400).json({ message: "Username já cadastrado." });
		}

		const newUser = await createUser({ name, username, password });
		return res.status(201).json({
			message: "Usuário cadastrado com sucesso!",
			userId: newUser._id,
		});
	} catch (err) {
		console.error("Erro no registro:", err);
		return res.status(500).json({ message: "Erro interno no servidor." });
	}
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (!user || !(await user.comparePassword(password))) {
		return res.status(401).json({ message: "Credenciais inválidas" });
	}

	const payload = { id: user._id };
	const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
		expiresIn: "2h",
	});

	res.json({ token });
});

module.exports = router;
