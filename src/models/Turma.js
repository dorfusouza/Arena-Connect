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

module.exports = Turma;