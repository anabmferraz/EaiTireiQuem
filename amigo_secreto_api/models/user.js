//gerencia o usuário comum (CRUD - AUTENTICAÇÃO) armazenados em um arquivo JSON

const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class Usuario{
    static async inicializar() {
        try {
            await fs.access(USERS_FILE);
        } catch {
            await fs.writeFile(USERS_FILE, '[]');
        }
    }
    static async buscarTodos() {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    }
    static async criar({ nome, email, senha }) {
        const users = await this.buscarTodos();

        if (users.some((user) => user.email === email)) {
            throw new Error('E-mail já cadastrado');
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const novoUser = {
            id: uuidv4(),
            nome,
            email,
            senha: senhaCriptografada,
            papel: 'participante',
            criadoEm: new Date().toISOString(),
        };
        users.push(novoUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

        const { senha: _, ...userSemSenha } = novoUser;
        return userSemSenha;
    }
    static async buscarPorEmail(email) {
        const users = await this.buscarTodos();
        return users.find((user) => user.email === email);
    }
    static async buscarPorId(id) {
        const users = await this.buscarTodos();
        return users.find((user) => user.id === id);
    }
}
Usuario.inicializar();

module.exports = Usuario;