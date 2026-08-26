/**
 * ARENA-CONNECT — AULA 03: ENUMERAÇÕES E A REGRA CRÍTICA (EQUIPES)
 * Gabarito da aula de Enumerações + Equipe (Aula 03 — 26/08/2026)
 *
 * O que muda em relação à Aula 02 (herança):
 *  - Novo enum `Modalidade`: padrão Object.freeze, já que JS não tem `enum`
 *    nativo. Lista fechada de modalidades do interclasses.
 *  - Nova classe `Equipe`: liga uma Turma a uma Modalidade. Tem lista de
 *    atletas (vazia por enquanto — agregação de verdade só chega na Aula 04).
 *  - REGRA DE NEGÓCIO CRÍTICA do projeto: uma Turma pode ter N Equipes, uma
 *    por Modalidade — mas NUNCA duas Equipes da mesma Turma na mesma
 *    Modalidade. Essa validação vive em ArenaConnect.adicionarEquipe(),
 *    porque só ArenaConnect conhece a lista completa de equipes (mesma
 *    lógica já usada para checar se uma Turma existe antes de vincular um
 *    Atleta).
 *  - Pessoa/Atleta/Arbitro (Aula 02) não mudam.
 */
const prompt = require('prompt-sync')();

// 1. Enumeração — Object.freeze impede que o objeto seja alterado depois de
// criado, simulando um "enum" (JS não tem essa palavra-chave nativa).
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

// 3. Equipe — liga uma Turma a uma Modalidade

class Equipe {
    #id;
    #idTurma;
    #modalidade;
    #atletas; // Lista de referência — agregação de verdade chega na Aula 04

    constructor(id, idTurma, modalidade) {
        this.#id = id;
        this.idTurma = idTurma;       // aciona o setter
        this.modalidade = modalidade; // aciona o setter
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
        // Valida contra a lista FECHADA de modalidades do enum — não aceita
        // qualquer string, só as que existem em Modalidade.
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
        return this.#atletas; // Retorna a referência — proteção real de verdade vem na Aula 04
    }

    exibir(nomeTurma) {
        console.log(`ID: ${this.id} | Turma: ${nomeTurma} | Modalidade: ${this.modalidade} | Atletas: ${this.atletas.length}`);
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

    // --- Equipe: aqui mora a Regra de Negócio Crítica do projeto ---
    adicionarEquipe() {
        this.listarTurmas();
        const idT = parseInt(prompt("ID da Turma: "));
        const turmaExiste = this.turmas.find(t => t.id === idT);
        if (!turmaExiste) return console.log("✖ Erro: Turma inválida!");

        console.log("\nModalidades disponíveis:");
        Object.values(Modalidade).forEach(m => console.log(`- ${m}`));
        const modalidade = prompt("Modalidade (copie exatamente como está na lista acima): ");

        // REGRA CRÍTICA: a mesma Turma não pode ter 2 Equipes na mesma
        // Modalidade. Turmas diferentes PODEM ter equipe na mesma
        // modalidade (ex.: 9A e 8B podem ter Futsal Masculino cada um).
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
            e.exibir(turma ? turma.nome : "TURMA NÃO ENCONTRADA");
        });
    }
}

// 5. Menu Principal
function main() {
    const sistema = new ArenaConnect();

    while (true) {
        console.log(`
 ==============================
 ARENA-CONNECT v2.5 - PBE1 - Aula 03: Equipes e Modalidades
 ==============================
 1. Registrar Turma
 2. Listar Turmas
 3. Registrar Atleta
 4. Listar Atletas
 5. Registrar Árbitro
 6. Listar Árbitros
 7. Registrar Equipe
 8. Listar Equipes
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
        else if (op === '0') break;
        else console.log("Opção inválida!");
    }
}

if (require.main === module) {
    main();
}

module.exports = { Modalidade, Pessoa, Atleta, Arbitro, Turma, Equipe, ArenaConnect };
