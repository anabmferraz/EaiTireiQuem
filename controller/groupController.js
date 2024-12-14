const Group = require("../models/group");
const User = require("../models/user");
const { validarNomeGrupo } = require("../utils/validation");

// Função para criar um novo grupo
async function criarGrupo(req, res) {
  try {
    if (!validarNomeGrupo(req.body.nome)) {
      return res.status(400).json({ error: "Nome do grupo inválido" });
    }

    const grupo = await Group.criar({
      nome: req.body.nome,
      adminId: req.user.id,
    });
    res.status(201).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Função para adicionar um participante ao grupo
async function adicionarParticipante(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.adicionarParticipante(
      req.params.id,
      req.body.userId
    );

    res.status(200).json(grupoAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Função para realizar o sorteio do amigo secreto
async function realizarSorteio(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.performDraw(req.params.id);
    res.json({ message: "Sorteio realizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Função para obter os resultados do sorteio
async function obterResultadosSorteio(req, res) {
  try {
    const grupo = await Group.findById(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    if (!grupo.drawResults) {
      return res
        .status(400)
        .json({ error: "O sorteio ainda não foi realizado" });
    }

    if (req.user.role === "admin" || grupo.adminId === req.user.id) {
      return res.json(grupo.drawResults);
    }

    if (grupo.participants.includes(req.user.id)) {
      const receptor = await User.findById(grupo.drawResults[req.user.id]);
      return res.json({
        match: {
          id: receptor.id,
          nome: receptor.nome,
        },
      });
    }

    res.status(403).json({ error: "Não autorizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Função para obter todos os grupos de um usuário
async function obterGruposUsuario(req, res) {
  try {
    const grupos = await Group.getUserGroups(req.user.id);
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Função para listar todos os grupos
async function listarTodosGrupos(req, res) {
  try {
    const grupos = await Group.buscarTodos(); // Busca todos os grupos do modelo
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Função para excluir um grupo
async function excluirGrupo(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);

    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    if (grupo.adminId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    await Group.excluir(req.params.id); // Exclui o grupo no modelo
    res.status(204).send(); // Retorna sucesso sem conteúdo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  criarGrupo,
  adicionarParticipante,
  realizarSorteio,
  obterResultadosSorteio,
  obterGruposUsuario,
  listarTodosGrupos,
  excluirGrupo,
};
