const AtletaController = require('./src/controllers/AtletaController');
const ArenaConnect = require('./src/models/ArenaConnect');
const MenuView = require('./src/views/MenuView');

function main() {
    const sistema = ArenaConnect.getInstancia();

    while (true) {
        const op = MenuView.mostraMenu();
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
        else if (op === '0') break;
        else MenuView.mostrarOpcaoInvalida();
    }
}
if (require.main === module) {
    main();
}

