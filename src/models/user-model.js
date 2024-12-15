const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	online: { type: Boolean, default: false },
});

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
