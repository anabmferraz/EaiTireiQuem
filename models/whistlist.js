//cadastro e gerenciamento de lista de desejos dos usuários

const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const WISH_LIST_FILE = path.resolve(__dirname, "..", "data", "wish_list.json");

class ListaDesejo {
  static async init() {
    try {
      await fs.access(WISH_LIST_FILE);
    } catch {
      await fs.writeFile(WISH_LIST_FILE, "[]");
    }
  }

  static async buscarTodos() {
    const dados = await fs.readFile(WISH_LIST_FILE, "utf8");
    return JSON.parse(dados || "[]");
  }

  static async criar({ userId, items }) {
    const wishList = await this.buscarTodos();

    if (wishList.some((w) => w.userId === userId)) {
      throw new Error("Lista de desejos já cadastrada para este usuário");
    }

    const novaLista = {
      id: uuidv4(),
      userId,
      items: items.map((item) => ({
        ...item,
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    wishList.push(novaLista);
    await this.salvarTodos(wishList);
    return novaLista;
  }

  static async buscarPorUsuario(userId) {
    const wishList = await this.buscarTodos();
    return wishList.find((w) => w.userId === userId);
  }

  static async adicionarItem(userId, item) {
    const wishList = await this.buscarTodos();
    const lista = wishList.find((w) => w.userId === userId);

    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const novoItem = {
      id: uuidv4(),
      ...item,
      createdAt: new Date().toISOString(),
    };

    lista.items.push(novoItem);
    lista.updateAt = new Date().toISOString();

    await this.salvarTodos(wishList);
    return novoItem;
  }

  static async salvarTodos(wishList) {
    await fs.writeFile(WISH_LIST_FILE, JSON.stringify(wishList, null, 2));
  }
}

ListaDesejo.init();

module.exports = ListaDesejo;
