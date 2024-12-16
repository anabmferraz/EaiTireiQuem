const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const {
  criar,
  buscarTodos,
  excluirUsuario,
} = require("../controller/userController");

router.post("/criar-usuario", criar);

router.get("/listar-usuarios", auth, isAdmin, buscarTodos);

router.delete("/deletar-usuario/:id", auth, isAdmin, excluirUsuario);

module.exports = router;
