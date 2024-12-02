//middleware de autentificação de usuário (verifica se está autenticado antes de ter acesso as rotas)
//gera um token, garante que apenas admins tenham acesso a ações específicas

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';

const autenticar = (req, res, next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token){
            throw new Error()
        }

        const decodificado = jwt.verify(token, JWT_SECRET);
        req.usuario = decodificado;
        next();
    }catch(error){
        res.status(401).send({erro: 'Por favor, autentique-se'});
    }
};

const eAdmin = (req, res, next) => {
    if (req.usuario?.tipo !== 'admin'){
        return res.status(403).send({erro: 'Acesso negado'});
    }
    next();
};

module.exports = {autenticar, eAdmin};