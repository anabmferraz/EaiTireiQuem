
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger'); // Arquivo de configuração do Swagger
const routes = require('./routes'); // Centraliza todas as rotas da aplicação
const { errorHandler } = require('./middleware/error'); // Middleware de erros

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Configuração do Swagger
swaggerSetup(app);

// Rotas principais
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
