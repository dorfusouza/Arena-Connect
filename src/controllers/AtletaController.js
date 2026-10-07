const AtletaView = require("../views/AtletaView");

const AtletaController = {
    adicionar(sistema) {
        //Listar Turmas - TurmaVieW
        const idTurma = AtletaView.perguntarIdTurma();
        try {
            sistema.buscarTurmaOuFalhar(idTurma);
            const nome = AtletaView.perguntarNome();
            const { atleta, turma } = sistema.adicionarAtleta(idTurma, nome);
            AtletaView.mostrarAtletaVinculado(atleta.nome, turma.nome);
        } catch (erro) {
            AtletaView.mostrarErroCadastro(erro.message);
        }
    },

    // CORREÇÃO (05/10): chamava AtletaView.listar(...), que não existe — o
    // método certo é listarAtletas(...). Isso quebrava a opção 4 do menu.
    listar(sistema) {
        AtletaView.listarAtletas(sistema.listarAtletas());
    },
};

module.exports = AtletaController;
