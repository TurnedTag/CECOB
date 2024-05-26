const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, cep } = req.body;
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Email invalido." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "Email ja em uso." });
    }

    const user = await User.create({ username, email, password, cep });

    user.password = undefined;

    res.status(201).send(user);
  } catch (err) {
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

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    const { _id, username, cep } = user;

    res.status(200).send({ _id, username, email, token, cep });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  console.log("User ---->", user);

  if (user) {
    const { _id, name, email, cep } = user;
    res.status(200).send({
      _id,
      name,
      email,
      cep,
    });
  } else {
    res.status(400).send("Usuario não encontrado");
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).send("Sessão de usuario encerrada");
};

const loginStatus = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.send(false);
  }

  const verified = jwt.verify(token, process.env.SECRET);

  if (verified) return res.status(200).send(true);

  return res.status(200).send(false);
};

module.exports = {
  register,
  login,
  getUser,
  logout,
  loginStatus,
};
