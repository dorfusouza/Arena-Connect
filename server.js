/**
 * ARENA-CONNECT — AULA 04: AGREGAÇÃO E COMPOSIÇÃO
 * Gabarito do bloco de Agregação (dado como Bloco 2 da Aula 03 — 26/08/2026,
 * conteúdo antecipado da Aula 04 original)
 *
 * O que muda em relação à Aula 03 (enumerações + equipe):
 *  - `Equipe` ganha uma gestão de verdade da lista `#atletas`: métodos
 *    `adicionarAtleta(idAtleta)` e `removerAtleta(idAtleta)` — antes a lista
 *    existia mas nunca era manipulada.
 *  - AGREGAÇÃO (não composição!): `Equipe` guarda apenas os IDs dos atletas
 *    que joga com ela. Os atletas continuam existindo, de verdade, na lista
 *    geral `ArenaConnect.atletas` — remover da equipe não remove do sistema,
 *    e remover a equipe não remove os atletas.
 *  - `ArenaConnect.vincularAtletaEquipe()` / `desvincularAtletaEquipe()`:
 *    fazem a ponte, com uma regra de integridade extra: um atleta só pode
 *    jogar por uma equipe da PRÓPRIA turma (mesma lógica de duas camadas —
 *    formato no setter, regra de negócio na gerenciadora — usada desde a
 *    Aula 01).
 *  - `ArenaConnect.removerEquipe()` demonstra a independência: apaga a
 *    equipe, os atletas continuam no sistema.
 *  - Pessoa/Atleta/Arbitro/Turma/Modalidade (Aulas 02-03) não mudam.
 */
const prompt = require('prompt-sync')();

// 1. Enumeração (herdada da Aula 03, sem mudanças)
const Modalidade = Object.freeze({
    FUTSAL_MASCULINO: "Futsal Masculino",
    FUTSAL_FEMININO: "Futsal Feminino",
    VOLEI_MISTO: "Vôlei Misto",
    BASQUETE_MASCULINO: "Basquete Masculino",
    BASQUETE_FEMININO: "Basquete Feminino",
    HANDEBOL_MISTO: "Handebol Misto",
});

// 2. Hierarquia de Pessoa (herdada da Aula 02, sem mudanças)

class Pessoa {
    #id;
    #nome;

    constructor(id, nome) {
        this.#id = id;
        this.nome = nome;
    }

    get id() {
        return this.#id;
    }

    set nome(novoNome) {
        if (!novoNome || novoNome.length < 3) {
            console.log('[ERRO] Nome de pessoa inválido. Acesso negado.');
            return;
        }
        this.#nome = novoNome;
    }

    get nome() {
        return this.#nome;
    }

    exibir() {
        console.log(`ID: ${this.id} | Pessoa: ${this.nome}`);
    }
}

class Atleta extends Pessoa {
    #idTurma;

    constructor(id, nome, idTurma) {
        super(id, nome);
        this.idTurma = idTurma;
    }

    set idTurma(novoIdTurma) {
        if (
            novoIdTurma === null ||
            novoIdTurma === undefined ||
            novoIdTurma === '' ||
            !Number.isInteger(novoIdTurma) ||
            novoIdTurma <= 0
        ) {
            console.log('[ERRO] ID de turma inválido. Acesso negado.');
            return;
        }
        this.#idTurma = novoIdTurma;
    }

    get idTurma() {
        return this.#idTurma;
    }

    exibir(nomeTurma) {
        console.log(`ID: ${this.id} | Atleta: ${this.nome} | Turma: ${nomeTurma}`);
    }
}

class Arbitro extends Pessoa {
    #numeroCredencial;
    #anosExperiencia;

    constructor(id, nome, numeroCredencial, anosExperiencia) {
        super(id, nome);
        this.numeroCredencial = numeroCredencial;
        this.anosExperiencia = anosExperiencia;
    }

