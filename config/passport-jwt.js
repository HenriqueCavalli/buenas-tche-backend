const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../src/models/user-model");

function configurePassport(passport) {
	const opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET || "secret",
	};

	passport.use(
		new JwtStrategy(opts, async (jwtPayload, done) => {
			try {
				const user = await User.findById(jwtPayload.id);
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			} catch (err) {
				return done(err, false);
			}
		}),
	);
}

module.exports = configurePassport;
