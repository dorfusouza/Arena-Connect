const prompt = require('prompt-sync')();

const MenuView = {
    mostrarMenu() {
        console.log(`
 ==============================
 ARENA-CONNECT v3.0 - PBE1 - Singleton + Factory
 ==============================
 1. Registrar Turma
 2. Listar Turmas
 3. Registrar Atleta
 4. Listar Atletas
 5. Registrar Árbitro
 6. Listar Árbitros
 7. Registrar Equipe
 8. Listar Equipes
 9. Vincular Atleta à Equipe
 10. Desvincular Atleta da Equipe
 11. Remover Equipe
 0. Sair
 ==============================`);
        return prompt("Escolha: ");
    },
    mostrarOpcaoInvalida() {
        console.log("Opção inválida!");
    }
};

module.exports = MenuView;