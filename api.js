const express = require('express');
const cors = require('cors');
const ArenaConnect = require('./src/models/ArenaConnect');

const app = express();
const sistema = ArenaConnect.getInstancia();
sistema.carregarEstado();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// O menu do terminal roda em OUTRO processo e salva no arquivo: antes de CADA
// requisição a API relê o arquivo (e cada rota que altera dados salva depois).
app.use((req, res, next) => {
    sistema.carregarEstado(true);
    next();
});

// Confere se o recurso da URL existe. Se não existe, JÁ responde 404 e devolve
// false — a rota só faz `if (!existe(...)) return;`.
function existe(res, buscar) {
    try {
        buscar();
        return true;
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
        return false;
    }
}

// --- GET --------------------------------------------------------------------
app.get('/turmas', (req, res) => {
    res.json(sistema.dadosTurmas());
});
app.get('/turmas/:id', (req, res) => {
    try {
        res.json(sistema.dadosDaTurma(Number(req.params.id)));
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
    }
});
app.get('/atletas', (req, res) => {
    res.json(sistema.dadosAtletas());
});
app.get('/atletas/:id', (req, res) => {
    try {
        res.json(sistema.dadosDoAtleta(Number(req.params.id)));
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
    }
});
app.get('/arbitros', (req, res) => {
    res.json(sistema.dadosArbitros());
});
app.get('/equipes', (req, res) => {
    res.json(sistema.dadosEquipes());
});
app.get('/equipes/:id', (req, res) => {
    try {
        res.json(sistema.dadosDaEquipe(Number(req.params.id)));
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
    }
});
app.get('/partidas', (req, res) => {
    res.json(sistema.dadosPartidas());
});
app.get('/partidas/:id', (req, res) => {
    try {
        res.json(sistema.dadosDaPartida(Number(req.params.id)));
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
    }
});
app.get('/classificacao', (req, res) => {
    res.json(sistema.classificacaoGeral());
});

// --- POST, PUT, DELETE --------------------------------------------------------
// Padrão de TODA rota que altera dados:
//   1. confere o que veio na URL (404 se o recurso não existe);
//   2. chama o Model — que lança erro se algo está errado;
//   3. se deu certo: salvarEstado() e responde;
//   4. se deu errado: o catch traduz o erro para o status HTTP certo
//      (400 = dado inválido no corpo, 409 = regra de negócio impede).

// Turmas
app.post('/turmas', (req, res) => {
    const { nome } = req.body ?? {};
    try {
        const turma = sistema.adicionarTurma(nome);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDaTurma(turma.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.put('/turmas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarTurmaOuFalhar(id))) return;
    const { nome } = req.body ?? {};
    try {
        sistema.editarTurma(id, nome);
        sistema.salvarEstado();
        res.json(sistema.dadosDaTurma(id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.delete('/turmas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarTurmaOuFalhar(id))) return;
    try {
        sistema.removerTurma(id);
        sistema.salvarEstado();
        res.status(204).end();
    } catch (erro) {
        res.status(409).json({ erro: erro.message });
    }
});

// Atletas — corpo do POST: { "idTurma": 1, "nome": "Ana Souza" }
app.post('/atletas', (req, res) => {
    const { idTurma, nome } = req.body ?? {};
    try {
        const { atleta } = sistema.adicionarAtleta(idTurma, nome);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDoAtleta(atleta.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.put('/atletas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarAtletaOuFalhar(id))) return;
    const { nome } = req.body ?? {};
    try {
        sistema.editarAtleta(id, nome);
        sistema.salvarEstado();
        res.json(sistema.dadosDoAtleta(id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.delete('/atletas/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarAtletaOuFalhar(id))) return;
    try {
        sistema.removerAtleta(id);
        sistema.salvarEstado();
        res.status(204).end();
    } catch (erro) {
        res.status(409).json({ erro: erro.message });
    }
});

// Árbitros — corpo do POST: { "nome": "Carlos", "numeroCredencial": 1234, "anosExperiencia": 5 }
app.post('/arbitros', (req, res) => {
    const { nome, numeroCredencial, anosExperiencia } = req.body ?? {};
    try {
        const arbitro = sistema.adicionarArbitro(nome, numeroCredencial, anosExperiencia);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosArbitros().find(a => a.id === arbitro.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

// Equipes — corpo do POST: { "idTurma": 1, "modalidade": "Futsal Masculino" }
// (turma inexistente no CORPO é dado inválido → 400; o 404 é para o que está na URL)
app.post('/equipes', (req, res) => {
    const { idTurma, modalidade } = req.body ?? {};
    try {
        const { equipe } = sistema.adicionarEquipe(idTurma, modalidade);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDaEquipe(equipe.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.put('/equipes/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarEquipeOuFalhar(id))) return;
    const { modalidade } = req.body ?? {};
    try {
        sistema.editarEquipe(id, modalidade);
        sistema.salvarEstado();
        res.json(sistema.dadosDaEquipe(id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.delete('/equipes/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarEquipeOuFalhar(id))) return;
    try {
        sistema.removerEquipe(id);
        sistema.salvarEstado();
        res.status(204).end();
    } catch (erro) {
        res.status(409).json({ erro: erro.message });
    }
});

// Vincular / desvincular atleta da equipe — corpo do POST: { "idAtleta": 3 }
app.post('/equipes/:id/atletas', (req, res) => {
    const id = Number(req.params.id);
    if (!existe(res, () => sistema.buscarEquipeOuFalhar(id))) return;
    const { idAtleta } = req.body ?? {};
    try {
        sistema.vincularAtletaEquipe(id, idAtleta);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDaEquipe(id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.delete('/equipes/:id/atletas/:idAtleta', (req, res) => {
    const id = Number(req.params.id);
    const idAtleta = Number(req.params.idAtleta);
    if (!existe(res, () => sistema.buscarEquipeOuFalhar(id))) return;
    if (!existe(res, () => sistema.buscarAtletaOuFalhar(idAtleta))) return;
    try {
        sistema.desvincularAtletaEquipe(id, idAtleta);
        sistema.salvarEstado();
        res.status(204).end();
    } catch (erro) {
        res.status(409).json({ erro: erro.message });
    }
});

// Partidas — corpo do POST: { "idEquipeA": 1, "idEquipeB": 2, "golsA": 3, "golsB": 1 }
app.post('/partidas', (req, res) => {
    const { idEquipeA, idEquipeB, golsA, golsB } = req.body ?? {};
    try {
        const { partida } = sistema.registrarPartida(idEquipeA, idEquipeB, golsA, golsB);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDaPartida(partida.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

// 404 para qualquer endereço que não existe (também em JSON, como o resto da API)
app.use((req, res) => {
    res.status(404).json({ erro: `Rota ${req.method} ${req.path} não existe.` });
});

// Tratador de erros (4 parâmetros): pega o que escapou das rotas — principalmente
// JSON malformado no corpo — e responde em JSON em vez da página HTML do Express.
app.use((erro, req, res, next) => {
    const status = erro.status || 500;
    console.log(`   ERRO: ${erro.message}`);
    res.status(status).json({ erro: status === 400 ? 'JSON inválido no corpo da requisição.' : 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
    console.log(`Arena-Connect API em http://localhost:${PORT}`);
});
