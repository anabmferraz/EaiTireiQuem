const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const {
  criarGrupo,
  adicionarParticipante,
  realizarSorteio,
  obterResultadosSorteio,
  obterGruposUsuario,
  listarTodosGrupos,
  excluirGrupo,
} = require("../controller/groupController");

/**
 * @swagger
 * /api/grupos/criar:
 *   post:
 *     summary: Create a new Secret Santa group
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post("/criar", auth, criarGrupo);

/**
 * @swagger
 * /api/grupos/{id}/adicionar-participante:
 *   patch:
 *     summary: Add a participant to a group
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
 *     responses:
 *       200:
 *         description: Participant added successfully
 */
router.patch("/:id/adicionar-participante", auth, adicionarParticipante);

/**
 * @swagger
 * /api/grupos/{id}/sortear:
 *   post:
 *     summary: Perform the Secret Santa draw
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Draw completed successfully
 */
router.post("/:id/sortear", auth, realizarSorteio);

/**
 * @swagger
 * /api/grupos/{id}/resultados:
 *   get:
 *     summary: Get draw results
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Results retrieved successfully
 */
router.get("/:id/resultados", auth, obterResultadosSorteio);

/**
 * @swagger
 * /api/grupos/listar-usuario:
 *   get:
 *     summary: Get all groups a user is part of
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups retrieved successfully
 */
router.get("/listar-usuario/:id", auth, obterGruposUsuario);

/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: List all groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all groups retrieved successfully
 */
router.get("/", auth, isAdmin, listarTodosGrupos);

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Delete a group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Group deleted successfully
 */
router.delete("/deletar/:id", auth, isAdmin, excluirGrupo);

module.exports = router;
