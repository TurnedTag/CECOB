const mongoose = require("mongoose");
const bcrypt = requier("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

UserSchema.pre("save", async (next) => {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods.checkPassword = (password) =>
  bcrypt.compare(password, this.password);

module.exports = mongoose.model("User", UserSchema);
