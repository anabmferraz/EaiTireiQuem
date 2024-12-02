const express = require("express");
const Admin = require("../models/admin");
const User = require("../models/user");
const Groups = require("../models/group");
const { auth, Admin } = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, Admin, async (req, res) => {
  try {
    const administrador = await Administrador.criar(req.body);
    res.status(201).json(administrador);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get("/usuarios", auth, Admin, async (req, res) => {
  try {
    const usuarios = await Usuario.buscarTodos();
    const usuariosSemSenhas = usuarios.map(({ senha, ...usuario }) => usuario);
    res.json(usuariosSemSenhas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get("/grupos", auth, Admin, async (req, res) => {
  try {
    const grupos = await Grupo.buscarTodos();
    res.json(grupos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete("/usuarios/:id", auth, Admin, async (req, res) => {
  try {
    await Usuario.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete("/grupos/:id", auth, Admin, async (req, res) => {
  try {
    await Grupo.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = roteador;
