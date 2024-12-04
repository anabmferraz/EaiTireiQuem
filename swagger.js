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
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSetup = (app) => {
  const specs = swaggerJsdoc(opcoesSwagger);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerSetup;
