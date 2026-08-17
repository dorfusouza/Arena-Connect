const prompt = require('prompt-sync')();

// 1. Modelos de Dados
class Turma {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome.toUpperCase();
    }
    exibir() {
        console.log(`ID: ${this.id} | Sala: ${this.nome}`);
    }
}

class Atleta {
    constructor(id, nome, idTurma) {
        this.id = id;
        this.nome = nome;
        this.idTurma = idTurma;
    }
    exibir(nomeTurma) {
        console.log(`ID: ${this.id} | Atleta: ${this.nome} | Turma: ${nomeTurma}`);
    }
}

// 2. A Classe Gerenciadora (Onde as funções viram métodos)
class ArenaConnect {
    constructor() {
        this.turmas = [];
        this.atletas = [];
        this.idTurmaContador = 1;
        this.idAtletaContador = 1;
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
 0. Sair
 ==============================`);
        let op = prompt("Escolha: ");
        if (op === '1') sistema.adicionarTurma();
        else if (op === '2') sistema.listarTurmas();
        else if (op === '3') sistema.editarTurma();
        else if (op === '4') sistema.removerTurma();
        else if (op === '5') sistema.adicionarAtleta();
        else if (op === '0') break;
        else console.log("Opção inválida!");
    }
}

main();
