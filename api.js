const express = require('express');
const cors = require('cors');
const ArenaConnect = require('./src/models/ArenaConnect');

const app = express();
const sistema = ArenaConnect.getInstancia();
sistema.carregarEstado();
PORT = 3000;

app.use(express.json());
app.use(cors());

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


app.listen(PORT, () => {
    console.log(`Arena-Connect API em http://localhost:${PORT}`);
});
