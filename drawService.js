const Group = require("../models/group");
const { embaralhar } = require("../utils/arrays");

async function redistribuiSorteio(groupId) {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Grupo não encontrado");
  }

  if (!group.drawResults) {
    throw new Error("Não existe sorteio para redistribuir");
  }

  const participantes = [...group.participantes];
  let novosResultados;
  let tentativas = 0;
  const maxTentativas = 5;

  do {
    novosResultados = {};
    const participantesEmbaralhados = embaralhar([...participantes]);

    for (let i = 0; i < participantesEmbaralhados.length; i++) {
      const doador = participantesEmbaralhados[i];
      const receptor =
        participantesEmbaralhados[(i + 1) % participantesEmbaralhados.length];
      novosResultados[doador] = receptor;
    }

    tentativas++;
  } while (
    resultadosIguais(group.drawResults, novosResultados) &&
    tentativas < maxTentativas
  );

  if (resultadosIguais(group.drawResults, novosResultados)) {
    throw new Error("Não foi possível redistribuir o sorteio");
  }

  group.drawResults = novosResultados;
  group.drawDate = new Date().toISOString();

  await Group.atualizar(groupId, group); // Certifique-se de que `atualizar` existe no modelo `Group`.
  return group;
}

function resultadosIguais(resultados1, resultados2) {
  const chaves = Object.keys(resultados1);
  return chaves.every((chave) => resultados1[chave] === resultados2[chave]);
}

module.exports = {
  redistribuiSorteio,
};
