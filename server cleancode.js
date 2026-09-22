const prompt = require('prompt-sync')();
const Modalidade = require('./src/models/Modalidade')
const { Pessoa, Arbitro, Atleta } = require('./src/models/Pessoa')
const Equipe = require('./src/models/Equipe')
const Turma = require('./src/models/Turma')

// 4. A Classe Gerenciadora
class ArenaConnect {
    constructor() {
        this.turmas = [];
        this.atletas = [];
        this.arbitros = [];
        this.equipes = [];
        this.idTurmaContador = 1;
        this.idAtletaContador = 1;
        this.idArbitroContador = 1;
        this.idEquipeContador = 1;
    }

    adicionarTurma() {
        const nome = prompt("Nome da nova turma: ");
        const novaTurma = new Turma(this.idTurmaContador++, nome);
        if (!novaTurma.nome) {
            console.log("✖ Turma não registrada: nome inválido.");
            return;
        }
        this.turmas.push(novaTurma);
        console.log("✔ Turma registrada com sucesso!");
    }

    listarTurmas() {
        console.log("\n=== LISTA DE TURMAS ===");
        if (this.turmas.length === 0) return console.log("Nenhuma turma no sistema.");
        this.turmas.forEach(t => t.exibir());
    }

    adicionarAtleta() {
        this.listarTurmas();
        const idT = parseInt(prompt("ID da Turma do atleta: "));
        const turmaExiste = this.turmas.find(t => t.id === idT);
        if (!turmaExiste) return console.log("✖ Erro: Turma inválida!");

        const nome = prompt("Nome do Atleta: ");
        const novoAtleta = new Atleta(this.idAtletaContador++, nome, idT);
        if (!novoAtleta.nome) {
            console.log("✖ Atleta não registrado: nome inválido.");
            return;
        }
        this.atletas.push(novoAtleta);
        console.log(`✔ Atleta "${novoAtleta.nome}" vinculado ao ${turmaExiste.nome}!`);
    }

    listarAtletas() {
        console.log("\n=== LISTA DE ATLETAS ===");
        if (this.atletas.length === 0) return console.log("Nenhum atleta no sistema.");
        this.atletas.forEach(a => {
            const turma = this.turmas.find(t => t.id === a.idTurma);
            a.exibir(turma ? turma.nome : "TURMA NÃO ENCONTRADA");
        });
    }

    adicionarArbitro() {
        const nome = prompt("Nome do Árbitro: ");
        const numeroCredencial = parseInt(prompt("Número de Credencial: "));
        const anosExperiencia = parseInt(prompt("Anos de Experiência: "));
        const novoArbitro = new Arbitro(this.idArbitroContador++, nome, numeroCredencial, anosExperiencia);
        if (!novoArbitro.nome || novoArbitro.numeroCredencial === undefined || novoArbitro.anosExperiencia === undefined) {
            console.log("✖ Árbitro não registrado: dados inválidos.");
            return;
        }
        this.arbitros.push(novoArbitro);
        console.log("✔ Árbitro registrado com sucesso!");
    }

    listarArbitros() {
        console.log("\n=== LISTA DE ÁRBITROS ===");
        if (this.arbitros.length === 0) return console.log("Nenhum árbitro no sistema.");
        this.arbitros.forEach(a => a.exibir());
    }

    adicionarEquipe() {
        this.listarTurmas();
        const idT = parseInt(prompt("ID da Turma: "));
        const turmaExiste = this.turmas.find(t => t.id === idT);
        if (!turmaExiste) return console.log("✖ Erro: Turma inválida!");

        console.log("\nModalidades disponíveis:");
        Object.values(Modalidade).forEach(m => console.log(`- ${m}`));
        const modalidade = prompt("Modalidade (copie exatamente como está na lista acima): ");

        const duplicada = this.equipes.find(e => e.idTurma === idT && e.modalidade === modalidade);
        if (duplicada) {
            console.log(`✖ Erro: a turma ${turmaExiste.nome} já tem uma equipe em "${modalidade}"!`);
            return;
        }

        const novaEquipe = new Equipe(this.idEquipeContador++, idT, modalidade);
        if (!novaEquipe.modalidade) {
            console.log("✖ Equipe não registrada: modalidade inválida.");
            return;
        }
        this.equipes.push(novaEquipe);
        console.log(`✔ Equipe registrada: ${turmaExiste.nome} em "${modalidade}"!`);
    }

