const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Por favor, informe um email e uma senha");
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).send("Autenticação falhou");
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  register,
  login,
};
