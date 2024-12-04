const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Admin = require("../models/admin");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chave-secreta"; 


const gerarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    role: usuario.funcao || "user", 
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};


router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    
    let usuario = await Admin.buscarPorEmail(email);
    if (!usuario) {
      usuario = await User.buscarPorEmail(email);
    }

    
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    
    const token = gerarToken(usuario);

    res.json({
      token,
      funcao: usuario.funcao || "user", 
    });
  } catch (erro) {
    console.error(`[Erro de Autenticação]: ${erro.message}`);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

module.exports = router;
