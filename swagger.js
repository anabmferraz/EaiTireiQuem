const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const opcoesSwagger = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Amigo Secreto API",
      version: "1.0.0",
      description: "API para gerenciar sorteios de amigo secreto",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL do servidor
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  apis: ["./routes/*.js"], // Certifique-se de que as rotas tenham a documentação Swagger.
};

const specs = swaggerJsdoc(opcoesSwagger);

function swaggerSetup(app) {
  // Configura o Swagger UI no caminho /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = swaggerSetup;
