require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerSetup = require("./swagger");
const routes = require("./routes");
const manipuladorDeErros = require("./middleware/error");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

swaggerSetup(app);

app.use("/api", routes);

app.use(manipuladorDeErros);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
  });
};

startServer();
