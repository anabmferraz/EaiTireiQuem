const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const USERS_FILE = path.join(__dirname, "../data/users.json");

class User {
  static async inicializar() {
    try {
      await fs.access(USERS_FILE);
    } catch {
      // Cria o arquivo inicial com contador e lista de usuários vazios
      await fs.writeFile(USERS_FILE, JSON.stringify({ counter: 0, users: [] }));
    }
  }

  static async buscarTodos() {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const { users } = JSON.parse(data);
    return users || [];
  }

  static async salvarTodos({ counter, users }) {
    // Salva o contador e a lista de usuários
    await fs.writeFile(USERS_FILE, JSON.stringify({ counter, users }, null, 2));
  }

  static async criar({ nome, email, senha }) {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const { counter, users } = JSON.parse(data);

    // Verifica se o e-mail já está cadastrado
    if (users.some((user) => user.email === email)) {
      throw new Error("E-mail já cadastrado");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUser = {
      id: counter, // Usa o contador como ID incremental
      nome,
      email,
      senha: senhaCriptografada,
      papel: "participante",
      criadoEm: new Date().toISOString(),
    };

    // Adiciona o novo usuário e incrementa o contador
    users.push(novoUser);
    await this.salvarTodos({ counter: counter + 1, users });

    const { senha: _, ...userSemSenha } = novoUser; // Remove a senha da resposta
    return userSemSenha;
  }

  static async buscarPorEmail(email) {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const { users } = JSON.parse(data);
    return users.find((user) => user.email === email);
  }

  static async buscarPorId(id) {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const { users } = JSON.parse(data);
    return users.find((user) => user.id === id);
  }

  static async excluir(id) {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const { counter, users } = JSON.parse(data);

    const usuariosAtualizados = users.filter((user) => user.id !== id);
    await this.salvarTodos({ counter, users: usuariosAtualizados });
  }
}

// Inicializa o arquivo de usuários na primeira execução
User.inicializar();

module.exports = User;
