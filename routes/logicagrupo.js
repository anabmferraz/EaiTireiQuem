const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const { auth } = require("../middleware/auth"); // Middleware de autenticação
const { validarNomeGrupo } = require("../utils/validation"); // Certifique-se de que esta importação está correta

// Rota para criar grupo
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    // Validação do nome do grupo
    if (!validarNomeGrupo(name)) {
      return res.status(400).json({ error: "Nome do grupo inválido" });
    }

    // Criação do grupo
    const grupo = await Group.criar({
      nome: name,
      idAdmin: req.user.id, // Middleware `auth` popula `req.user`
    });

    res.status(201).json(grupo); // Retorna o grupo criado
  } catch (error) {
    console.error("[Erro ao criar grupo]:", error.message);
    res.status(500).json({ error: "Erro interno ao criar o grupo" });
  }
});

// Exportar o roteador
module.exports = router;
