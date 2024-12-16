const fs = require("fs").promises;
const path = require("path");

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
      participantes: [idAdmin], // Inicializa com o admin apenas
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

    idGrupo = Number(idGrupo);
    idUsuario = Number(idUsuario);

    console.log("ID do Grupo:", idGrupo); // Log do ID do grupo
    console.log("ID do Usuário:", idUsuario); // Log do ID do usuário

    const grupo = grupos.find((g) => g.id === idGrupo);

    if (!grupo) {
      console.error("Grupo não encontrado: ", idGrupo); // Log de erro
      throw new Error("Grupo não encontrado.");
    }

    if (grupo.status !== "aberto")
      throw new Error("Grupo não está aberto para novos participantes.");

    grupo.participantes = grupo.participantes.filter((part) => part !== null);

    if (grupo.participantes.includes(idUsuario))
      throw new Error("Usuário já está no grupo.");

    grupo.participantes.push(idUsuario);

    await this.salvarTodos({ counter, grupos });
    return grupo;
  }

  static async buscarPorId(id) {
    id = Number(id);
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

  // Método estático para realizar o sorteio
  static async realizarSorteio(idGrupo) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    const grupo = grupos.find((g) => g.id === idGrupo);
    if (!grupo) {
      throw new Error("Grupo não encontrado.");
    }

    // Verifica se o grupo já está finalizado
    if (grupo.status === "finalizado") {
      throw new Error("O sorteio já foi realizado.");
    }

    // Embaralha os participantes
    const participantes = grupo.participantes.slice(); // Copia a lista de participantes
    const resultados = {};

    // Embaralhamento usando o algoritmo de Fisher-Yates
    for (let i = participantes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantes[i], participantes[j]] = [
        participantes[j],
        participantes[i],
      ];
    }

    // Atribui amigos secretos (ninguém pode tirar a si mesmo)
    for (let i = 0; i < grupo.participantes.length; i++) {
      resultados[grupo.participantes[i]] =
        participantes[(i + 1) % grupo.participantes.length];
    }

    // Atualiza o grupo com o resultado do sorteio
    grupo.resultadoSorteio = resultados;
    grupo.dataSorteio = new Date().toISOString();
    grupo.status = "finalizado"; // Altera o status para 'finalizado'

    // Salva os dados atualizados
    await this.salvarTodos({ counter, grupos });

    return grupo;
  }
}

// Inicializa o arquivo de grupos
Grupo.inicializar();

module.exports = Grupo;
