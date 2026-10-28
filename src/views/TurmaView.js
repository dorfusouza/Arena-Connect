const prompt = require('prompt-sync')();

// O que era prompt/console.log dentro do Model (adicionarTurma) mora aqui:
// só pergunta e mostra, nenhuma regra de negócio.
const TurmaView = {
    perguntarNome() {
        return prompt("Nome da nova turma: ");
    },
    mostrarCadastrada(nomeTurma) {
        console.log(`✔ Turma "${nomeTurma}" registrada!`);
    },
    mostrarErroCadastro(mensagem) {
        console.log(`✖ Turma não registrada: ${mensagem}`);
    },
};

module.exports = TurmaView;
