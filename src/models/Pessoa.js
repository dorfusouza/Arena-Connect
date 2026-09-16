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

module.exports = {
    Pessoa,
    Atleta,
    Arbitro
};