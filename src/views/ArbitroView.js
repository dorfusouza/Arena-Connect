const prompt = require('prompt-sync')();

const ArbitroView = {
    perguntarNome() {
        return prompt("Nome do Árbitro: ");
    },
    perguntarCredencial() {
        return parseInt(prompt("Número de Credencial: "));
    },
    perguntarExperiencia() {
        return parseInt(prompt("Anos de Experiência: "));
    },
    mostrarCadastrado() {
        console.log("✔ Árbitro registrado com sucesso!");
    },
    mostrarErroCadastro(mensagem) {
        console.log(`✖ Árbitro não registrado: ${mensagem}`);
    },
    listarArbitros(lista) {
        console.log("\n=== LISTA DE ÁRBITROS ===");
        if (lista.length === 0) return console.log("Nenhum árbitro no sistema.");
        lista.forEach(arbitro => arbitro.exibir());
    },
};

module.exports = ArbitroView;
