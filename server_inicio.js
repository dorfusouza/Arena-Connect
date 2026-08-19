/**
 * PROJETO: Arena-Connect v1.0
 * MISSÃO 1: The Memory Matrix
 * OBJETIVO: CRUD de turmas em memória RAM usando Funções e prompt-sync
 */
const prompt = require('prompt-sync')();

// 1. Matriz de Dados (Persistência em memória)
let turmas = [];
let idContador = 1; // Gerador de ID automático
let resp = 0;

// 2. Sub-rotinas (Funções do Motor Backend)

function adicionarTurma(nome) {
    const novaTurma = {
        id: idContador++,
        nome: nome.toUpperCase() // Padronização (Clean Code)
    };
    turmas.push(novaTurma);
    console.log(`[LOG] Turma "${nome}" registrada com sucesso! ID: ${novaTurma.id}`);
}

function listarTurmas() {
    console.log("\n=== LISTA DE TURMAS - INTERCLASSES ===");
    if (turmas.length === 0) {
        console.log("A matriz de dados está vazia.");
        console.log("======================================\n");
        return;
    }

    turmas.forEach(turma => {
        console.log(`ID: ${turma.id} | Sala: ${turma.nome}`);
    });
    console.log("======================================\n");
}

function atualizarTurma(id, novoNome) {
    const turma = turmas.find(t => t.id === id);
    if (turma) {
        turma.nome = novoNome.toUpperCase();
        console.log(`[LOG] Turma ID ${id} atualizada para "${turma.nome}".`);
    } else {
        console.log(`[ERRO] ID ${id} não encontrado para atualização.`);
    }
}

function removerTurma(id) {
    const totalAntes = turmas.length;
    turmas = turmas.filter(t => t.id !== id);
    
    if (turmas.length < totalAntes) {
        console.log(`[LOG] Turma ID ${id} removida da matriz.`);
    } else {
        console.log(`[ERRO] ID ${id} não encontrado.`);
    }
}

console.log("Iniciando Arena-Connect Engine...");

while (true) {
    console.log("\n--- MENU ---");
    console.log("1. Adicionar Turma");
    console.log("2. Listar Turmas");
    console.log("3. Atualizar Turma");
    console.log("4. Remover Turma");
    console.log("5. Sair");
    
    // O prompt retorna string, convertemos para número com Number() ou parseInt()
    resp = Number(prompt("Digite a opção escolhida: "));

    if (resp === 1) {
        const nome = prompt("Digite o nome da turma: ");
        adicionarTurma(nome);
    } else if (resp === 2) {
        listarTurmas();
    } else if (resp === 3) {
        listarTurmas();
        const idAtualizar = Number(prompt("Digite o ID da turma que deseja atualizar: "));
        const novoNome = prompt("Digite o novo nome da turma: ");
        atualizarTurma(idAtualizar, novoNome);
    } else if (resp === 4) {
        listarTurmas();
        const idRemover = Number(prompt("Digite o ID da turma que deseja remover: "));
        removerTurma(idRemover);
    } else if (resp === 5) {
        console.log("Saindo do Arena-Connect... Até logo!");
        break;
    } else {
        console.log("[ERRO] Opção inválida! Escolha um número de 1 a 5.");
    }
}
