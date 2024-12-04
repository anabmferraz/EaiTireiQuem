const express = require("express");
const Wishlist = require("../models/wishlist");
const { auth } = require("../middleware/auth");
const { validateWishlistItem } = require("../utils/validation"); // Certifique-se de que a função exista
const router = express.Router();

// Criar uma nova lista de desejos
router.post("/", auth, async (req, res) => {
  try {
    const listaDesejos = await Wishlist.criar({
      userId: req.user.id,
      items: req.body.items || [],
    });
    res.status(201).json(listaDesejos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Adicionar um item à lista de desejos
router.post("/items", auth, async (req, res) => {
  try {
    if (!validateWishlistItem(req.body)) {
      return res.status(400).json({ error: "Dados do item inválidos" });
    }
    const item = await Wishlist.adicionarItem(req.user.id, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remover um item da lista de desejos
router.delete("/items/:itemId", auth, async (req, res) => {
  try {
    await Wishlist.removerItem(req.user.id, req.params.itemId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar um item na lista de desejos
router.patch("/items/:itemId", auth, async (req, res) => {
  try {
    const item = await Wishlist.atualizarItem(
      req.user.id,
      req.params.itemId,
      req.body
    );
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter a lista de desejos de um usuário
router.get("/usuario/:userId", auth, async (req, res) => {
  try {
    const listaDesejos = await Wishlist.buscarPorUsuario(req.params.userId);
    if (!listaDesejos) {
      return res.status(404).json({ error: "Lista de desejos não encontrada" });
    }
    res.json(listaDesejos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
