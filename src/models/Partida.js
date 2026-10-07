const Placar = require('./Placar');

class Partida {
    #id;
    #idEquipeA;
    #idEquipeB;
    #modalidade;
    #placar;

    constructor(id, idEquipeA, idEquipeB, modalidade, golsA, golsB){
        this.#id = id;
        this.idEquipeA = idEquipeA;
        this.idEquipeB = idEquipeB;
        this.modalidade = modalidade;
        this.#placar = new Placar(golsA, golsB);
    }

    get id() {
        return this.#id;
    }

    set idEquipeA(valor){
        if (!Number.isInteger(valor) || valor <= 0) {
            console.log('[ERRO] ID da equipe A inválido. Acesso negado.');
            return;
        }
        this.#idEquipeA = valor;
    }
    get idEquipeA() {
        return this.#idEquipeA;
    }

    set idEquipeB(valor) {
        if (!Number.isInteger(valor) || valor <= 0) {
            console.log('[ERRO] ID da equipe B inválido. Acesso negado.');
            return;
        }
        this.#idEquipeB = valor;
    }

    get idEquipeB() {
        return this.#idEquipeB;
    }
    
    set modalidade(valor) {
        if (!valor) {
            console.log('[ERRO] Modalidade da partida inválida. Acesso negado.');
            return;
        }
        this.#modalidade = valor;
    }

    get modalidade() {
        return this.#modalidade;
    }

    get placar() {
        return this.#placar;
    }

    exibir(nomeEquipeA, nomeEquipeB) {
        console.log(`ID: ${this.id} | ${nomeEquipeA} ${this.placar.golsA} x ${this.placar.golsB} ${nomeEquipeB} | ${this.modalidade}`);
    }
}

module.exports = Partida;