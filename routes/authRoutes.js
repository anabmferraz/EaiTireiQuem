const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Admin = require("../models/admin");
const { generateToken } = require("../utils/jwt");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Tenta login como administrador primeiro
    let usuario = await Admin.findByEmail(email);
    if (!usuario) {
      // Se não for administrador, tenta como usuário normal
      usuario = await User.findByEmail(email);
    }

    // Verifica se o usuário existe e compara a senha
    if (!usuario || !(await bcrypt.compare(senha, usuario.password))) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    // Gera o token JWT
    const token = generateToken(usuario);

    // Retorna o token e os dados do usuário
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.name,
        email: usuario.email,
        funcao: usuario.role,
      },
    });
  } catch (erro) {
    // Tratamento de erro
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
