const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validarSenha = (senha) => senha.length >= 6;

const validarNomeGrupo = (nome) => nome.length >= 3 && nome.length <= 50;

module.exports = {
  validarEmail,
  validarSenha,
  validarNomeGrupo,
};
