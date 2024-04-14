const User = require("../models/User");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Email invalido." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "Email ja em uso." });
    }

    const user = await User.create({ username, email, password });

    user.password = undefined;

    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

module.exports = { register };
