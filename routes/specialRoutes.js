const express = require("express");
const { auth, Admin } = require("../middleware/auth");
const groupService = require("../routes/groupRoutes");
console.log(groupService); // Adicione este log

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
 */
router.post("/", auth, groupService.createGroup);

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
 */
router.patch("/:id/adicionar-usuario", auth, groupService.addParticipant);

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
router.post("/:id/sorteio", auth, groupService.performDraw);

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
router.get("/:id/resultado", auth, groupService.getDrawResults);

/**
 * @swagger
 * /api/grupos/usuario:
 *   get:
 *     summary: Obter grupos do usuário
 *     security:
 *       - bearerAuth: []
 */
router.get("/usuario", auth, groupService.getUserGroups);

module.exports = router;
