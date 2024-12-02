//validação de dados como email e senha
//será usada para validar os dados de entrada do usuário
const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validarSenha = (senha) => {
    return senha.length >= 6;
};

const validarNomeGrupo = (nome) => {
    return nome.length >= 3 && nome.length <= 50;
};

modules.exports = {
    validarEmail,
    validarSenha,
    validarNomeGrupo
};