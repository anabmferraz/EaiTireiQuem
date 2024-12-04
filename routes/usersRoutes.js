const express = require("express");
const User = require("../models/user");
const { auth, isAdmin } = require("../middleware/auth"); // Consistência na nomenclatura
const router = express.Router();

// Rota POST para criar um usuário
router.post("/", async (req, res) => {
  try {
    const user = await User.criar(req.body); // Corrigido para "criar"
    res.status(201).json(user);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

// Rota GET para listar todos os usuários
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.buscarTodos(); // Corrigido para "buscarTodos"
    const usersWithoutPasswords = users.map(({ senha, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
