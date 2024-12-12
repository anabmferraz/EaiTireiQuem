const Wishlist = require("../models/Wishlist");
const { validateWishlistItem } = require("../utils/validation");

const criarWishlist = async (req, res) => {
  try {
    const listaDesejos = await Wishlist.criar({
      userId: req.user.id,
      items: req.body.items || [],
    });
    res.status(201).json(listaDesejos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adicionarItem = async (req, res) => {
  try {
    if (!validateWishlistItem(req.body)) {
      return res.status(400).json({ error: "Dados do item inválidos" });
    }
    const item = await Wishlist.adicionarItem(req.listaDesejos.id, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removerItem = async (req, res) => {
  try {
    await Wishlist.removerItem(req.listaDesejos.id, req.params.itemId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const atualizarItem = async (req, res) => {
  try {
    const item = await Wishlist.atualizarItem(
      req.listaDesejos.id,
      req.params.itemId,
      req.body
    );
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obterListaDesejosPorUsuario = async (req, res) => {
  try {
    const listaDesejos = await Wishlist.buscarPorUsuario(req.user.id);
    if (!listaDesejos) {
      return res.status(404).json({ error: "Lista de desejos não encontrada" });
    }
    res.json(listaDesejos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarWishlist,
  adicionarItem,
  removerItem,
  atualizarItem,
  obterListaDesejosPorUsuario,
};
