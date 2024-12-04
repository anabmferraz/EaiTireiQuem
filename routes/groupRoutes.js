const express = require("express");
const Group = require("../models/group");
const User = require("../models/user");
const { auth, isAdmin } = require("../middleware/auth");
const { validateGroupName } = require("../utils/validation");

const router = express.Router();

const verificarPermissaoGrupo = (grupo, usuario) => {
  if (grupo.adminId !== usuario.id && usuario.role !== "admin") {
    throw new Error("Não autorizado");
  }
};

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!validateGroupName(name)) {
      return res.status(400).json({ error: "Nome do grupo inválido" });
    }

    const grupo = await Group.create({
      name,
      adminId: req.user.id,
    });

    res.status(201).json(grupo);
  } catch (error) {
    res
      .status(error.message === "Não autorizado" ? 403 : 500)
      .json({ error: error.message });
  }
});

router.patch("/:id/adicionar-usuario", auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const grupo = await Group.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    verificarPermissaoGrupo(grupo, req.user);

    const grupoAtualizado = await Group.addParticipant(req.params.id, userId);

    res.json(grupoAtualizado);
  } catch (error) {
    res
      .status(error.message === "Não autorizado" ? 403 : 500)
      .json({ error: error.message });
  }
});

router.post("/:id/sorteio", auth, async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    verificarPermissaoGrupo(grupo, req.user);

    const grupoAtualizado = await Group.performDraw(req.params.id);

    res.json({ message: "Sorteio realizado com sucesso", grupoAtualizado });
  } catch (error) {
    res
      .status(error.message === "Não autorizado" ? 403 : 500)
      .json({ error: error.message });
  }
});

router.get("/:id/resultado", auth, async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    if (!grupo.drawResults) {
      return res
        .status(400)
        .json({ error: "O sorteio ainda não foi realizado" });
    }

    if (req.user.role === "admin" || grupo.adminId === req.user.id) {
      return res.json(grupo.drawResults);
    }

    if (grupo.participants.includes(req.user.id)) {
      const parSorteado = grupo.drawResults[req.user.id];
      const receptor = await User.findById(parSorteado);
      return res.json({ match: { id: receptor.id, name: receptor.name } });
    }

    throw new Error("Não autorizado");
  } catch (error) {
    res
      .status(error.message === "Não autorizado" ? 403 : 500)
      .json({ error: error.message });
  }
});

router.get("/usuario", auth, async (req, res) => {
  try {
    const grupos = await Group.getUserGroups(req.user.id);
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
