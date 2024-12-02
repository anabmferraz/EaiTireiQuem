//função para reordenar os elementos de um array em uma ordem aleatória
//será usada para embaralhar os participantes do amigo secreto
function embaralhar(array){
    const arrayEmbaralhado = [...array];
    for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
    }
    return arrayEmbaralhado;
}

MediaSourceHandle.exports = {
    embaralhar
};