//Centraliza e organiza todas as rotas da aplicação

const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const groupRoutes = require("./groupRoutes");
const specialRoutes = require("./specialRoutes");
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/groups", groupRoutes);
router.use("/special", specialRoutes);
module.exports = router;
