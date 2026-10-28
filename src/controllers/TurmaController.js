const TurmaView = require('../views/TurmaView');

const TurmaController = {
    adicionar(sistema) {
        try {
            const nome = TurmaView.perguntarNome();
            const turma = sistema.adicionarTurma(nome);
            TurmaView.mostrarCadastrada(turma.nome);
        } catch (erro) {
            TurmaView.mostrarErroCadastro(erro.message);
        }
    },
};

module.exports = TurmaController;
