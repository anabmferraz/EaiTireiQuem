const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const User = require("../models/user");
const { validateGroupName } = require("../utils/validation");

// Rota para criar grupo
router.post("/", async (req, res) => {
  // implementação
});

// Rota para adicionar participante
router.patch("/:id/adicionar-usuario", async (req, res) => {
  // implementação
});

// Rota para realizar sorteio
router.post("/:id/sorteio", async (req, res) => {
  // implementação
});

// Rota para resultados do sorteio
router.get("/:id/resultado", async (req, res) => {
  // implementação
});

// Rota para obter grupos do usuário
router.get("/usuario", async (req, res) => {
  // implementação
});

// Exportar o roteador
module.exports = router;
