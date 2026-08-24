/**
 * ARENA-CONNECT — AULA 02: HERANÇA E ABSTRAÇÃO
 * Gabarito da aula de Herança (Aula 02 — 24/08/2026)
 *
 * O que muda em relação à Aula 01:
 *  - Nova classe `Pessoa`: superclasse que concentra id e nome (encapsulados,
 *    privados), um método `exibir()` genérico, e `super()` no construtor.
 *  - `Atleta extends Pessoa`: herda id/nome de Pessoa, adiciona #idTurma
 *    e sobrescreve `exibir()` com informações específicas de turma/modalidade.
 *  - `Arbitro extends Pessoa`: herda id/nome de Pessoa, adiciona
 *    #numeroCredencial e #anosExperiencia, sobrescreve `exibir()`.
 *  - ArenaConnect e o menu permanecem inalterados em interface pública —
 *    mais um exemplo de como a herança é um detalhe interno, não quebra
 *    quem já usa as classes por fora.
 */
const prompt = require('prompt-sync')();

// 1. Superclasse — o que Atleta e Arbitro têm em comum

class Pessoa {
    #id;   // Identidade imutável — só getter, sem setter
    #nome; // Escudo ativado — validação no setter

    constructor(id, nome) {
        this.#id = id;
        this.nome = nome; // aciona o setter de validação
    }

    get id() {
        return this.#id;
    }

    set nome(novoNome) {
        // Mínimo 3 caracteres — regra genérica para qualquer Pessoa.
        if (!novoNome || novoNome.length < 3) {
            console.log('[ERRO] Nome de pessoa inválido. Acesso negado.');
            return;
        }
        this.#nome = novoNome;
    }

    get nome() {
        return this.#nome;
    }

    // Método genérico — sobrescrito pelas subclasses com informações específicas
    exibir() {
        console.log(`ID: ${this.id} | Pessoa: ${this.nome}`);
    }
}

// 2. Subclasses — especializam Pessoa com dados e comportamentos próprios

class Atleta extends Pessoa {
    #idTurma; // Específico de Atleta

    constructor(id, nome, idTurma) {
        super(id, nome); // Chama o construtor de Pessoa — obrigatório
        this.idTurma = idTurma; // aciona o setter de validação
    }

    set idTurma(novoIdTurma) {
        // Firewall: bloqueia vazio/nulo/undefined e qualquer coisa que não
        // seja um número inteiro positivo.
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

    // Sobrescrita (override) — mesmo método de Pessoa, mas com informação específica
    exibir(nomeTurma) {
        super.exibir();
        console.log(`Turma: ${nomeTurma}`);
    }
}

class Arbitro extends Pessoa {
    #numeroCredencial;
    #anosExperiencia;

    constructor(id, nome, numeroCredencial, anosExperiencia) {
        super(id, nome); // Chama o construtor de Pessoa
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
        // "< 0" e não "<= 0": um árbitro novato tem 0 anos de experiência.
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

    // Sobrescrita — informações específicas de árbitro
    exibir() {
        console.log(`ID: ${this.id} | Árbitro: ${this.nome} | Credencial: ${this.numeroCredencial} | Experiência: ${this.anosExperiencia} ano(s)`);
    }
}

// 3. A Classe Gerenciadora (inalterada na interface pública)
class ArenaConnect {
    constructor() {
        this.turmas = [];
        this.atletas = [];
        this.arbitros = [];
        this.idTurmaContador = 1;
        this.idAtletaContador = 1;
        this.idArbitroContador = 1;
    }

    adicionarTurma() {
        const nome = prompt("Nome da nova turma: ");
        const novaTurma = new Turma(this.idTurmaContador++, nome);
        this.turmas.push(novaTurma);
        console.log("✔ Turma registrada com sucesso!");
    }

    listarTurmas() {
        console.log("\n=== LISTA DE TURMAS ===");
        if (this.turmas.length === 0) return console.log("Nenhuma turma no sistema.");
        this.turmas.forEach(t => t.exibir());
    }

    editarTurma() {
        this.listarTurmas();
        const id = parseInt(prompt("ID da turma para editar: "));
        const turma = this.turmas.find(t => t.id === id);
        if (turma) {
            const nomeAntes = turma.nome;
            const novoNome = prompt(`Novo nome para ${turma.nome}: `);
            turma.nome = novoNome.toUpperCase();
            if (turma.nome !== nomeAntes) {
                console.log("✔ Dados atualizados!");
            } else {
                console.log(`✖ Nome mantido (${nomeAntes}) — valor informado inválido.`);
            }
        } else {
            console.log("✖ Erro: ID não encontrado.");
        }
    }

    removerTurma() {
        this.listarTurmas();
        const id = parseInt(prompt("ID da turma para remover: "));
        const totalAntes = this.turmas.length;
        this.turmas = this.turmas.filter(t => t.id !== id);
        if (this.turmas.length < totalAntes) {
            console.log("✔ Turma removida.");
        } else {
            console.log("✖ Erro: ID não encontrado.");
        }
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

    listarTodas() {
        console.log("\n=== TODAS AS PESSOAS (Polimorfismo) ===");
        const pessoas = [...this.atletas, ...this.arbitros];
        if (pessoas.length === 0) return console.log("Nenhuma pessoa (além de turmas) no sistema.");
        pessoas.forEach(p => p.exibir());
    }
}

// Turma não herda de Pessoa (não é uma pessoa, é um agrupamento)
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

// 4. Menu Principal
function main() {
    const sistema = new ArenaConnect();

    while (true) {
        console.log(`
 ==============================
 ARENA-CONNECT v2.4 - PBE1 - Aula 02: Herança
 ==============================
 1. Registrar Turma
 2. Listar Turmas
 3. Editar Turma
 4. Remover Turma
 5. Registrar Atleta
 6. Listar Atletas
 7. Registrar Árbitro
 8. Listar Árbitros
 9. Listar TODAS as Pessoas (teste de polimorfismo)
 0. Sair
 ==============================`);
        let op = prompt("Escolha: ");
        if (op === '1') sistema.adicionarTurma();
        else if (op === '2') sistema.listarTurmas();
        else if (op === '3') sistema.editarTurma();
        else if (op === '4') sistema.removerTurma();
        else if (op === '5') sistema.adicionarAtleta();
        else if (op === '6') sistema.listarAtletas();
        else if (op === '7') sistema.adicionarArbitro();
        else if (op === '8') sistema.listarArbitros();
        else if (op === '9') sistema.listarTodas();
        else if (op === '0') break;
        else console.log("Opção inválida!");
    }
}

if (require.main === module) {
    main();
}

module.exports = { Pessoa, Atleta, Arbitro, ArenaConnect, Turma };
