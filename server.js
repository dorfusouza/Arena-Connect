/**
 * ARENA-CONNECT — AULAS 09/10: FECHAMENTO DO CLEAN CODE + SINGLETON + FACTORY
 * Gabarito de 21/09/2026. Base: Aula 09 (Clean Code). O que muda — ver MUDANCAS-PATTERNS.md:
 *  A. Clean Code (fecha o que faltou): buscarXOuFalhar() para Turma/Atleta/Equipe, guard
 *     clauses e try/catch nos métodos de vínculo/remoção.
 *  B. Singleton: ArenaConnect.getInstancia() — uma única fonte de dados no sistema.
 *  C. Factory: models/CadastroFactory.js — criação + validação num só lugar.
 */
const prompt = require('prompt-sync')();
const Modalidade = require('./src/models/Modalidade');
const CadastroFactory = require('./src/models/CadastroFactory');

class ArenaConnect {
    static #instancia = null;
    // SINGLETON: todo o sistema pega o gerenciador por aqui — nunca por `new`.
    static getInstancia() {
        if (!ArenaConnect.#instancia) {
            ArenaConnect.#instancia = new ArenaConnect();
        }
        return ArenaConnect.#instancia;
    }

    constructor() {
        if (ArenaConnect.#instancia) {
            throw new Error('ArenaConnect já existe. Use ArenaConnect.getInstancia().');
        }
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
        try {
            this.turmas.push(CadastroFactory.criarTurma(this.idTurmaContador, nome));
            this.idTurmaContador++;
            console.log("✔ Turma registrada com sucesso!");
        } catch (erro) {
            console.log(`✖ Turma não registrada: ${erro.message}`);
        }
    }

    listarTurmas() {
        console.log("\n=== LISTA DE TURMAS ===");
        if (this.turmas.length === 0) return console.log("Nenhuma turma no sistema.");
        this.turmas.forEach(t => t.exibir());
    }

    // NOVO (Clean Code): a pré-condição "essa turma deveria existir" agora
    // lança um erro de verdade em vez de só imprimir e devolver undefined.
    // Quem chama decide como reagir (ver adicionarAtleta() abaixo).
    buscarTurmaOuFalhar(idTurma) {
        const turma = this.turmas.find(t => t.id === idTurma);
        if (!turma) {
            throw new Error(`Turma com ID ${idTurma} não existe.`);
        }
        return turma;
    }

    buscarAtletaOuFalhar(idAtleta) {
        const atleta = this.atletas.find(a => a.id === idAtleta);
        if (!atleta) throw new Error(`Atleta com ID ${idAtleta} não existe.`);
        return atleta;
    }

    buscarEquipeOuFalhar(idEquipe) {
        const equipe = this.equipes.find(e => e.id === idEquipe);
        if (!equipe) throw new Error(`Equipe com ID ${idEquipe} não existe.`);
        return equipe;
    }

    adicionarAtleta() {
        this.listarTurmas();
        const idT = parseInt(prompt("ID da Turma do atleta: "));

        try {
            const turma = this.buscarTurmaOuFalhar(idT);
            const nome = prompt("Nome do Atleta: ");
            const novoAtleta = CadastroFactory.criarAtleta(this.idAtletaContador, nome, idT);
            this.idAtletaContador++;
            this.atletas.push(novoAtleta);
            console.log(`✔ Atleta "${novoAtleta.nome}" vinculado ao ${turma.nome}!`);
        } catch (erro) {
            console.log(`✖ Não foi possível cadastrar o atleta: ${erro.message}`);
        }
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
        try {
            const novoArbitro = CadastroFactory.criarArbitro(this.idArbitroContador, nome, numeroCredencial, anosExperiencia);
            this.idArbitroContador++;
            this.arbitros.push(novoArbitro);
            console.log("✔ Árbitro registrado com sucesso!");
        } catch (erro) {
            console.log(`✖ Árbitro não registrado: ${erro.message}`);
        }
    }

