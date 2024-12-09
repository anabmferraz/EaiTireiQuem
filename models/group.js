const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { embaralhar } = require("../utils/arrays");
const ARQUIVO_GRUPOS = path.join(__dirname, "../data/grupos.json");

class Grupo {
  static async inicializar() {
    try {
      await fs.access(ARQUIVO_GRUPOS);
    } catch {
      await fs.writeFile(ARQUIVO_GRUPOS, "[]");
    }
  }

  static async buscarTodos() {
    const dados = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    return JSON.parse(dados);
  }

  static async salvarTodos(grupos) {
    await fs.writeFile(ARQUIVO_GRUPOS, JSON.stringify(grupos, null, 2));
  }

  static async criar({ nome, idAdmin }) {
    const grupos = await this.buscarTodos();

    const novoGrupo = {
      id: uuidv4(),
      nome,
      idAdmin,
      participantes: [idAdmin],
      status: "aberto",
      dataCriacao: new Date().toISOString(),
      resultadoSorteio: null,
      dataSorteio: null,
    };

    grupos.push(novoGrupo);
    await this.salvarTodos(grupos);
    return novoGrupo;
  }

  static async addParticipante(idGrupo, idUsuario) {
    const grupo = await this.buscarPorId(idGrupo);

    if (!grupo) throw new Error("Grupo não encontrado...");
    if (grupo.status !== "aberto")
      throw new Error("Grupo não está aberto para novos participantes.");
    if (grupo.participantes.includes(idUsuario))
      throw new Error("Usuário já está no grupo");

    grupo.participantes.push(idUsuario);
    await this.salvarTodos(await this.buscarTodos());
    return grupo;
  }

  static async realizarSorteio(idGrupo) {
    const grupo = await this.buscarPorId(idGrupo);

    if (!grupo) throw new Error("Grupo não encontrado...");
    if (grupo.participantes.length < 3)
      throw new Error(
        "É necessário pelo menos 3 participantes para realizar o sorteio"
      );

    const participantes = [...grupo.participantes];
    let sorteioValido = false;
    let resultadoSorteio = {};

    while (!sorteioValido) {
      sorteioValido = true;
      resultadoSorteio = {};
      const participantesEmbaralhados = embaralhar([...participantes]);

      for (let i = 0; i < participantes.length; i++) {
        const amgSecreto = participantes[i];
        const pessoaSorteada = participantesEmbaralhados[i];

        if (amgSecreto === pessoaSorteada) {
          sorteioValido = false;
          break;
        }
        resultadoSorteio[amgSecreto] = pessoaSorteada;
      }
    }

    grupo.resultadoSorteio = resultadoSorteio;
    grupo.dataSorteio = new Date().toISOString();
    grupo.status = "sorteado";
    await this.salvarTodos(await this.buscarTodos());
    return grupo;
  }

  static async atualizar(id, grupoAtualizado) {
    const grupos = await this.buscarTodos();
    const grupo = grupos.find((g) => g.id === id);

    if (!grupo) throw new Error("Grupo não encontrado...");

    Object.assign(grupo, grupoAtualizado);
    await this.salvarTodos(grupos);
    return grupo;
  }

  static async excluir(id) {
    const grupos = await this.buscarTodos();
    const gruposFiltrados = grupos.filter((g) => g.id !== id);
    await this.salvarTodos(gruposFiltrados);
  }

  static async buscarPorId(id) {
    const grupos = await this.buscarTodos();
    return grupos.find((grupo) => grupo.id === id);
  }

  static async buscarGruposDoUsuario(idUsuario) {
    const grupos = await this.buscarTodos();
    return grupos.filter(
      (grupo) =>
        grupo.participantes.includes(idUsuario) || grupo.idAdmin === idUsuario
    );
  }
}

Grupo.inicializar();

module.exports = Grupo;
