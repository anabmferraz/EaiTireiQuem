const User = require("../models/user");

const criar = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const buscarTodos = async (req, res) => {
  try {
    const users = await User.getAll();
    const usersWithoutPasswords = users.map(removeSensitiveData);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function removeSensitiveData(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  criar,
  buscarTodos,
};
