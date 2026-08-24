const prompt = require('prompt-sync')();

// 1. Modelos de Dados
class Turma {
    #nome;
    #id;
    constructor(id, nome) {
        this.#id = id;
        this.#nome = nome.toUpperCase();
    }

    set nome(novoNome){
        if (!novoNome || novoNome.length < 3){
            console.log("[ERRO] - Nome Inválido!")
            return;
        }        
        this.#nome = novoNome;
    }

    get nome() { return this.#nome; };

    get id() { return this.#id; };

    exibir() {
        console.log(`ID: ${this.id} | Sala: ${this.nome}`);
    }
}

class Atleta {
    #id;
    #nome;
    #idTurma;

    constructor(id, nome, idTurma) {
        this.#id = id;
        this.#nome = nome;
        this.#idTurma = idTurma;
    }

    set nome(novoNome) {
        if (!novoNome || novoNome.length < 3){
            console.log("[ERRO] - Nome Inválido!")
            return;
        }        
        this.#nome = novoNome;
    }

    get nome() { return this.#nome; };
    
    set idTurma(novoIdTurma) {
        if (
            novoIdTurma === null ||
            novoIdTurma === undefined ||
            novoIdTurma === '' ||
            !Number.isInteger(novoIdTurma) ||
            novoIdTurma <= 0
        ) {
            console.log("[ERRO] - ID de Turma inválido!");
            return;
        }
        this.#idTurma = novoIdTurma;
    }

    get idTurma() { return this.#idTurma }
        
    get id() { return this.#id; };
    
    exibir(nomeTurma) {
        console.log(`ID: ${this.id} | Atleta: ${this.nome} | Turma: ${nomeTurma}`);
    }
}

class Arbitro {
    #id;
    #nome;
    #numeroCredencial;
    #anosExperiencia;

    constructor(id, nome, numeroCredencial, anosExperiencia) {
        this.#id = id;
        this.nome = nome;
        this.numeroCredencial = numeroCredencial;
        this.anosExperiencia = anosExperiencia;
    }

    get id() { return this.#id; };

    set nome(novoNome) {
        if (!novoNome || novoNome.length < 3){
            console.log("[ERRO] - Nome Inválido!")
            return;
        }
        this.#nome = novoNome;
    }

    get nome() { return this.#nome; };

    set numeroCredencial(novoNumero) {
        if (
            novoNumero === null ||
            novoNumero === undefined ||
            novoNumero === '' ||
            !Number.isInteger(novoNumero) ||
            novoNumero <= 0
        ) {
            console.log("[ERRO] - Número de Credencial inválido!");
            return;
        }
        this.#numeroCredencial = novoNumero;
    }

    get numeroCredencial() { return this.#numeroCredencial; };

    set anosExperiencia(anos) {
        // Atenção: "< 0" aqui, não "<= 0" — senão um árbitro novato (0 anos) nunca passa.
        if (
            anos === null ||
            anos === undefined ||
            anos === '' ||
            !Number.isInteger(anos) ||
            anos < 0
        ) {
            console.log("[ERRO] - Anos de Experiência inválido!");
            return;
        }
        this.#anosExperiencia = anos;
    }

    get anosExperiencia() { return this.#anosExperiencia; };

    exibir() {
        console.log(`ID: ${this.id} | Árbitro: ${this.nome} | Credencial: ${this.numeroCredencial} | Experiência: ${this.anosExperiencia} ano(s)`);
    }
}

// 2. A Classe Gerenciadora (Onde as funções viram métodos)
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
            const novoNome = prompt(`Novo nome para ${turma.nome}: `);
            turma.nome = novoNome.toUpperCase();
            console.log("✔ Dados atualizados!");
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
        this.atletas.push(novoAtleta);
        console.log(`✔ Atleta "${nome}" vinculado ao ${turmaExiste.nome}!`);
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
}

// 3. Menu Principal (Execução)
function main() {
    const sistema = new ArenaConnect(); // Instancia o sistema orientado a objetos

    while (true) {
        console.log(`
 ==============================
 ARENA-CONNECT v2.0 - PBE1
 ==============================
 1. Registrar Turma
 2. Listar Turmas
 3. Editar Turma
 4. Remover Turma
 5. Registrar Atleta
 6. Registrar Árbitro
 7. Listar Árbitros
 0. Sair
 ==============================`);
        let op = prompt("Escolha: ");
        if (op === '1') sistema.adicionarTurma();
        else if (op === '2') sistema.listarTurmas();
        else if (op === '3') sistema.editarTurma();
        else if (op === '4') sistema.removerTurma();
        else if (op === '5') sistema.adicionarAtleta();
        else if (op === '6') sistema.adicionarArbitro();
        else if (op === '7') sistema.listarArbitros();
        else if (op === '0') break;
        else console.log("Opção inválida!");
    }
}

main();
