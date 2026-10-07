class Placar {
    #golsA;
    #golsB;

    constructor(golsA, golsB){
        this.golsA = golsA;
        this.golsB = golsB;
    }

    set golsA(valor){
        if (!Number.isInteger(valor) || valor < 0) {
            console.log('[ERRO] Gols do time A inválidos. Acesso negado.');
            return;
        }
        this.#golsA = valor;
    }
    get golsA() {
        return this.#golsA;
    }
    set golsB(valor){
        if (!Number.isInteger(valor) || valor < 0) {
            console.log('[ERRO] Gols do time B inválidos. Acesso negado.');
            return;
        }
        this.#golsB = valor;
    }
    get golsB() {
        return this.#golsB;
    }
    // 'A' | 'B' | 'EMPATE'
    vencedor(){
        if (this.#golsA > this.#golsB) return 'A';
        if (this.#golsA < this.#golsB) return 'B';
        return 'EMPATE';
    }
}

module.exports = Placar;