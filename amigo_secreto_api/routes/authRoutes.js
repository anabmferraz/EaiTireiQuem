//Rotas de autenticação (login e cadastro?)

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Admin = require("../models/admin");
const router = express.Router();
const KEY_JWT = process.env.JWT_SECRET || "chave-secreta";

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    let user = await Admin.buscarPorEmail(email);
    if (!usuario) {
      usuario = await User.buscarPorEmail(email);
    }

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, funcao: usuario.funcao },
      _JWT,
      { expiresIn: "24h" }
    );

    res.json({ token, funcao: usuario.funcao });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
