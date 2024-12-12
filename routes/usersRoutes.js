const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const logicaUser = require("../routes/userController");

const router = express.Router();

// Rota para criar um usuário
router.post("/", logicaUser.criar);

router.get("/", auth, isAdmin, logicaUser.buscarTodos);

module.exports = router;
