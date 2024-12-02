//lógica de sorteio do amigo secreto

const Group = require('../models/group');
const { shuffle } = require('../utils/arrays');

async function redistribuiSorteio(groupId) {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error('Grupo não encontrado');
    }

    if (!group.drawResults){
        throw new Error('Não Existe sorteio para redistribuir');
    }

    const participantes = [...group.participantes];
    let novosResultados;
    let tentativas = 0;
    const maxTentativas = 5;

    do {
        novosResultados = {};
        const participantesEmbaralhados = shuffle([...participantes]);

        for (let i = 0; i <participantesEmbaralhados.length; i++) {
            const doador = participantesEmbaralhados[i];
            const recetor = participantesEmbaralhados[(i + 1) % participantesEmbaralhados.length];
            novosResultados[doador] = recetor;
        }

        tentativas++;
    }while (
        resultadosIguais(group.drawResults, novosResultados) && tentativas < maxTentativas
    );

    if (resultadosIguais(group.drawResults, novosResultados)) {
        throw new Error('Não foi possível redistribuir o sorteio');
    }

    group.drawResults = novosResultados;
    group.drawDate = new Date().toISOString();

    await Group.update(groupId, group);
    return group;
}

function resultadosIguais(resultados1, resultados2) {
    const chaves = Object.keys(resultados1);
    return chaves.every (chave => resultados1[chave] === resultados2[chave]);
}

module.exports = {
    redistribuiSorteio
};