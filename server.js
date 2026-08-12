/**
 * PROJETO: Arena-Connect v1.0
 * MISSÃO 1: The Memory Matrix
 * OBJETIVO: CRUD de turmas em memória RAM usando Funções
 */

// 1. Matriz de Dados (Persistência em memória) [5, 6]
let turmas = [];
let idContador = 1; // Gerador de ID automático

// 2. Sub-rotinas (Funções do Motor Backend) [3, 4]

/**
 * US01 - Registro de Turmas (Create)
 * Processamento: Cria um objeto e adiciona à lista global [7, 8]
 */
function adicionarTurma(nome) {
    const novaTurma = {
        id: idContador++,
        nome: nome.toUpperCase() // Padronização (Clean Code) [1]
    };
    turmas.push(novaTurma);
    console.log(`[LOG] Turma "${nome}" registrada com sucesso! ID: ${novaTurma.id}`);
}

/**
 * US02 - Catálogo do Torneio (Read)
 * Processamento: Percorre o array e exibe os dados [9, 10]
 */
function listarTurmas() {
    console.log("\n=== LISTA DE TURMAS - INTERCLASSES ===");
    if (turmas.length === 0) {
        console.log("A matriz de dados está vazia.");
        return;
    }

    // Estrutura de Repetição para exibição [11, 12]
    turmas.forEach(turma => {
        console.log(`ID: ${turma.id} | Sala: ${turma.nome}`);
    });
    console.log("======================================\n");
}

/**
 * Side Quest - Remoção de Turmas (Delete)
 * Processamento: Filtra o array para remover o ID especificado
 */
function removerTurma(id) {
    const totalAntes = turmas.length;
    turmas = turmas.filter(t => t.id !== id);
    
    if (turmas.length < totalAntes) {
        console.log(`[LOG] Turma ID ${id} removida da matriz.`);
    } else {
        console.log(`[ERRO] ID ${id} não encontrado.`);
    }
}

// 3. Ponto de Entrada (Execução de Testes / Fluxo Principal) [13, 14]
function main() {
    console.log("Iniciando Arena-Connect Engine...");

    // Testando a Entrada de Dados [15]
    adicionarTurma("9º TDS");
    adicionarTurma("1º MEC");
    adicionarTurma("2º ELETRO");

    // Testando a Saída de Dados [16]
    listarTurmas();

    // Testando a Side Quest (Remover o 1º MEC - ID 2)
    removerTurma(2);
    listarTurmas();
}

// Início do Jogo
main();