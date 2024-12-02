//middleware que lida com erros 

function manipuladorDeErros(error, req, res, next){
    console.error(err.stack);

    if (error instanceof Error){
        return res.status(400).json({
            erro: 'Erro de Validação',
            detalhes: err.message,
        });
    }

    if (error.name === 'UnauthorizedError'){
        return res.status(401).json({
            erro: 'Não autorizado',
            detalhes: err.message,
        });
    }

    res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
}

module.exports = manipuladorDeErros;