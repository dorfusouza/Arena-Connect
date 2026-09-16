const Modalidade = require('./Modalidade')
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

module.exports = Equipe;