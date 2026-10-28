const EquipeView = require('../views/EquipeView');
const Modalidade = require('../models/Modalidade');

const EquipeController = {
    adicionar(sistema) {
        sistema.listarTurmas();
        const idTurma = EquipeView.perguntarIdTurma();
        try {
            sistema.buscarTurmaOuFalhar(idTurma); // falha cedo: não adianta perguntar a modalidade de uma turma que não existe
            const modalidade = EquipeView.perguntarModalidade(Object.values(Modalidade));
            const { equipe, turma } = sistema.adicionarEquipe(idTurma, modalidade);
            EquipeView.mostrarRegistrada(turma.nome, equipe.modalidade);
        } catch (erro) {
            EquipeView.mostrarErroCadastro(erro.message);
        }
    },

    remover(sistema) {
        sistema.listarEquipes();
        const idEquipe = EquipeView.perguntarIdEquipe("ID da Equipe a remover: ");
        try {
            sistema.removerEquipe(idEquipe);
            EquipeView.mostrarRemovida(sistema.atletas.length);
        } catch (erro) {
            EquipeView.mostrarErroRemocao(erro.message);
        }
    },

    vincularAtleta(sistema) {
        sistema.listarEquipes();
        const idEquipe = EquipeView.perguntarIdEquipe();
        try {
            sistema.buscarEquipeOuFalhar(idEquipe); // falha cedo, antes de pedir o atleta
            const idAtleta = EquipeView.perguntarIdAtleta();
            const { equipe, atleta } = sistema.vincularAtletaEquipe(idEquipe, idAtleta);
            EquipeView.mostrarVinculado(atleta.nome, equipe.modalidade);
        } catch (erro) {
            EquipeView.mostrarErroVinculo(erro.message);
        }
    },

    desvincularAtleta(sistema) {
        sistema.listarEquipes();
        const idEquipe = EquipeView.perguntarIdEquipe();
        try {
            sistema.buscarEquipeOuFalhar(idEquipe);
            const idAtleta = EquipeView.perguntarIdAtleta("ID do Atleta a remover da equipe: ");
            const { atleta } = sistema.desvincularAtletaEquipe(idEquipe, idAtleta);
            EquipeView.mostrarDesvinculado(atleta.nome, sistema.atletas.length);
        } catch (erro) {
            EquipeView.mostrarErroDesvinculo(erro.message);
        }
    },
};

module.exports = EquipeController;
