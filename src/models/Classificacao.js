// NOVO (Composição, parte 2/2): o motor de classificação.
// Função pura: recebe as equipes e as partidas e devolve a tabela ordenada.
// Não imprime nada e não sabe de terminal nem de navegador — por isso o mesmo
// resultado serve para o menu do terminal e, mais adiante, para a API (rota GET /classificacao).

const PONTOS_VITORIA = 3;
const PONTOS_EMPATE = 1;

// `partidas` de UMA modalidade só (equipes de modalidades diferentes não se
// enfrentam, então a classificação é calculada por modalidade).
function calcularClassificacao(equipes, partidas) {
    const linhas = new Map();
    equipes.forEach(equipe => {
        linhas.set(equipe.id, {
            idEquipe: equipe.id, idTurma: equipe.idTurma,
            jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
            golsPro: 0, golsContra: 0, saldo: 0, pontos: 0,
        });
    });

    partidas.forEach(partida => {
        const a = linhas.get(partida.idEquipeA);
        const b = linhas.get(partida.idEquipeB);
        if (!a || !b) return; // partida de equipe que não existe mais: ignora

        const { golsA, golsB } = partida.placar;
        a.jogos++; b.jogos++;
        a.golsPro += golsA; a.golsContra += golsB;
        b.golsPro += golsB; b.golsContra += golsA;

        const vencedor = partida.placar.vencedor(); // 'A' | 'B' | 'EMPATE'
        if (vencedor === 'A') { a.vitorias++; b.derrotas++; a.pontos += PONTOS_VITORIA; }
        else if (vencedor === 'B') { b.vitorias++; a.derrotas++; b.pontos += PONTOS_VITORIA; }
        else { a.empates++; b.empates++; a.pontos += PONTOS_EMPATE; b.pontos += PONTOS_EMPATE; }
    });

    linhas.forEach(l => { l.saldo = l.golsPro - l.golsContra; });

    // Critério: pontos, depois saldo, depois gols marcados, depois ID (para o
    // resultado ser sempre o mesmo quando tudo empata).
    return [...linhas.values()].sort((x, y) =>
        y.pontos - x.pontos ||
        y.saldo - x.saldo ||
        y.golsPro - x.golsPro ||
        x.idEquipe - y.idEquipe
    );
}

module.exports = { calcularClassificacao, PONTOS_VITORIA, PONTOS_EMPATE };
