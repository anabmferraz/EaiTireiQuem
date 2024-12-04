const User = require("../models/user");

async function createUser(req, res) {
  try {
    const user = await User.criar(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.buscarTodos();
    const sanitizedUsers = users.map(removeSensitiveData);
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function removeSensitiveData(user) {
  const { senha, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  createUser,
  getAllUsers,
};
