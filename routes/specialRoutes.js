const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const { reajustar } = require("../services/drawService");

const router = express.Router();

/**
 * @swagger
 * /api/special/redistribute/{groupId}:
 *   post:
 *     summary: Redistribuir o sorteio do Amigo Secreto para um grupo
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sorteio redistribuído com sucesso
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Grupo não encontrado
 */
router.post("/reajustargroupId", auth, isAdmin, async (req, res) => {
  try {
    const result = await reajustar(req.params.groupId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
