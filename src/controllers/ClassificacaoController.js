const ClassificacaoView = require('../views/ClassificacaoView');

// NOVO (Composição, parte 2/2): pede ao Model os dados prontos e manda a View mostrar.
const ClassificacaoController = {
    mostrar(sistema) {
        ClassificacaoView.mostrar(sistema.classificacaoGeral());
    },
};

module.exports = ClassificacaoController;
