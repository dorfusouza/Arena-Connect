const AtletaView = require("../views/AtletaView");

const AtletaController = {
    adicionar(sistema){
        //Listar Turmas - TurmaVieW
        const idTurma = AtletaView.perguntarIdTurma();
        try {
            sistema.buscarTurmaOuFalhar(idTurma);
            const nome = AtletaView.perguntarNome();
            const { atleta, turma } = sistema.adicionarAtleta(idTurma, nome);
            AtletaView.mostrarAtletaVinculado(atleta.nome, turma.nome);
        } catch(erro) {
            AtletaView.mostrarErroCadastro(erro.message);
        }
    },

    listar(sistema) {
        AtletaView.listar(sistema.listarAtletas());
    },
};

module.exports = AtletaController;