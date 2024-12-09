const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const logicauser = require("../routes/logicauser");

const router = express.Router();

router.post("/", logicauser.criar);

router.get("/", auth, isAdmin, logicauser.buscarTodos);

module.exports = router;
