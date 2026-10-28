const ArbitroView = require('../views/ArbitroView');

const ArbitroController = {
    adicionar(sistema) {
        const nome = ArbitroView.perguntarNome();
        const numeroCredencial = ArbitroView.perguntarCredencial();
        const anosExperiencia = ArbitroView.perguntarExperiencia();
        try {
            sistema.adicionarArbitro(nome, numeroCredencial, anosExperiencia);
            ArbitroView.mostrarCadastrado();
        } catch (erro) {
            ArbitroView.mostrarErroCadastro(erro.message);
        }
    },

    listar(sistema) {
        ArbitroView.listarArbitros(sistema.listarArbitros());
    },
};

module.exports = ArbitroController;
