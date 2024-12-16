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
      idAdmin: req.user.id, // Certifique-se de usar idAdmin aqui
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

    if (grupo.idAdmin !== req.user.id && req.user.papel !== "admin") {
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

    if (grupo.idAdmin !== req.user.id && req.user.papel !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    // Realiza o sorteio (certifique-se de que você tenha esse método no modelo)
    const grupoAtualizado = await Group.realizarSorteio(grupo.id);

    // Se o sorteio for realizado com sucesso, retorna o grupo atualizado
    res.json({
      message: "Sorteio realizado com sucesso",
      grupo: grupoAtualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Função para obter os resultados do sorteio
async function obterResultadosSorteio(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    // Verifica se o resultadoSorteio existe
    if (!grupo.resultadoSorteio) {
      return res
        .status(400)
        .json({ error: "O sorteio ainda não foi realizado" });
    }

    // Permissões de acesso aos resultados
    if (req.user.papel === "admin" || grupo.idAdmin === req.user.id) {
      return res.json(grupo.resultadoSorteio);
    }

    // Permissão para participantes do grupo
    if (grupo.participantes.includes(req.user.id)) {
      const receptor = await User.findById(grupo.resultadoSorteio[req.user.id]);
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
    const grupos = await Group.buscarTodos(req.user.id);
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

    if (grupo.adminId !== req.user.id && req.user.papel !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    await Group.excluir(req.params.id);
    res.status(204).send();
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
