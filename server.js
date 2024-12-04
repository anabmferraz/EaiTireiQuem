require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerSetup = require("./swagger"); // Importando a configuração do Swagger
const routes = require("./routes");
const manipuladorDeErros = require("./middleware/error");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Configuração do Swagger
swaggerSetup(app);

// Rotas principais
app.use("/api", routes);

// Middleware de tratamento de erros
app.use(manipuladorDeErros);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
