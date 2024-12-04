function manipuladorDeErros(error, req, res, next) {
  console.error(`[Erro] ${error.stack}`);

  if (error instanceof Error) {
    return res.status(400).json({
      erro: "Erro de validação",
      detalhes: error.message,
    });
  }

  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      erro: "Não autorizado",
      detalhes: error.message,
    });
  }

  return res.status(500).json({
    erro: "Erro interno do servidor",
    detalhes:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Erro desconhecido",
  });
}

module.exports = manipuladorDeErros;
