//rotas especiais (redistribuição sortieo)//rotas especiais (redistribuição sortieo)
const express = require("express");
const Groups = require("../models/group");
const User = require("../models/user");
const { auth, Admin } = require("../middleware/auth");
const { validateGroupName } = require("../utils/validation");

const router = express.Router();

/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Criar um novo grupo de Amigo Secreto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 */
router.post("/", auth, async (req, res) => {
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

/**
 * @swagger
 * /api/grupos/{id}/adicionar-usuario:
 *   patch:
 *     summary: Adicionar um participante ao grupo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 */
router.patch("/:id/adicionar-usuario", auth, async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);

    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.addParticipant(
      req.params.id,
      req.body.userId
    );
    await EmailService.sendDrawNotification(req.body.userId, grupo.name);
    res.json(grupoAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/grupos/{id}/sorteio:
 *   post:
 *     summary: Realizar o sorteio do Amigo Secreto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.post("/:id/sorteio", auth, async (req, res) => {
  try {
    const grupo = await Group.findById(req.params.id);

    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.performDraw(req.params.id);

    // Enviar emails para todos os participantes
    for (const [idDoador, idReceptor] of Object.entries(
      grupoAtualizado.drawResults
    )) {
      const receptor = await User.findById(idReceptor);
      await EmailService.sendDrawResults(idDoador, grupo.name, receptor.name);
    }

    res.json({ message: "Sorteio realizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/grupos/{id}/resultado:
 *   get:
 *     summary: Obter resultados do sorteio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
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
      return res.json({
        match: {
          id: receptor.id,
          name: receptor.name,
        },
      });
    }

    res.status(403).json({ error: "Não autorizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/grupos/usuario:
 *   get:
 *     summary: Obter grupos do usuário
 *     security:
 *       - bearerAuth: []
 */
router.get("/usuario", auth, async (req, res) => {
  try {
    const grupos = await Group.getUserGroups(req.user.id);
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
