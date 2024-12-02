//cadastro e gerenciamento de lista de desejos dos usuários 

const fs = require('fs').promises;
const { create } = require('domain');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const WISH_LIST_FILE = path.resolve(__dirname, '..', 'data', 'wish_list.json');

class ListaDesejo {
    static async init() {
        try {
            await fs.access(WISH_LIST_FILE);
        }catch {
            await fs.writeFile(WISH_LIST_FILE, '[]');
        }
    }

    static async buscarTodos() {
        const dados = await fs.readFile(WISH_LIST_FILE, 'utf8');
        return JSON.parse(dados);
    }

    static async criar({userId, item}){
        const wishList = await this.buscarTodos();

        const existeLista = wishList.find(w => w.userId === userId);
        if(existeLista){
            throw new Error('Lista de desejos já cadastrada para este usuário');
        }

        const novaLista = {
            id: uuidv4(),
            userId,
            items: items.map(item => ({
                ...item,
                createdAt: new Date().toISOString()
            })),
            createdAt: new Date().toISOString(),
            updateAt: new Date().toISOString()
        };

        wishList.push(novaLista);
        await this.salvarTodos(wishList);
        return novaLista;
    }

    static async buscarPorUsuario(userId){
        const wishList = await this.buscarTodos();
        return wishList.find(w => w.userId === userId);
    }

    static async adicionarItem(userId, item){
        const wishList = await this.buscarTodos();
        const lista = wishList.find(w => w.userId === userId);

        if(!lista){
            throw new Error('Lista de desejos não encontrada');
        }

        const novoItem = {
            id: uuidv4(),
            ...item,
            createdAt: new Date().toISOString()
        };

        wishList.items.push(novoItem);
        wishList.updateAt = new Date().toISOString();

        await this.salvarTodos(wishList);
        return item;
    }

    static async removerItem(userId, itemId){
        const wishList = await this.buscarTodos();
        const lista = wishList.find(w => w.userId === userId);

        if(!lista){
            throw new Error('Lista de desejos não encontrada');
        }

        const itemIndex = lista.items.findIndex(i => i.id === itemId);
        if(itemIndex === -1){
            throw new Error('Item não encontrado');
        }

        lista.items.splice(itemIndex, 1);
        lista.updateAt = new Date().toISOString();

        await this.salvarTodos(wishList);
        return true;
    }

    static async atualizarItem(userId, itemId, itemAtualizado){
        const wishList = await this.buscarTodos();
        const lista = wishList.find(w => w.userId === userId);

        if(!lista){
            throw new Error('Lista de desejos não encontrada');
        }

        const item = wishlist.items.find(item => item.id === itemId);
        if(!item){
            throw new Error('Item não encontrado');
        }

        Object.assign(item, itemAtualizado);
        wishList.updateAt = new Date().toISOString();

        await this.salvarTodos(wishList);
        return item;
    }

    static async salvarTodos(wishList){
        await fs.writeFile(WISH_LIST_FILE, JSON.stringify(wishList, null, 2));
    }
}

wishList.init();

module.exports = ListaDesejo;