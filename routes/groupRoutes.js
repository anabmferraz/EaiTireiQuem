// groupRoutes.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  criarGrupo,
  adicionarParticipante,
  realizarSorteio,
  obterResultadosSorteio,
  obterGruposUsuario,
} = require("../controllers/groupController");

/**
 * @swagger
 * /api/groups:
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
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post("/grupos", auth, criarGrupo);

/**
 * @swagger
 * /api/groups/{id}/add-user:
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
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Group not found
 */
router.patch("/grupos/:id/participantes", auth, adicionarParticipante);

/**
 * @swagger
 * /api/groups/{id}/draw:
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
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Group not found
 */
router.post("/grupos/:id/sorteio", auth, realizarSorteio);

/**
 * @swagger
 * /api/groups/{id}/result:
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
 *       400:
 *         description: Draw has not been performed yet
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Group not found
 */
router.get("/grupos/:id/resultados", auth, obterResultadosSorteio);

/**
 * @swagger
 * /api/groups/user:
 *   get:
 *     summary: Get all groups a user is part of
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups retrieved successfully
 */
router.get("/grupos", auth, obterGruposUsuario);

module.exports = router;
