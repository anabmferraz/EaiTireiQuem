require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_doc.json"); // Corrija o caminho se necessário
const routes = require("./routes");
const manipuladorDeErros = require("./middleware/error");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Configuração do frontend permitido
    credentials: true, // Permitir envio de cookies
  })
);

// Middlewares gerais
app.use(express.json());

// Correção: passando o swaggerDocument, não o swaggerUi
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use("/api", routes);

// Manipulador de erros
app.use(manipuladorDeErros);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
