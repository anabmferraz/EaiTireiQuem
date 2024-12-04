const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const userService = require("../services/userService");

const router = express.Router();

router.post("/", userService.createUser);

router.get("/", auth, isAdmin, userService.getAllUsers);

module.exports = router;
