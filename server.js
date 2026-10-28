/**
 * ARENA-CONNECT — MENU DE TERMINAL
 * O estado do sistema é carregado ao abrir e salvo depois de cada operação.
 * A API (api.js) é OUTRO processo que usa o mesmo Model e o mesmo arquivo:
 * por isso o menu relê o arquivo antes de agir e salva depois.
 */
const ArenaConnect = require('./src/models/ArenaConnect');
const MenuView = require('./src/views/MenuView');
const TurmaController = require('./src/controllers/TurmaController');
const AtletaController = require('./src/controllers/AtletaController');
const ArbitroController = require('./src/controllers/ArbitroController');
const EquipeController = require('./src/controllers/EquipeController');
const PartidaController = require('./src/controllers/PartidaController');
const ClassificacaoController = require('./src/controllers/ClassificacaoController');

function main() {
    const sistema = ArenaConnect.getInstancia();
    sistema.carregarEstado(); // tenta recuperar o estado salvo da última vez

    while (true) {
        const op = MenuView.mostrarMenu();
        // A API pode ter alterado o arquivo enquanto o menu esperava a opção.
        // Relê ANTES de agir e salva DEPOIS: o terminal nunca grava por cima
        // do que a API cadastrou.
        sistema.carregarEstado(true);
        if (op === '1') TurmaController.adicionar(sistema);
        else if (op === '2') sistema.listarTurmas();
        else if (op === '3') AtletaController.adicionar(sistema);
        else if (op === '4') AtletaController.listar(sistema);
        else if (op === '5') ArbitroController.adicionar(sistema);
        else if (op === '6') ArbitroController.listar(sistema);
        else if (op === '7') EquipeController.adicionar(sistema);
        else if (op === '8') sistema.listarEquipes();
        else if (op === '9') EquipeController.vincularAtleta(sistema);
        else if (op === '10') EquipeController.desvincularAtleta(sistema);
        else if (op === '11') EquipeController.remover(sistema);
        else if (op === '12') PartidaController.registrarPartida(sistema);
        else if (op === '13') PartidaController.listar(sistema);
        else if (op === '14') ClassificacaoController.mostrar(sistema);
        else if (op === '0') break; // sai antes do salvar: nada mudou nesta volta
        else MenuView.mostrarOpcaoInvalida();
        sistema.salvarEstado();
    }
}

if (require.main === module) {
    main();
}

module.exports = { ArenaConnect };
