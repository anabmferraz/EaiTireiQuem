const express = require("express");
const AdminModel = require("../models/admin");
const User = require("../models/user");
const Group = require("../models/group"); 
const { auth, isAdmin } = require("../middleware/auth"); 
const router = express.Router();

router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const administrador = await AdminModel.criar(req.body);
    res.status(201).json(administrador);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.get("/usuarios", auth, isAdmin, async (req, res) => {
  try {
    const usuarios = await User.buscarTodos();
    const usuariosSemSenhas = usuarios.map(({ senha, ...usuario }) => usuario);
    res.json(usuariosSemSenhas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get("/grupos", auth, isAdmin, async (req, res) => {
  try {
    const grupos = await Group.buscarTodos(); 
    res.json(grupos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete("/usuarios/:id", auth, isAdmin, async (req, res) => {
  try {
    await User.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.delete("/grupos/:id", auth, isAdmin, async (req, res) => {
  try {
    await Group.excluir(req.params.id); 
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
