const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    console.log("Token recebido:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Usuário autenticado:", decoded);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Acesso restrito a administradores!" });
};

module.exports = { auth, isAdmin };
