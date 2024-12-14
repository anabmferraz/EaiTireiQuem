const fs = require("fs").promises;
const path = require("path");
// Removida a linha de importação do bcrypt aqui, já que está sendo importado em outro lugar
const { v4: uuidv4 } = require("uuid");

const ADMINS_FILE = path.join(__dirname, "../data/admins.json");

class Admin {
  static async inicializar() {
    try {
      await fs.access(ADMINS_FILE);
    } catch {
      const adminPadrao = await this.criarAdminPadrao();
      await fs.writeFile(ADMINS_FILE, JSON.stringify([adminPadrao], null, 2));
    }
  }
  static async criarAdminPadrao() {
    // Movido o bcrypt para ser importado aqui quando necessário
    const bcrypt = require("bcryptjs");
    const senhaCriptografada = await bcrypt.hash("admin123", 10);
    return {
      id: uuidv4(),
      nome: "admin",
      email: "admin@gmail.com",
      senha: senhaCriptografada,
      papel: "admin",
      criadoEm: new Date().toISOString(),
    };
  }

  static async buscarTodos() {
    const data = await fs.readFile(ADMINS_FILE, "utf8");
    return JSON.parse(data);
  }

  static async criar({ nome, email, senha }) {
    const admins = await this.buscarTodos();
    const bcrypt = require("bcryptjs");

    if (admins.some((admin) => admin.email === email)) {
      throw new Error("E-mail já cadastrado");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoAdmin = {
      id: uuidv4(),
      nome,
      email,
      senha: senhaCriptografada,
      papel: "admin",
      criadoEm: new Date().toISOString(),
    };

    admins.push(novoAdmin);
    await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2));

    const { senha: _, ...adminSemSenha } = novoAdmin;
    return adminSemSenha;
  }

  static async buscarPorEmail(email) {
    const admins = await this.buscarTodos();
    return admins.find((admin) => admin.email === email);
  }

  static async buscarPorId(id) {
    const admins = await this.buscarTodos();
    return admins.find((admin) => admin.id === id);
  }
}

Admin.inicializar();

module.exports = Admin;
