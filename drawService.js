const Group = require("./models/group");
const { embaralhar } = require("./utils/arrays");

const MAX_TENTATIVAS = 5;

async function reajustarSorteio(groupId) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Grupo não encontrado");
  if (!group.drawResults)
    throw new Error("Não existe sorteio para redistribuir");

  const participantes = [...group.participantes];
  let novosResultados;
  let tentativas = 0;

  do {
    novosResultados = embaralharSorteio(participantes);
    tentativas++;
  } while (
    resultadosIguais(group.drawResults, novosResultados) &&
    tentativas < MAX_TENTATIVAS
  );

  if (resultadosIguais(group.drawResults, novosResultados)) {
    throw new Error("Não foi possível redistribuir o sorteio");
  }

  group.drawResults = novosResultados;
  group.drawDate = new Date().toISOString();

  await Group.atualizar(groupId, group);
  return group;
}

function embaralharSorteio(participantes) {
  const sorteio = {};
  const participantesEmbaralhados = embaralhar([...participantes]);

  participantesEmbaralhados.forEach((doador, i) => {
    const receptor =
      participantesEmbaralhados[(i + 1) % participantesEmbaralhados.length];
    sorteio[doador] = receptor;
  });

  return sorteio;
}

function resultadosIguais(resultados1, resultados2) {
  return Object.keys(resultados1).every(
    (key) => resultados1[key] === resultados2[key]
  );
}

module.exports = {
  reajustarSorteio,
};
