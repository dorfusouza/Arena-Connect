const prompt = require('prompt-sync')();

const Modalidade = require('./Modalidade');
const CadastroFactory = require('./CadastroFactory');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

// NOVO (Persistência): onde o estado do sistema é salvo. Fica na raiz do
// projeto (dois níveis acima de src/models/) — ver .gitignore, dados de teste
// não sobem para o repositório.
const ARQUIVO_DADOS = path.join(__dirname, '..', '..', 'dados-arena-connect.json');

class ArenaConnect {
    static #instancia = null;
    // SINGLETON: todo o sistema pega o gerenciador por aqui — nunca por `new`.
    static getInstancia() {
        if (!ArenaConnect.#instancia) {
            ArenaConnect.#instancia = new ArenaConnect();
        }
        return ArenaConnect.#instancia;
    }

    constructor() {
        if (ArenaConnect.#instancia) {
            throw new Error('ArenaConnect já existe. Use ArenaConnect.getInstancia().');
        }
        this.turmas = [];
        this.atletas = [];
        this.arbitros = [];
        this.equipes = [];
        this.partidas = [];
        this.idTurmaContador = 1;
        this.idAtletaContador = 1;
        this.idArbitroContador = 1;
        this.idEquipeContador = 1;
        this.idPartidaContador = 1;
    }

    adicionarTurma() {
        const nome = prompt("Nome da nova turma: ");
        try {
            this.turmas.push(CadastroFactory.criarTurma(this.idTurmaContador, nome));
            this.idTurmaContador++;
        } catch (erro) {
            console.log(`✖ Turma não registrada: ${erro.message}`);
        }
    }

    listarTurmas() {
        console.log("\n=== LISTA DE TURMAS ===");
        if (this.turmas.length === 0) return console.log("Nenhuma turma no sistema.");
        this.turmas.forEach(t => t.exibir());
    }

    // NOVO (Clean Code): a pré-condição "essa turma deveria existir" agora
    // lança um erro de verdade em vez de só imprimir e devolver undefined.
    // Quem chama decide como reagir (ver adicionarAtleta() abaixo).
    buscarTurmaOuFalhar(idTurma) {
        const turma = this.turmas.find(t => t.id === idTurma);
        if (!turma) {
            throw new Error(`Turma com ID ${idTurma} não existe.`);
        }
        return turma;
    }

    buscarAtletaOuFalhar(idAtleta) {
        const atleta = this.atletas.find(a => a.id === idAtleta);
        if (!atleta) throw new Error(`Atleta com ID ${idAtleta} não existe.`);
        return atleta;
    }

    buscarEquipeOuFalhar(idEquipe) {
        const equipe = this.equipes.find(e => e.id === idEquipe);
        if (!equipe) throw new Error(`Equipe com ID ${idEquipe} não existe.`);
        return equipe;
    }

    adicionarAtleta(idT, nome) {
        const turma = this.buscarTurmaOuFalhar(idT);
        const novoAtleta = CadastroFactory.criarAtleta(this.idAtletaContador, nome, idT);
        this.idAtletaContador++;
        this.atletas.push(novoAtleta);
        return { atleta: novoAtleta, turma };
    }

    listarAtletas() {
        return this.atletas.map(atleta => ({
            atleta,
            nomeTurma: this.turmas.find(t => t.id === atleta.idTurma)?.nome ?? 'Turma não encontrada',
        }));
    }

    adicionarArbitro() {
        const nome = prompt("Nome do Árbitro: ");
        const numeroCredencial = parseInt(prompt("Número de Credencial: "));
        const anosExperiencia = parseInt(prompt("Anos de Experiência: "));
        try {
            const novoArbitro = CadastroFactory.criarArbitro(this.idArbitroContador, nome, numeroCredencial, anosExperiencia);
            this.idArbitroContador++;
            this.arbitros.push(novoArbitro);
            console.log("✔ Árbitro registrado com sucesso!");
        } catch (erro) {
            console.log(`✖ Árbitro não registrado: ${erro.message}`);
        }
    }

    listarArbitros() {
        console.log("\n=== LISTA DE ÁRBITROS ===");
        if (this.arbitros.length === 0) return console.log("Nenhum árbitro no sistema.");
        this.arbitros.forEach(a => a.exibir());
    }

