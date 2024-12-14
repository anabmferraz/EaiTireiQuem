const fs = require("fs").promises;
const path = require("path");
const { embaralhar } = require("../utils/arrays");

const ARQUIVO_GRUPOS = path.join(__dirname, "../data/grupos.json");

class Grupo {
  static async inicializar() {
    try {
      await fs.access(ARQUIVO_GRUPOS);
    } catch {
      // Inicializa o arquivo com um contador e lista de grupos vazios
      await fs.writeFile(
        ARQUIVO_GRUPOS,
        JSON.stringify({ counter: 0, grupos: [] })
      );
    }
  }

  static async buscarTodos() {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { grupos } = JSON.parse(data);
    return grupos || [];
  }

  static async salvarTodos({ counter, grupos }) {
    await fs.writeFile(
      ARQUIVO_GRUPOS,
      JSON.stringify({ counter, grupos }, null, 2)
    );
  }

  static async criar({ nome, idAdmin }) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    const novoGrupo = {
      id: counter, // ID incremental
      nome,
      idAdmin,
      participantes: [idAdmin],
      status: "aberto",
      dataCriacao: new Date().toISOString(),
      resultadoSorteio: null,
      dataSorteio: null,
    };

    grupos.push(novoGrupo);

    // Incrementa o contador e salva os dados atualizados
    await this.salvarTodos({ counter: counter + 1, grupos });
    return novoGrupo;
  }

  static async adicionarParticipante(idGrupo, idUsuario) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);
    const grupo = grupos.find((g) => g.id === idGrupo);

    if (!grupo) throw new Error("Grupo não encontrado.");
    if (grupo.status !== "aberto")
      throw new Error("Grupo não está aberto para novos participantes.");
    if (grupo.participantes.includes(idUsuario))
      throw new Error("Usuário já está no grupo.");

    grupo.participantes.push(idUsuario);

    await this.salvarTodos({ counter, grupos });
    return grupo;
  }

  static async buscarPorId(id) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { grupos } = JSON.parse(data);
    return grupos.find((g) => g.id === id);
  }

  static async excluir(id) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    const gruposFiltrados = grupos.filter((g) => g.id !== id);

    await this.salvarTodos({ counter, grupos: gruposFiltrados });
  }
}

Grupo.inicializar();

module.exports = Grupo;
