const express = require("express");
const { auth } = require("../middleware/auth");
const { getWishlistMiddleware } = require("../middleware/wish");
const wishlistController = require("../controllers/wishlistController");
const router = express.Router();

/**
 * @swagger
 * /api/wishlists:
 *   post:
 *     summary: Criar uma nova lista de desejos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 */
router.post("/", auth, wishlistController.criarWishlist);

/**
 * @swagger
 * /api/wishlists/items:
 *   post:
 *     summary: Adicionar um item à lista de desejos
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/items",
  auth,
  getWishlistMiddleware,
  wishlistController.adicionarItem
);

/**
 * @swagger
 * /api/wishlists/items/{itemId}:
 *   delete:
 *     summary: Remover um item da lista de desejos
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/items/:itemId",
  auth,
  getWishlistMiddleware,
  wishlistController.removerItem
);

/**
 * @swagger
 * /api/wishlists/items/{itemId}:
 *   patch:
 *     summary: Atualizar um item na lista de desejos
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/items/:itemId",
  auth,
  getWishlistMiddleware,
  wishlistController.atualizarItem
);

/**
 * @swagger
 * /api/wishlists/usuario:
 *   get:
 *     summary: Obter a lista de desejos de um usuário
 *     security:
 *       - bearerAuth: []
 */
router.get("/usuario", auth, wishlistController.obterListaDesejosPorUsuario);

module.exports = router;
