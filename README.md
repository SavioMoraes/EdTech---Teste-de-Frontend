# 🚀 Projeto Frontend Interativo

Aplicação frontend desenvolvida com foco em **fidelidade ao layout, interatividade e experiência do usuário**, utilizando HTML, CSS e JavaScript puro, com execução via ambiente moderno de desenvolvimento.

---

## 📦 Entrega

- Repositório público no GitHub
- README contendo:
  - Como rodar o projeto
  - Decisões técnicas
  - Estrutura do projeto

---

## ▶️ Como rodar o projeto

### 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js (versão 16+ recomendada)
- npm (já vem com o Node)

---

### 🔧 Passo a passo

1. Clone o repositório:

git clone https://github.com/seu-usuario/seu-repositorio.git

---

2. Acesse a pasta do projeto:
Bash
cd seu-repositorio
Instale as dependências:
Bash
npm install
Execute o projeto:
Bash
npm run dev
Acesse no navegador:

http://localhost:3000
💡 O projeto utiliza um servidor local (Vite ou similar) para melhor performance e hot reload.
🧠 Decisões técnicas
🔹 Estrutura baseada em separação de responsabilidades
O projeto foi dividido em módulos independentes para facilitar manutenção e escalabilidade:
main.js → inicialização geral
slider.js → controle do carrossel
cards.js → controle de abertura/fechamento dos cards
lógica de vídeo, podcast e atividades isoladas
🔹 JavaScript puro (Vanilla JS)
Optado por não utilizar frameworks (React, Angular, etc.) para:
reduzir complexidade
demonstrar domínio de base
manter performance alta
🔹 Manipulação direta do DOM
Toda a interação foi feita com:
querySelector
addEventListener
classList
Garantindo controle total da UI.
🔹 Persistência com SessionStorage
Utilizado para manter estado da aplicação durante a sessão:
posição do slider
estado dos cards (aberto/fechado)
respostas da atividade discursiva
exibição de feedback
🔹 Responsividade refinada
Breakpoints aplicados com alto nível de detalhe:
1024px → desktop reduzido
736px → tablet
375px → mobile
Sem quebra de layout, mantendo:
proporção
legibilidade
comportamento dos componentes
🔹 Player de vídeo customizado
Implementação com controle total sobre:
play/pause
progresso
volume
overlay e botão central sincronizados com estado do vídeo
🔹 CSS sem frameworks
Utilização de CSS puro para:
maior fidelidade ao design
controle fino de layout
evitar dependências externas

## Estrutura do projeto

📦 projeto
 ┣ 📂 assets
 ┃ ┣ 📂 css
 ┃ ┃ ┗ styles.css
 ┃ ┣ 📂 js
 ┃ ┃ ┣ main.js
 ┃ ┃ ┣ slider.js
 ┃ ┃ ┣ cards.js
 ┃ ┃ ┗ (demais scripts de interação)
 ┃ ┗ 📂 images
 ┣ index.html
 ┣ package.json
 ┗ README.md

 ---

### 📄 Descrição dos principais arquivos
index.html → estrutura principal da aplicação
styles.css → estilos globais e responsividade
main.js → orquestra toda a aplicação
slider.js → lógica do carrossel de imagens
cards.js → interação dos cards expansíveis
images/ → assets visuais

---

### ⚡ Destaques do projeto
Interface totalmente interativa
Persistência de estado no navegador
Responsividade detalhada (sem quebrar layout)
Código modular e organizado
Sem uso de frameworks (controle total)

---


### 💡 Observações
Projeto focado em demonstrar domínio de frontend puro
Código estruturado para fácil evolução
Pode ser facilmente adaptado para frameworks como React ou Angular

---


### 👨‍💻 Autor
Sávio Moreira de Moraes