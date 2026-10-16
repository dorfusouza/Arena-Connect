// NOVO (Composição, parte 2/2): View de terminal da classificação — só mostra.
const ClassificacaoView = {
    mostrar(grupos) {
        console.log("\n=== CLASSIFICAÇÃO ===");
        if (grupos.length === 0) return console.log("Nenhuma equipe no sistema.");
        grupos.forEach(({ modalidade, linhas }) => {
            console.log(`\n--- ${modalidade} ---`);
            console.log("Pos | Equipe                          | PTS |  J |  V |  E |  D | GP | GC | SG");
            linhas.forEach((l, i) => {
                const col = (v, n) => String(v).padStart(n);
                console.log(
                    `${col(i + 1, 3)} | ${l.nomeEquipe.padEnd(31)} | ${col(l.pontos, 3)} | ${col(l.jogos, 2)} | ` +
                    `${col(l.vitorias, 2)} | ${col(l.empates, 2)} | ${col(l.derrotas, 2)} | ` +
                    `${col(l.golsPro, 2)} | ${col(l.golsContra, 2)} | ${col(l.saldo, 2)}`
                );
            });
        });
    },
};

module.exports = ClassificacaoView;
