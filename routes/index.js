const express = require("express");
const groupRoutes = require("./groupRoutes"); // Conectando o roteador de grupos
const specialRoutes = require("./specialRoutes"); // Rotas especiais (se aplicável)
const authRoutes = require("./authRoutes"); // Rotas de autenticação
const adminRoutes = require("./adminRoutes"); // Rotas administrativas

const router = express.Router();

// Conectando as rotas específicas
router.use("/grupos", groupRoutes);
router.use("/especial", specialRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
