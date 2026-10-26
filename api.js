const express = require('express');
const ArenaConnect = require('./src/models/ArenaConnect');

const app = express();
const sistema = ArenaConnect.getInstancia();
sistema.carregarEstado();

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    sistema.carregarEstado(true);
    next();
});

app.get('/turmas', (req, res) => {
    res.json(sistema.dadosTurmas());
}) 
app.get('/turmas/:id', (req, res) => {
    try {
        res.json(sistema.dadosDaTurma(Number(req.params.id)));
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
    }
});
app.get('/equipes', (req,res) => {
    res.json(sistema.dadosEquipes());
});
app.get('/equipes/:id', (req, res) => {
    try {
        res.json(sistema.dadosDaEquipe(Number(req.params.id)))
    } catch (erro) {
        res.status(404).json({ erro: erro.message });
    }
})
app.get('/partidas', (req, res) => {
    res.json(sistema.dadosPartidas());
})
app.get('/classificacao', (req, res) => {
    res.json(sistema.classificacaoGeral())
})

function existe(res, buscar){
    try{
        buscar();
        return true;
    } catch (erro) {
        res.status(404).json({ erro: erro.message})
        return false;
    }
}

app.post('/turmas', (req, res) => {
    const { nome } = req.body ?? {};
    try{
        const turma = sistema.adicionarTurma(nome);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDaTurma(turma.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
})

app.put('/turmas/:id', (req, res) => {
    const id = Number(req.params.id);
    if(!existe(res, () => sistema.buscarTurmaOuFalhar(id))) return;
    const { nome } = req.body ?? {};
    try {
        const turma = sistema.adicionarTurma(id, nome);
        sistema.salvarEstado();
        res.status(201).json(sistema.dadosDaTurma(turma.id));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
})

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


app.listen(PORT, () => {
    console.log(`Arena-Connect API em http://localhost:${PORT}`);
});
