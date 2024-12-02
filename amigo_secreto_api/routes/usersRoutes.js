//rotas para usuários comuns
const express = require("express");
const User = require("../models/user");
const { auth, Admin } = require("../middleware/auth");
const roteador = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await Usuario.criar(req.body);
    res.status(201).json(usuario);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get("/", auth, Admin, async (req, res) => {
  try {
    const user = await Usuario.buscarTodos();
    const userSemSenhas = usuarios.map(({ senha, ...usuario }) => usuario);
    res.json(usersSemSenhas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = roteador;
