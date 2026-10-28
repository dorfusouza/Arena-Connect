const prompt = require('prompt-sync')();

// O que era prompt/console.log dentro do Model (adicionarEquipe, removerEquipe,
// vincularAtletaEquipe, desvincularAtletaEquipe) mora aqui.
const EquipeView = {
    perguntarIdTurma() {
        return parseInt(prompt("ID da Turma: "));
    },
    perguntarModalidade(modalidades) {
        console.log("\nModalidades disponíveis:");
        modalidades.forEach(m => console.log(`- ${m}`));
        return prompt("Modalidade (copie exatamente como está na lista acima): ");
    },
    perguntarIdEquipe(rotulo = "ID da Equipe: ") {
        return parseInt(prompt(rotulo));
    },
    perguntarIdAtleta(rotulo = "ID do Atleta: ") {
        return parseInt(prompt(rotulo));
    },
    mostrarRegistrada(nomeTurma, modalidade) {
        console.log(`✔ Equipe registrada: ${nomeTurma} em "${modalidade}"!`);
    },
    mostrarErroCadastro(mensagem) {
        console.log(`✖ Equipe não registrada: ${mensagem}`);
    },
    mostrarRemovida(totalAtletas) {
        console.log(`✔ Equipe removida. Os atletas continuam no sistema (total de atletas: ${totalAtletas}).`);
    },
    mostrarErroRemocao(mensagem) {
        console.log(`✖ Não foi possível remover: ${mensagem}`);
    },
    mostrarVinculado(nomeAtleta, modalidade) {
        console.log(`✔ ${nomeAtleta} vinculado à equipe de "${modalidade}"!`);
    },
    mostrarErroVinculo(mensagem) {
        console.log(`✖ Não foi possível vincular: ${mensagem}`);
    },
    mostrarDesvinculado(nomeAtleta, totalAtletas) {
        console.log(`✔ ${nomeAtleta} removido da equipe. Ele continua no sistema (total de atletas: ${totalAtletas}).`);
    },
    mostrarErroDesvinculo(mensagem) {
        console.log(`✖ Não foi possível desvincular: ${mensagem}`);
    },
};

module.exports = EquipeView;
