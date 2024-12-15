const passport = require("passport");

/**
 * Middleware para proteger rotas.
 * Verifica se o token JWT é válido antes de permitir o acesso à rota.
 */
function authenticate() {
	return (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
			if (err) {
				return res.status(500).json({ message: "Erro interno." });
			}

			if (!user) {
				return res.status(401).json({
					message:
						"Acesso não autorizado. Faça login para continuar.",
				});
			}

			req.user = user;
			return next();
		})(req, res, next);
	};
}

module.exports = {
	authenticate,
};
