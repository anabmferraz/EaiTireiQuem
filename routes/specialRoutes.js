const express = require("express");
const { auth, Admin } = require("../middleware/auth");
const logicagrupo = require("../routes/groupRoutes");
console.log(logicagrupo); // Adicione este log

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
router.post("/", auth, logicagrupo.createGroup);

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
router.patch("/:id/adicionar-usuario", auth, logicagrupo.addParticipant);

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
router.post("/:id/sorteio", auth, logicagrupo.performDraw);

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
router.get("/:id/resultado", auth, logicagrupo.getDrawResults);

/**
 * @swagger
 * /api/grupos/usuario:
 *   get:
 *     summary: Obter grupos do usuário
 *     security:
 *       - bearerAuth: []
 */
router.get("/usuario", auth, logicagrupo.getUserGroups);

module.exports = router;
