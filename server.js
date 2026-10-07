/**
 * ARENA-CONNECT — 05/10/2026: PERSISTÊNCIA EM ARQUIVO
 * O estado do sistema é carregado ao abrir e salvo ao sair (opção 0).
 */
const ArenaConnect = require('./src/models/ArenaConnect');
const MenuView = require('./src/views/MenuView');
const AtletaController = require('./src/controllers/AtletaController');

function main() {
    const sistema = ArenaConnect.getInstancia();
    sistema.carregarEstado(); // NOVO: tenta recuperar o estado salvo da última vez

    while (true) {
        // CORREÇÃO (05/10): era MenuView.mostraMenu() (typo) — o método
        // certo é mostrarMenu(). Isso derrubava o sistema assim que abria.
        const op = MenuView.mostrarMenu();
        if (op === '1') sistema.adicionarTurma();
        else if (op === '2') sistema.listarTurmas();
        else if (op === '3') AtletaController.adicionar(sistema);
        else if (op === '4') AtletaController.listar(sistema);
        else if (op === '5') sistema.adicionarArbitro();
        else if (op === '6') sistema.listarArbitros();
        else if (op === '7') sistema.adicionarEquipe();
        else if (op === '8') sistema.listarEquipes();
        else if (op === '9') sistema.vincularAtletaEquipe();
        else if (op === '10') sistema.desvincularAtletaEquipe();
        else if (op === '11') sistema.removerEquipe();
        else if (op === '0') {
            sistema.salvarEstado(); // NOVO: grava tudo antes de sair
            break;
        }
        else MenuView.mostrarOpcaoInvalida();
    }
}

if (require.main === module) {
    main();
}

module.exports = { ArenaConnect };
