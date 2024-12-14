const swaggerAutogen = require("swagger-autogen")();
output = "./swagger_doc.json";
(endpoints = [
  "./routes/authRoutes.js",
  "./routes/usersRoutes.js",
  "./routes/adminRoutes.js",
  "./routes/groupRoutes.js",
  "./routes/index.js",
  "./routes/specialRoutes.js",
  "./routes/wishlistRoutes.js",
]),
  swaggerAutogen(output, endpoints);
