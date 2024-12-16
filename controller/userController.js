const User = require("../models/user");

const criar = async (req, res) => {
  try {
    const user = await User.criar(req.body);
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
const excluirUsuario = async (req, res) => {
  try {
    // Verifica se o usuário que está tentando excluir tem permissão
    const usuario = await User.buscarPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await User.excluir(req.params.id);
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
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
  excluirUsuario,
};