    // NOVO (Clean Code): verificação booleana extraída e nomeada — antes
    // vivia como uma variável `duplicada` inline dentro de adicionarEquipe().
    equipeJaExiste(idTurma, modalidade) {
        return this.equipes.some(e => e.idTurma === idTurma && e.modalidade === modalidade);
    }

    adicionarEquipe() {
        this.listarTurmas();
        const idT = parseInt(prompt("ID da Turma: "));

        try {
            const turma = this.buscarTurmaOuFalhar(idT);

            console.log("\nModalidades disponíveis:");
            Object.values(Modalidade).forEach(m => console.log(`- ${m}`));
            const modalidade = prompt("Modalidade (copie exatamente como está na lista acima): ");

            if (this.equipeJaExiste(idT, modalidade)) {
                throw new Error(`a turma ${turma.nome} já tem uma equipe em "${modalidade}".`);
            }

            const novaEquipe = CadastroFactory.criarEquipe(this.idEquipeContador, idT, modalidade);
            this.idEquipeContador++;
            this.equipes.push(novaEquipe);
            console.log(`✔ Equipe registrada: ${turma.nome} em "${modalidade}"!`);
        } catch (erro) {
            console.log(`✖ Equipe não registrada: ${erro.message}`);
        }
    }

    listarEquipes() {
        console.log("\n=== LISTA DE EQUIPES ===");
        if (this.equipes.length === 0) return console.log("Nenhuma equipe no sistema.");
        this.equipes.forEach(e => {
            const turma = this.turmas.find(t => t.id === e.idTurma);
            const nomesAtletas = e.atletas
                .map(idA => this.atletas.find(a => a.id === idA))
                .filter(a => a)
                .map(a => a.nome);
            e.exibir(turma ? turma.nome : "TURMA NÃO ENCONTRADA", nomesAtletas);
        });
    }

    removerEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe a remover: "));

