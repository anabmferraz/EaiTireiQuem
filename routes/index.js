const express = require("express");
const router = express.Router();

const routes = {
  grupos: require("./logicagrupo"), // Roteador de grupos
  especial: require("./specialRoutes"), // Roteador de rotas especiais
  auth: require("./authRoutes"), // Roteador de autenticação
  admin: require("./adminRoutes"), // Roteador de admin
};

// Usando Object.entries para percorrer o objeto e associar as rotas
Object.entries(routes).forEach(([path, routeHandler]) => {
  router.use(`/${path}`, routeHandler); // Aqui, routeHandler deve ser o roteador do Express
});

module.exports = router;
