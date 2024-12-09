const express = require("express");
const router = express.Router();

const routes = {
  grupos: require("./groupRoutes"), // Roteador de grupos
  especial: require("./specialRoutes"), // Roteador de rotas especiais
  auth: require("./authRoutes"), // Roteador de autenticação
  admin: require("./adminRoutes"), // Roteador de admin
  usuarios: require("./logicauser"), // Roteador de usuários
};

// Usando Object.entries para registrar rotas
Object.entries(routes).forEach(([path, routeHandler]) => {
  if (
    typeof routeHandler === "function" ||
    typeof routeHandler.use === "function"
  ) {
    router.use(`/${path}`, routeHandler);
  } else {
    console.error(
      `Roteador para "${path}" não é válido. Verifique a exportação.`
    );
  }
});

module.exports = router;
