const CadastroFactory = require('./CadastroFactory');
const { calcularClassificacao } = require('./Classificacao');
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

    adicionarTurma(nome) {
        const turma = CadastroFactory.criarTurma(this.idTurmaContador, nome);
        this.idTurmaContador++;
        this.turmas.push(turma);
        return turma;
    }

    editarTurma(idTurma, novoNome) {
        const turma = this.buscarTurmaOuFalhar(idTurma);
        CadastroFactory.criarTurma(idTurma, novoNome);
        turma.nome = novoNome;
        return turma;
    }

    removerTurma(idTurma) {
        const turma = this.buscarTurmaOuFalhar(idTurma);
        if (this.atletas.some(a => a.idTurma === idTurma)) {
            throw new Error(`a turma ${turma.nome} ainda tem atletas. 
                Remova ou mude os atletas antes.`);
        }
        if (this.equipes.some(e => e.idTurma === idTurma)) {
            throw new Error(`a turma ${turma.nome} ainda tem equipes. 
                Remova as equipes antes.`);
        }
        this.turmas = this.turmas.filter(t => t.id !== turma.id);
        return turma;
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

    buscarPartidaOuFalhar(idPartida) {
        const partida = this.partidas.find(p => p.id === idPartida);
        if (!partida) throw new Error(`Partida com ID ${idPartida} não existe.`);
        return partida;
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

    // Só o nome muda: trocar a turma de um atleta que já está numa equipe
    // quebraria a regra "o atleta é da turma da equipe" (ver vincularAtletaEquipe).
    editarAtleta(idAtleta, novoNome) {
        const atleta = this.buscarAtletaOuFalhar(idAtleta);
        CadastroFactory.criarAtleta(atleta.id, novoNome, atleta.idTurma); // só valida
        atleta.nome = novoNome;
        return atleta;
    }

    removerAtleta(idAtleta) {
        const atleta = this.buscarAtletaOuFalhar(idAtleta);
        if (this.equipes.some(e => e.atletas.includes(idAtleta))) {
            throw new Error(`${atleta.nome} ainda está numa equipe. Desvincule o atleta antes.`);
        }
        this.atletas = this.atletas.filter(a => a.id !== atleta.id);
        return atleta;
    }

    // Mesmo padrão de adicionarTurma: recebe os dados prontos e devolve o
    // árbitro criado — quem pergunta no teclado é o ArbitroController.
    adicionarArbitro(nome, numeroCredencial, anosExperiencia) {
        const arbitro = CadastroFactory.criarArbitro(this.idArbitroContador, nome, numeroCredencial, anosExperiencia);
        this.idArbitroContador++;
        this.arbitros.push(arbitro);
        return arbitro;
    }

    listarArbitros() {
        return this.arbitros;
    }

    // NOVO (Clean Code): verificação booleana extraída e nomeada — antes
    // vivia como uma variável `duplicada` inline dentro de adicionarEquipe().
    equipeJaExiste(idTurma, modalidade) {
        return this.equipes.some(e => e.idTurma === idTurma && e.modalidade === modalidade);
    }

    adicionarEquipe(idTurma, modalidade) {
        const turma = this.buscarTurmaOuFalhar(idTurma);
        if (this.equipeJaExiste(idTurma, modalidade)) {
            throw new Error(`a turma ${turma.nome} já tem uma equipe em "${modalidade}".`);
        }
        const equipe = CadastroFactory.criarEquipe(this.idEquipeContador, idTurma, modalidade);
        this.idEquipeContador++;
        this.equipes.push(equipe);
        return { equipe, turma };
    }

    editarEquipe(idEquipe, novaModalidade) {
        const equipe = this.buscarEquipeOuFalhar(idEquipe);
        CadastroFactory.criarEquipe(equipe.id, equipe.idTurma, novaModalidade); // só valida
        if (novaModalidade === equipe.modalidade) return equipe;
        if (this.historicoDaEquipe(idEquipe).length > 0) {
            throw new Error('a equipe já tem partidas registradas e não pode mudar de modalidade.');
        }
        if (this.equipeJaExiste(equipe.idTurma, novaModalidade)) {
            throw new Error(`a turma já tem uma equipe em "${novaModalidade}".`);
        }
        equipe.modalidade = novaModalidade;
        return equipe;
    }

    historicoDaEquipe(idEquipe) {
        return this.partidas.filter(p => p.idEquipeA === idEquipe || p.idEquipeB === idEquipe);
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

    removerEquipe(idEquipe) {
        const equipe = this.buscarEquipeOuFalhar(idEquipe);
        if (this.historicoDaEquipe(idEquipe).length > 0) {
            throw new Error('a equipe já tem partidas registradas e não pode ser removida.');
        }
        this.equipes = this.equipes.filter(e => e.id !== equipe.id);
        return equipe;
    }

    vincularAtletaEquipe(idEquipe, idAtleta) {
        const equipe = this.buscarEquipeOuFalhar(idEquipe);
        const atleta = this.buscarAtletaOuFalhar(idAtleta);

        if (atleta.idTurma !== equipe.idTurma) {
            throw new Error(`${atleta.nome} não pertence à turma dessa equipe.`);
        }
        if (!equipe.adicionarAtleta(idAtleta)) {
            throw new Error(`${atleta.nome} já está nessa equipe.`);
        }
        return { equipe, atleta };
    }

    desvincularAtletaEquipe(idEquipe, idAtleta) {
        const equipe = this.buscarEquipeOuFalhar(idEquipe);
        const atleta = this.buscarAtletaOuFalhar(idAtleta);

        if (!equipe.removerAtleta(idAtleta)) {
            throw new Error(`${atleta.nome} não está nessa equipe.`);
        }
        return { equipe, atleta };
    }


    registrarPartida(idEquipeA, idEquipeB, golsA, golsB) {
        const equipeA = this.buscarEquipeOuFalhar(idEquipeA);
        const equipeB = this.buscarEquipeOuFalhar(idEquipeB);

        if (equipeA.modalidade !== equipeB.modalidade) {
            throw new Error("as equipes não jogam a mesma modalidade!");
        }
        if (equipeA.id === equipeB.id) {
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

    #rotularEquipe(idEquipe) {
        const equipe = this.equipes.find(e => e.id === idEquipe);
        if (!equipe) return 'Equipe não encontrada';
        const turma = this.turmas.find(t => t.id === equipe.idTurma);
        return `${turma ? turma.nome : '?'} (${equipe.modalidade})`;
    }

    listarPartidas() {
        return this.partidas.map(partida => ({
            partida,
            nomeEquipeA: this.#rotularEquipe(partida.idEquipeA),
            nomeEquipeB: this.#rotularEquipe(partida.idEquipeB)

        }));
    }

    // NOVO (Composição, parte 2/2): tabela de classificação de TODAS as
    // modalidades que têm equipe. Devolve dados prontos (nada é impresso aqui):
    // [{ modalidade, linhas: [{ nomeEquipe, jogos, vitorias, ..., pontos }] }]
    classificacaoGeral() {
        const modalidades = [...new Set(this.equipes.map(e => e.modalidade))];
        return modalidades.map(modalidade => {
            const equipes = this.equipes.filter(e => e.modalidade === modalidade);
            const partidas = this.partidas.filter(p => p.modalidade === modalidade);
            const linhas = calcularClassificacao(equipes, partidas)
                .map(l => ({ ...l, nomeEquipe: this.#rotularEquipe(l.idEquipe) }));
            return { modalidade, linhas };
        });
    }

    dadosTurmas() {
        return this.turmas.map(t => ({ id: t.id, nome: t.nome }))
    }

    dadosDaTurma(idTurma) {
        const turma = this.buscarTurmaOuFalhar(idTurma);
        return { id: turma.id, nome: turma.nome };
    }

    dadosAtletas() {
        return this.atletas.map(a => this.#dadosDoAtleta(a));
    }

    dadosDoAtleta(idAtleta) {
        return this.#dadosDoAtleta(this.buscarAtletaOuFalhar(idAtleta));
    }

    #dadosDoAtleta(a) {
        return {
            id: a.id,
            nome: a.nome,
            idTurma: a.idTurma,
            turma: this.turmas.find(t => t.id === a.idTurma)?.nome ?? 'Turma não encontrada',
        };
    }

    dadosArbitros() {
        return this.arbitros.map(a => ({
            id: a.id,
            nome: a.nome,
            numeroCredencial: a.numeroCredencial,
            anosExperiencia: a.anosExperiencia,
        }));
    }

    dadosEquipes() {
        return this.equipes.map(e => this.#dadosDaEquipe(e));
    }

    dadosDaEquipe(idEquipe) {
        return this.#dadosDaEquipe(this.buscarEquipeOuFalhar(idEquipe));
    }

    #dadosDaEquipe(e) {
        return {
            id: e.id,
            turma: this.turmas
                .find(t => t.id === e.idTurma)?.nome ?? 'Turma não encontrada',
            modalidade: e.modalidade,
            atletas: e.atletas
                .map(idA => this.atletas.find(a => a.id === idA))
                .filter(a => a)
                .map(a => a.nome),
        }
    }

    dadosPartidas() {
        return this.partidas.map(p => this.#dadosDaPartida(p));
    }

    dadosDaPartida(idPartida) {
        return this.#dadosDaPartida(this.buscarPartidaOuFalhar(idPartida));
    }

    #dadosDaPartida(p) {
        return {
            id: p.id,
            modalidade: p.modalidade,
            equipeA: this.#rotularEquipe(p.idEquipeA),
            equipeB: this.#rotularEquipe(p.idEquipeB),
            golsA: p.placar.golsA,
            golsB: p.placar.golsB,
        };
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
            arbitros: this.arbitros.map(a => ({
                id: a.id, nome: a.nome,
                numeroCredencial: a.numeroCredencial, anosExperiencia: a.anosExperiencia
            })),
            equipes: this.equipes.map(e => ({
                id: e.id, idTurma: e.idTurma,
                modalidade: e.modalidade, atletas: e.atletas
            })),
            partidas: this.partidas.map(p => ({
                id: p.id, idEquipeA: p.idEquipeA, idEquipeB: p.idEquipeB, modalidade: p.modalidade,
                golsA: p.placar.golsA, golsB: p.placar.golsB,
            })),

            idTurmaContador: this.idTurmaContador,
            idAtletaContador: this.idAtletaContador,
            idArbitroContador: this.idArbitroContador,
            idEquipeContador: this.idEquipeContador,
            idPartidaContador: this.idPartidaContador,
        };
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(dados, null, 2));
        console.log(`✔ Estado salvo em ${ARQUIVO_DADOS}`);
    }

    // NOVO (Persistência): o ponto chave da aula — JSON.parse devolve objetos
    // "crus" (sem os métodos da classe, sem os campos privados funcionando).
    // Por isso reconstruímos cada entidade chamando a CadastroFactory de novo,
    // com os dados lidos — exatamente como se o usuário tivesse digitado.
    carregarEstado(silencioso = false) {
        if (!fs.existsSync(ARQUIVO_DADOS)) {
            if (!silencioso) console.log('Nenhum estado salvo encontrado ainda — começando do zero.');
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
        this.partidas = dados.partidas.map(p => {
            return CadastroFactory.criarPartida(p.id, p.idEquipeA, p.idEquipeB, p.modalidade, p.golsA, p.golsB);
        });

        this.idTurmaContador = dados.idTurmaContador;
        this.idAtletaContador = dados.idAtletaContador;
        this.idArbitroContador = dados.idArbitroContador;
        this.idEquipeContador = dados.idEquipeContador;
        this.idPartidaContador = dados.idPartidaContador;
        if (!silencioso) {
            console.log(`✔ Estado carregado: ${this.turmas.length} turma(s), ${this.atletas.length} atleta(s), 
            ${this.equipes.length} equipe(s), ${this.partidas.length} partida(s).`);
        }
    }

}

module.exports = ArenaConnect;
