const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const ARQUIVO_LISTAS_DESEJO = path.join(
  __dirname,
  "../data/listas_desejo.json"
);

class ListaDesejo {
  static async inicializar() {
    try {
      await fs.access(ARQUIVO_LISTAS_DESEJO);
    } catch {
      await fs.writeFile(ARQUIVO_LISTAS_DESEJO, "[]");
    }
  }

  static async buscarTodas() {
    const dados = await fs.readFile(ARQUIVO_LISTAS_DESEJO, "utf8");
    return JSON.parse(dados);
  }

  static async criar({ userId, items }) {
    const listas = await this.buscarTodas();

    const listaExistente = listas.find((l) => l.userId === userId);
    if (listaExistente) {
      throw new Error("Usuário já possui uma lista de desejos");
    }

    const novaLista = {
      id: uuidv4(),
      userId,
      items: items.map((item) => ({
        id: uuidv4(),
        ...item,
        criadoEm: new Date().toISOString(),
      })),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    listas.push(novaLista);
    await this.salvarTodas(listas);
    return novaLista;
  }

  static async buscarPorUsuario(userId) {
    const listas = await this.buscarTodas();
    return listas.find((lista) => lista.userId === userId);
  }

  static async adicionarItem(userId, item) {
    const listas = await this.buscarTodas();
    const lista = listas.find((l) => l.userId === userId);

    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const novoItem = {
      id: uuidv4(),
      ...item,
      criadoEm: new Date().toISOString(),
    };

    lista.items.push(novoItem);
    lista.atualizadoEm = new Date().toISOString();

    await this.salvarTodas(listas);
    return novoItem;
  }

  static async removerItem(userId, itemId) {
    const listas = await this.buscarTodas();
    const lista = listas.find((l) => l.userId === userId);

    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const indiceItem = lista.items.findIndex((item) => item.id === itemId);
    if (indiceItem === -1) {
      throw new Error("Item não encontrado");
    }

    lista.items.splice(indiceItem, 1);
    lista.atualizadoEm = new Date().toISOString();

    await this.salvarTodas(listas);
  }

  static async atualizarItem(userId, itemId, atualizacoes) {
    const listas = await this.buscarTodas();
    const lista = listas.find((l) => l.userId === userId);

    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const item = lista.items.find((item) => item.id === itemId);
    if (!item) {
      throw new Error("Item não encontrado");
    }

    Object.assign(item, atualizacoes);
    lista.atualizadoEm = new Date().toISOString();

    await this.salvarTodas(listas);
    return item;
  }

  static async salvarTodas(listas) {
    await fs.writeFile(ARQUIVO_LISTAS_DESEJO, JSON.stringify(listas, null, 2));
  }
}

// Inicializa o arquivo de listas de desejos
ListaDesejo.init();

module.exports = ListaDesejo;
