//Gerencia os dados de administradores (CRUD) armazenados em um arquivo JSON

const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const ADMINS_FILE = path.join(__dirname, '../data/admins.json');

class Administrador{
    static async inicializar() {
        try {
            await fs.access(ADMINS_FILE);
        } catch {
            const adminPadrao = {
                id: uuidv4(),
                nome: 'administrador',
                email: 'admin@exemplo.com',
                senha: await bcrypt.hash('adminteste', 10),
                papel: 'admin',
                criadoEm: new Date().toISOString(),
            };
            await fs.writeFile(ADMINS_FILE, JSON.stringify([adminPadrao], null, 2));
        }
    }
    static async buscarTodos() {
        const data = await fs.readFile(ADMINS_FILE, 'utf8');
        return JSON.parse(data);
    }
    static async criar({ nome, email, senha }) {
        const admins = await this.buscarTodos();

        if (admins.some((admin) => admin.email === email)) {
            throw new Error('E-mail já cadastrado');
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const novoAdmin = {
            id: uuidv4(),
            nome,
            email,
            senha: senhaCriptografada,
            papel: 'admin',
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
Administrador.inicializar();

module.exports = Administrador;