    listarArbitros() {
        console.log("\n=== LISTA DE ÁRBITROS ===");
        if (this.arbitros.length === 0) return console.log("Nenhum árbitro no sistema.");
        this.arbitros.forEach(a => a.exibir());
    }

    // NOVO (Clean Code): verificação booleana extraída e nomeada — antes
    // vivia como uma variável `duplicada` inline dentro de adicionarEquipe().
    equipeJaExiste(idTurma, modalidade) {
        return this.equipes.some(e => e.idTurma === idTurma && e.modalidade === modalidade);
    }

    adicionarEquipe() {
        this.listarTurmas();
        const idT = parseInt(prompt("ID da Turma: "));

        try {
            const turma = this.buscarTurmaOuFalhar(idT);

            console.log("\nModalidades disponíveis:");
            Object.values(Modalidade).forEach(m => console.log(`- ${m}`));
            const modalidade = prompt("Modalidade (copie exatamente como está na lista acima): ");

            if (this.equipeJaExiste(idT, modalidade)) {
                throw new Error(`a turma ${turma.nome} já tem uma equipe em "${modalidade}".`);
            }

            const novaEquipe = CadastroFactory.criarEquipe(this.idEquipeContador, idT, modalidade);
            this.idEquipeContador++;
            this.equipes.push(novaEquipe);
            console.log(`✔ Equipe registrada: ${turma.nome} em "${modalidade}"!`);
        } catch (erro) {
            console.log(`✖ Equipe não registrada: ${erro.message}`);
        }
    }

    listarEquipes() {
        console.log("\n=== LISTA DE EQUIPES ===");
        if (this.equipes.length === 0) return console.log("Nenhuma equipe no sistema.");
        this.equipes.forEach(e => {
            const turma = this.turmas.find(t => t.id === e.idTurma);
            const nomesAtletas = e.atletas
                .map(idA => this.atletas.find(a => a.id === idA))
                .filter(a => a)
                .map(a => a.nome);
            e.exibir(turma ? turma.nome : "TURMA NÃO ENCONTRADA", nomesAtletas);
        });
    }

    removerEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe a remover: "));

        try {
            const equipe = this.buscarEquipeOuFalhar(idE);
            this.equipes = this.equipes.filter(e => e.id !== equipe.id);
            console.log(`✔ Equipe removida. Os atletas continuam no sistema (total de atletas: ${this.atletas.length}).`);
        } catch (erro) {
            console.log(`✖ Não foi possível remover: ${erro.message}`);
        }
    }

    vincularAtletaEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe: "));

        try {
            const equipe = this.buscarEquipeOuFalhar(idE);

            this.listarAtletas();
            const idA = parseInt(prompt("ID do Atleta: "));
            const atleta = this.buscarAtletaOuFalhar(idA);

            if (atleta.idTurma !== equipe.idTurma) {
                throw new Error(`${atleta.nome} não pertence à turma dessa equipe.`);
            }
            if (!equipe.adicionarAtleta(idA)) {
                throw new Error(`${atleta.nome} já está nessa equipe.`);
            }
            console.log(`✔ ${atleta.nome} vinculado à equipe de "${equipe.modalidade}"!`);
        } catch (erro) {
            console.log(`✖ Não foi possível vincular: ${erro.message}`);
        }
    }

    desvincularAtletaEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe: "));

        try {
            const equipe = this.buscarEquipeOuFalhar(idE);
            const idA = parseInt(prompt("ID do Atleta a remover da equipe: "));
            const atleta = this.buscarAtletaOuFalhar(idA);

            if (!equipe.removerAtleta(idA)) {
                throw new Error(`${atleta.nome} não está nessa equipe.`);
            }
            console.log(`✔ ${atleta.nome} removido da equipe. Ele continua no sistema (total de atletas: ${this.atletas.length}).`);
        } catch (erro) {
            console.log(`✖ Não foi possível desvincular: ${erro.message}`);
        }
    }
}

function main() {
    const sistema = ArenaConnect.getInstancia();

    while (true) {
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

module.exports = { ArenaConnect };
