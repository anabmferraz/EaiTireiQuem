const jwt = require("jsonwebtoken");

const generateToken = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    role: usuario.papel || "user",
  };

  const JWT_SECRET = process.env.JWT_SECRET || "chave-secreta";

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

module.exports = { generateToken };
