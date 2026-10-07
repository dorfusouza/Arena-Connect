const prompt = require('prompt-sync')();

const PartidaView = {
    perguntarIdEquipe(mensagem) {
        return parseInt(prompt(mensagem));
    },
    perguntarGols(mensagem) {
        return parseInt(prompt(mensagem));
    },
    mostrarRegistrada(nomeA, golsA, nomeB, golsB) {
        console.log(`[SUCESSO] Partida registrada: ${nomeA} ${golsA} x ${golsB} ${nomeB}!`);
    },
    mostrarErroCadastro(mensagem) {
        console.log(`[ERRO] Não foi possível registrar a partida: ${mensagem}`);
    },
    listarPartidas(lista) {
        console.log("\n=== LISTA DE PARTIDAS ===");
        if (lista.length === 0) return console.log("Nenhuma partida registrada!");
        lista.forEach(({ partida, nomeEquipeA, nomeEquipeB }) => {
            partida.exibir(nomeEquipeA, nomeEquipeB)
        });
    }
}

module.exports = PartidaView;