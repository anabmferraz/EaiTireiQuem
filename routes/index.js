const express = require("express");
const router = express.Router();

const routes = {
  grupos: require("./groupRoutes"),
  especial: require("./specialRoutes"),
  auth: require("./authRoutes"),
  admin: require("./adminRoutes"),
};

Object.entries(routes).forEach(([path, routeHandler]) => {
  router.use(`/${path}`, routeHandler);
});

module.exports = router;