    set numeroCredencial(novoNumero) {
        if (
            novoNumero === null ||
            novoNumero === undefined ||
            novoNumero === '' ||
            !Number.isInteger(novoNumero) ||
            novoNumero <= 0
        ) {
            console.log('[ERRO] Número de credencial inválido. Acesso negado.');
            return;
        }
        this.#numeroCredencial = novoNumero;
    }

    get numeroCredencial() {
        return this.#numeroCredencial;
    }

    set anosExperiencia(anos) {
        if (
            anos === null ||
            anos === undefined ||
            anos === '' ||
            !Number.isInteger(anos) ||
            anos < 0
        ) {
            console.log('[ERRO] Anos de experiência inválido. Acesso negado.');
            return;
        }
        this.#anosExperiencia = anos;
    }

    get anosExperiencia() {
        return this.#anosExperiencia;
    }

    exibir() {
        console.log(`ID: ${this.id} | Árbitro: ${this.nome} | Credencial: ${this.numeroCredencial} | Experiência: ${this.anosExperiencia} ano(s)`);
    }
}

class Turma {
    #id;
    #nome;

    constructor(id, nome) {
        this.#id = id;
        this.nome = nome;
    }

    get id() {
        return this.#id;
    }

    set nome(novoNome) {
        if (!novoNome || novoNome.length < 2) {
            console.log('[ERRO] Nome de turma inválido. Acesso negado.');
            return;
        }
        this.#nome = novoNome.toUpperCase();
    }

    get nome() {
        return this.#nome;
    }

    exibir() {
        console.log(`ID: ${this.id} | Sala: ${this.nome}`);
    }
}

// 3. Equipe — agora com AGREGAÇÃO de verdade

class Equipe {
    #id;
    #idTurma;
    #modalidade;
    #atletas; // Guarda IDs, não objetos — os atletas de verdade moram em ArenaConnect.atletas

    constructor(id, idTurma, modalidade) {
        this.#id = id;
        this.idTurma = idTurma;
        this.modalidade = modalidade;
        this.#atletas = [];
    }

    get id() {
        return this.#id;
    }

    set idTurma(novoIdTurma) {
        if (!Number.isInteger(novoIdTurma) || novoIdTurma <= 0) {
            console.log('[ERRO] ID de turma inválido para a equipe. Acesso negado.');
            return;
        }
        this.#idTurma = novoIdTurma;
    }

    get idTurma() {
        return this.#idTurma;
    }

    set modalidade(novaModalidade) {
        const modalidadesValidas = Object.values(Modalidade);
        if (!modalidadesValidas.includes(novaModalidade)) {
            console.log('[ERRO] Modalidade inválida. Acesso negado.');
            return;
        }
        this.#modalidade = novaModalidade;
    }

    get modalidade() {
        return this.#modalidade;
    }

    get atletas() {
        return this.#atletas;
    }

    // AGREGAÇÃO: só guarda o ID. Não sabe nada sobre o Atleta em si — quem
    // resolve nome/dados é sempre ArenaConnect, dona da lista completa.
    adicionarAtleta(idAtleta) {
        if (!Number.isInteger(idAtleta) || idAtleta <= 0) {
            console.log('[ERRO] ID de atleta inválido. Acesso negado.');
            return false;
        }
        if (this.#atletas.includes(idAtleta)) {
            return false; // já está na equipe, não duplica
        }
        this.#atletas.push(idAtleta);
        return true;
    }

    removerAtleta(idAtleta) {
        const totalAntes = this.#atletas.length;
        this.#atletas = this.#atletas.filter(id => id !== idAtleta);
        return this.#atletas.length < totalAntes; // true só se removeu de fato
    }

    exibir(nomeTurma, nomesAtletas = []) {
        const lista = nomesAtletas.length > 0 ? nomesAtletas.join(", ") : "nenhum atleta ainda";
        console.log(`ID: ${this.id} | Turma: ${nomeTurma} | Modalidade: ${this.modalidade} | Atletas (${this.atletas.length}): ${lista}`);
    }
}

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

module.exports = { Modalidade, Pessoa, Atleta, Arbitro, Turma, Equipe, ArenaConnect };