    listarEquipes() {
        console.log("\n=== LISTA DE EQUIPES ===");
        if (this.equipes.length === 0) return console.log("Nenhuma equipe no sistema.");
        this.equipes.forEach(e => {
            const turma = this.turmas.find(t => t.id === e.idTurma);
            const nomesAtletas = e.atletas
                .map(idA => this.atletas.find(a => a.id === idA))
                .filter(a => a) // ignora IDs órfãos, se algum dia existirem
                .map(a => a.nome);
            e.exibir(turma ? turma.nome : "TURMA NÃO ENCONTRADA", nomesAtletas);
        });
    }

    removerEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe a remover: "));
        const totalAntes = this.equipes.length;
        this.equipes = this.equipes.filter(e => e.id !== idE);

        if (this.equipes.length === totalAntes) {
            console.log("✖ Erro: ID não encontrado.");
            return;
        }

        // AGREGAÇÃO EM AÇÃO: apagar a equipe NÃO apaga os atletas do sistema.
        console.log(`✔ Equipe removida. Os atletas continuam no sistema (total de atletas: ${this.atletas.length}).`);
    }

    // --- Ponte Equipe <-> Atleta: aqui mora a Agregação do projeto ---

    vincularAtletaEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe: "));
        const equipe = this.equipes.find(e => e.id === idE);
        if (!equipe) return console.log("✖ Erro: Equipe inválida!");

        this.listarAtletas();
        const idA = parseInt(prompt("ID do Atleta: "));
        const atleta = this.atletas.find(a => a.id === idA);
        if (!atleta) return console.log("✖ Erro: Atleta inválido!");

        // Regra de integridade: o atleta só pode jogar por equipe da PRÓPRIA turma
        if (atleta.idTurma !== equipe.idTurma) {
            console.log(`✖ Erro: ${atleta.nome} não pertence à turma dessa equipe!`);
            return;
        }

        const vinculou = equipe.adicionarAtleta(idA);
        if (!vinculou) {
            console.log(`✖ Erro: ${atleta.nome} já está nessa equipe!`);
            return;
        }
        console.log(`✔ ${atleta.nome} vinculado à equipe de "${equipe.modalidade}"!`);
    }

    desvincularAtletaEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe: "));
        const equipe = this.equipes.find(e => e.id === idE);
        if (!equipe) return console.log("✖ Erro: Equipe inválida!");

        const idA = parseInt(prompt("ID do Atleta a remover da equipe: "));
        const removeu = equipe.removerAtleta(idA);
        if (!removeu) {
            console.log("✖ Erro: esse atleta não está nessa equipe!");
            return;
        }

        // AGREGAÇÃO EM AÇÃO: o atleta sai da equipe, mas continua no sistema.
        const atleta = this.atletas.find(a => a.id === idA);
        console.log(`✔ ${atleta.nome} removido da equipe. Ele continua no sistema (total de atletas: ${this.atletas.length}).`);
    }
}

// 5. Menu Principal
function main() {
    const sistema = new ArenaConnect();

    while (true) {
        console.log(`
 ==============================
 ARENA-CONNECT v2.6 - PBE1 - Aula 04: Agregação
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
        let op = prompt("Escolha: ");
        if (op === '1') sistema.adicionarTurma();
        else if (op === '2') sistema.listarTurmas();
        else if (op === '3') sistema.adicionarAtleta();
        else if (op === '4') sistema.listarAtletas();
        else if (op === '5') sistema.adicionarArbitro();
        else if (op === '6') sistema.listarArbitros();
        else if (op === '7') sistema.adicionarEquipe();
        else if (op === '8') sistema.listarEquipes();
        else if (op === '9') sistema.vincularAtletaEquipe();
        else if (op === '10') sistema.desvincularAtletaEquipe();
        else if (op === '11') sistema.removerEquipe();
        else if (op === '0') break;
        else console.log("Opção inválida!");
    }
}

if (require.main === module) {
    main();
}

module.exports = ArenaConnect;