# Arena-Connect

Projeto desenvolvido em aula pelos alunos do **1º ano do curso de Desenvolvimento de Sistemas** do **SESI SENAI**, na Unidade Curricular de **Programação Backend 1**.

> Situação de Aprendizagem desenvolvida durante todo o semestre: automatizar a gestão do **Interclasses Escolar**, substituindo planilhas manuais por um sistema centralizado de gerenciamento de torneios.

## 📑 Contextualização

O desafio proposto aos alunos é desenvolver o "motor" (Backend) de uma aplicação que gerencie **turmas**, **atletas**, **equipes por modalidade** e **placares**, culminando em uma **classificação automatizada**.

### Regra de Negócio Crítica

Uma turma (ex: 9ºA) pode possuir **múltiplas equipes em diferentes modalidades** (Futsal Masc, Vôlei Misto, etc.), exigindo integridade referencial e normalização de dados.

## 🛠️ Especificações Técnicas

| Item | Especificação |
|------|---------------|
| Ambiente | Node.js (LTS) e Visual Studio Code |
| Arquitetura | Monolítica (sem separação inicial de camadas) |
| Paradigma | Programação Estruturada evoluindo para Orientação a Objetos (POO) |

## 🚀 Cronograma de Construção Didática (Sprints)

O plano segue a lógica de isolar a complexidade do código da complexidade da persistência física.

| Etapa | Foco Técnico | Persistência | Objetivo de Aprendizagem |
|-------|--------------|--------------|---------------------------|
| 01 | Lógica e CRUD básico | Memória RAM (Listas/Arrays) | Manipulação de variáveis e objetos no servidor |
| 02 | Menu Console e Relacionamentos | Memória RAM (Objetos complexos) | Gestão de fluxo de dados e lógica de inscrição (Turma x Equipe) |
| 03 | Persistência em Arquivo | File System (JSON) | Leitura e escrita em arquivos locais |
| 04 | Interface Web | HTML/EJS | Integração com a UC de Linguagem de Marcação; arquitetura Cliente-Servidor |
| 05 | Persistência Real | SGBD MySQL | Integração com a UC de Banco de Dados; comandos DML (Insert, Select, Update) |

## 📦 Status Atual

### Missão 1: The Memory Matrix (Etapa 01)

CRUD de turmas com persistência em memória RAM, desenvolvido com **Funções** e **prompt-sync**.

#### Funcionalidades

- Adicionar turma
- Listar turmas
- Atualizar turma por ID
- Remover turma por ID
- Menu interativo no terminal

#### Como executar

```bash
npm install
npm start
```

## 📁 Estrutura do projeto

```
Arena-Connect/
├── server.js          # Código principal (CRUD + menu)
├── package.json       # Dependências e scripts
├── README.md
└── .gitignore
```

## 🎯 Habilidades em Desenvolvimento

### Hard Skills (Técnicas)

- **Lógica de Programação**: estruturação de algoritmos e tomada de decisão
- **Orientação a Objetos**: classes, atributos, métodos e relacionamentos
- **Manipulação de Dados**: operações CRUD e persistência em arquivos e SQL
- **Versionamento**: controle de versão distribuído com Git (Init, Add, Commit, Status)

### Soft Skills (Socioemocionais)

- **Pensamento Analítico**: subdividir o sistema em Sprints funcionais
- **Autogestão**: gerenciamento de metas e prazos de entrega
- **Aprendizagem Significativa**: resolução de um problema real da comunidade escolar

## 🎓 Alinhamento Pedagógico (MSEP)

Este plano utiliza a **Regra 20/60/20** (Mobilização, Desenvolvimento Maker e Síntese) e garante que o aluno seja o protagonista da construção da solução. O projeto prepara o terreno para o **3º termo**, onde este monolito será quebrado em **APIs REST** e arquiteturas distribuídas.

## 🧠 Conceitos trabalhados na Etapa 01

- CRUD (Create, Read, Update, Delete)
- Funções e sub-rotinas
- Arrays e objetos em JavaScript
- Entrada e saída de dados no terminal
- Clean Code e padronização de dados

## 💻 Tecnologias

- Node.js
- JavaScript (CommonJS)
- prompt-sync