        try {
            const equipe = this.buscarEquipeOuFalhar(idE);
            this.equipes = this.equipes.filter(e => e.id !== equipe.id);
            console.log(`✔ Equipe removida. Os atletas continuam no sistema (total de atletas: ${this.atletas.length}).`);
        } catch (erro) {
            console.log(`✖ Não foi possível remover: ${erro.message}`);
        }
    }

    vincularAtletaEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe: "));

        try {
            const equipe = this.buscarEquipeOuFalhar(idE);

            this.listarAtletas();
            const idA = parseInt(prompt("ID do Atleta: "));
            const atleta = this.buscarAtletaOuFalhar(idA);

            if (atleta.idTurma !== equipe.idTurma) {
                throw new Error(`${atleta.nome} não pertence à turma dessa equipe.`);
            }
            if (!equipe.adicionarAtleta(idA)) {
                throw new Error(`${atleta.nome} já está nessa equipe.`);
            }
            console.log(`✔ ${atleta.nome} vinculado à equipe de "${equipe.modalidade}"!`);
        } catch (erro) {
            console.log(`✖ Não foi possível vincular: ${erro.message}`);
        }
    }

    desvincularAtletaEquipe() {
        this.listarEquipes();
        const idE = parseInt(prompt("ID da Equipe: "));

        try {
            const equipe = this.buscarEquipeOuFalhar(idE);
            const idA = parseInt(prompt("ID do Atleta a remover da equipe: "));
            const atleta = this.buscarAtletaOuFalhar(idA);

            if (!equipe.removerAtleta(idA)) {
                throw new Error(`${atleta.nome} não está nessa equipe.`);
            }
            console.log(`✔ ${atleta.nome} removido da equipe. Ele continua no sistema (total de atletas: ${this.atletas.length}).`);
        } catch (erro) {
            console.log(`✖ Não foi possível desvincular: ${erro.message}`);
        }
    }


    registrarPartida(idEquipeA, idEquipeB, golsA, golsB){
        const equipeA = this.buscarEquipeOuFalhar(idEquipeA);
        const equipeB = this.buscarEquipeOuFalhar(idEquipeB);

        if(equipeA.modalidade !== equipeB.modalidade) {
            throw new Error("as equipes não jogam a mesma modalidade!");
        }
        if(equipeA.id === equipeB.id){
            throw new Error("Uma equipe não pode jogar contra ela mesma!");
        }

        const partida = CadastroFactory.criarPartida(
            this.idPartidaContador, idEquipeA, idEquipeB, equipeA.modalidade, golsA, golsB
        );
        this.idPartidaContador++;
        this.partidas.push(partida);
        return {
            partida,
            nomeEquipeA: this.#rotularEquipe(idEquipeA),
            nomeEquipeB: this.#rotularEquipe(idEquipeB),
        };
    }

    #rotularEquipe(idEquipe){
        const equipe = this.equipes.find(e => e.id === idEquipe);
        if (!equipe) return 'Equipe não encontrada';
        const turma = this.turmas.find(t => t.id === equipe.id);
        return `${turma ? turma.nome : '?'} (${equipe.modalidade})`;
    }

    listarPartidas() {
        return this.partidas.map( partida => ({
            partida,
            nomeEquipeA: this.#rotularEquipe(partida.idEquipeA),
            nomeEquipeB: this.#rotularEquipe(partida.idEquipeB)
            
        }));
    }

    // NOVO (Persistência): grava TODO o estado do sistema em JSON. Fica no
    // Model (aqui), nunca na View ou no Controller — persistir dados é regra
    // de negócio, não interface.
    //
    // ARMADILHA (vale para todas as nossas classes): `JSON.stringify(turma)`
    // sozinho vira `{}` — nome é um campo PRIVADO (#nome) com só um getter;
    // JSON.stringify só enxerga propriedades próprias e enumeráveis do
    // objeto, e um getter de classe não é isso. Por isso toda entidade abaixo
    // é convertida à mão para um objeto comum (id, nome, ...) antes de salvar.
    salvarEstado() {
        const dados = {
            turmas: this.turmas.map(t => ({ id: t.id, nome: t.nome })),
            atletas: this.atletas.map(a => ({ id: a.id, nome: a.nome, idTurma: a.idTurma })),
            arbitros: this.arbitros.map(a => ({ id: a.id, nome: a.nome,
                numeroCredencial: a.numeroCredencial, anosExperiencia: a.anosExperiencia })),

            equipes: this.equipes.map(e => ({ id: e.id, idTurma: e.idTurma, 
                modalidade: e.modalidade, atletas: e.atletas })),

            idTurmaContador: this.idTurmaContador,
            idAtletaContador: this.idAtletaContador,
            idArbitroContador: this.idArbitroContador,
            idEquipeContador: this.idEquipeContador,
        };
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(dados, null, 2));
        console.log(`✔ Estado salvo em ${ARQUIVO_DADOS}`);
    }

    // NOVO (Persistência): o ponto chave da aula — JSON.parse devolve objetos
    // "crus" (sem os métodos da classe, sem os campos privados funcionando).
    // Por isso reconstruímos cada entidade chamando a CadastroFactory de novo,
    // com os dados lidos — exatamente como se o usuário tivesse digitado.
    carregarEstado() {
        if (!fs.existsSync(ARQUIVO_DADOS)) {
            console.log('Nenhum estado salvo encontrado ainda — começando do zero.');
            return;
        }
        const dados = JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf-8'));

        this.turmas = dados.turmas.map(t => CadastroFactory.criarTurma(t.id, t.nome));
        this.atletas = dados.atletas.map(a => CadastroFactory.criarAtleta(a.id, a.nome, a.idTurma));
        this.arbitros = dados.arbitros.map(a => CadastroFactory.criarArbitro(a.id, a.nome, a.numeroCredencial, a.anosExperiencia));

        this.equipes = dados.equipes.map(e => {
            const equipe = CadastroFactory.criarEquipe(e.id, e.idTurma, e.modalidade);
            // #atletas é privado e não tem setter — reconstruímos chamando o
            // mesmo método público usado no fluxo normal, um ID de cada vez.
            e.atletas.forEach(idAtleta => equipe.adicionarAtleta(idAtleta));
            return equipe;
        });

        this.idTurmaContador = dados.idTurmaContador;
        this.idAtletaContador = dados.idAtletaContador;
        this.idArbitroContador = dados.idArbitroContador;
        this.idEquipeContador = dados.idEquipeContador;
        console.log(`✔ Estado carregado: ${this.turmas.length} turma(s), ${this.atletas.length} atleta(s), 
            ${this.equipes.length} equipe(s).`);
    }

}

module.exports = ArenaConnect;
