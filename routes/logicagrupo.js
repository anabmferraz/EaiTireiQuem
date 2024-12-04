const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const User = require("../models/user");
const { validateGroupName } = require("../utils/validation");

// Criar grupo
router.post("/", async (req, res) => {
  try {
    if (!validateGroupName(req.body.name)) {
      return res.status(400).json({ error: "Nome do grupo inválido" });
    }
    const grupo = await Group.create({
      name: req.body.name,
      adminId: req.user.id,
    });
    res.status(201).json(grupo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Adicionar participante ao grupo
router.patch("/:id/adicionar-usuario", async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });
    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.addParticipant(
      req.params.id,
      req.body.userId
    );
    res.json(grupoAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Realizar sorteio
router.post("/:id/sorteio", async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });
    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.performDraw(req.params.id);
    res.json({ message: "Sorteio realizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter resultados do sorteio
router.get("/:id/resultado", async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });
    if (!grupo.drawResults)
      return res
        .status(400)
        .json({ error: "O sorteio ainda não foi realizado" });

    if (req.user.role === "admin" || grupo.adminId === req.user.id) {
      return res.json(grupo.drawResults);
    }

    if (grupo.participants.includes(req.user.id)) {
      const receptor = await User.findById(grupo.drawResults[req.user.id]);
      return res.json({ match: { id: receptor.id, name: receptor.name } });
    }

    res.status(403).json({ error: "Não autorizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter grupos do usuário
router.get("/usuario", async (req, res) => {
  try {
    const grupos = await Group.getUserGroups(req.user.id);
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
