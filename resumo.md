# Resumo do Projeto: poc2 (Protótipos Defensoria)

## Objetivo

Este projeto serve como uma Prova de Conceito (PoC) para desenvolver e testar protótipos de funcionalidades específicas, recriando interfaces de usuário semelhantes às do sistema da Defensoria, utilizando tecnologias web modernas.

## Tecnologias Utilizadas

*   **Framework:** Next.js (v15+) com App Router
*   **Linguagem:** JavaScript (React v19)
*   **UI Library:** Mantine UI (v7)
*   **Ícones:** Tabler Icons
*   **Testes:** Jest (v29) e React Testing Library (com User Event)

## Estrutura do Projeto (Arquivos Relevantes)

```diff
 poc2/
 ├── coverage/             # Relatórios de cobertura de testes gerados pelo Jest
 ├── public/
 │   ├── menulateral.png   # Imagem do menu lateral estático
 │   └── menucadastro.png  # Imagem do menu superior estático (obsoleto?)
 │   └── ... (outros arquivos como SVGs)
 ├── src/
 │   ├── app/
 │   │   ├── layout.js       # Layout raiz (contém MantineProvider)
 │   │   ├── page.js         # Página principal (Hub de Protótipos)
 │   │   ├── page.test.js    # Teste para a página principal (Hub)
 │   │   ├── globals.css     # Estilos globais (pode incluir imports do Mantine)
 │   │   ├── favicon.ico     # Ícone da aba do navegador
 │   │   ├── notificacoes/
 │   │   │   └── page.js     # Componente da página de Notificações
 │   │   ├── pastas/ (ou listadepastas?)
 │   │   │   └── page.js     # Componente da página de Lista de Pastas
 │   │   └── pasta/
 │   │       └── page.js     # Componente da página de Pasta Individual
+│   ├── components/
+│   │   ├── ConfirmActionModal/
+│   │   │   ├── ModalConfirmacaoAssustadora.js       # Componente modal reutilizável
+│   │   │   └── ModalConfirmacaoAssustadora.test.js  # Testes para o modal
+│   │   ├── PastaHeader/
+│   │   │   ├── PastaHeader.js                       # Componente header da pasta
+│   │   │   └── PastaHeader.test.js                  # Testes para o header (em andamento)
+│   │   └── PastaActionButton/ (Se existir como componente separado)
+│   │       └── PastaActionButton.js
 │   │   └── ... (outros componentes reutilizáveis)
 │   └── ... (outras pastas como hooks, utils, etc. se houver)
 ├── .git/               # Repositório Git
 ├── .next/              # Cache e build do Next.js
 ├── .swc/               # Cache do compilador SWC
 ├── node_modules/       # Dependências do projeto
 ├── .gitignore          # Arquivos ignorados pelo Git
 ├── eslint.config.mjs   # (Ou .eslintrc.js/json) Configuração do ESLint
 ├── package.json        # Dependências e scripts do projeto
 ├── package-lock.json   # Lockfile das dependências
 ├── next.config.mjs     # Configuração do Next.js
 ├── postcss.config.mjs  # (Ou .js) Configuração do PostCSS (usado pelo Mantine)
 ├── jest.config.js      # Configuração do Jest
 ├── jest.setup.js       # Arquivo de setup do Jest (importa jest-dom)
 ├── jsconfig.json       # (Ou tsconfig.json) Configuração do JS/TS
 ├── README.md           # Arquivo README principal
+├── INSTRUCOES_SETUP.md # Guia de configuração do projeto (inclui setup de testes)
 └── resumo.md           # Este arquivo de resumo
```

## Funcionalidades Implementadas (Protótipos)

1.  **Hub Central (`/`)**
    *   Página inicial que lista os protótipos disponíveis (Notificações, Lista de Pastas, etc.).
    *   Coberta por teste básico (`page.test.js`).

2.  **Notificações (`/notificacoes`)**
    *   Lista de notificações com paginação simulada. Layout de duas colunas.

3.  **Lista de Pastas (`/pastas` ou `/listadepastas`)**
    *   Página placeholder para listagem de pastas. Layout de duas colunas. (Nome da rota a confirmar).

4.  **Pasta Individual (`/pasta`)**
    *   **Objetivo:** Exibir detalhes e permitir o gerenciamento do status de uma pasta específica.
    *   **Layout:** Segue o padrão de duas colunas (menu estático à esquerda, conteúdo à direita).
    *   **Componente Principal:** Utiliza o `PastaHeader` para exibir as informações e ações principais.
    *   **`PastaHeader`:**
        *   Exibe dados fixos como Área, Assistido, Assunto e Processo.
        *   Apresenta o status atual da pasta ("Ativa" ou "Arquivada") usando um `Badge` colorido (verde para ativa, cinza para arquivada).
        *   Possui um `Tooltip` no `Badge` de status que mostra quem realizou a última alteração e quando (com data/hora formatada).
        *   **Ações Condicionais:**
            *   Se status "Ativa": Exibe um `Menu` (dropdown) acionado por um botão "Arquivar Pasta". O menu lista os motivos de arquivamento. Clicar em um motivo abre o modal de confirmação.
            *   Se status "Arquivada": Exibe um botão "Reativar Pasta". Clicar neste botão abre o modal de confirmação.
    *   **Gerenciamento de Estado (`pasta/page.js`):**
        *   Usa `useState` para controlar os dados da pasta (`pastaData`), incluindo `status`, `motivoArquivamento`, `lastStatusChangeBy`, `lastStatusChangeAt`.
        *   Controla a visibilidade dos modais de confirmação (`archiveModalOpened`, `reactivateModalOpened`).
        *   Possui handlers (`handle...`) para atualizar o estado da pasta e abrir/fechar os modais.
    *   **Confirmação de Ações:**
        *   Utiliza o componente reutilizável `ModalConfirmacaoAssustadora` para ambas as ações (arquivar e desarquivar).
        *   **Estilo "Assustador":** O modal sempre apresenta um `Alert` amarelo com ícone de alerta e, por padrão, um botão de confirmação vermelho.
        *   **Requisito:** Exige que o usuário marque um `Checkbox` de ciência antes de habilitar o botão de confirmação.
        *   Exibe mensagens de título, alerta e corpo específicas para cada ação (arquivar/desarquivar).

## Abordagem de Layout

*   O `layout.js` raiz configura o `MantineProvider`.
*   Páginas como `/notificacoes`, `/pastas`, `/pasta` usam `Flexbox` para um layout de duas colunas.
*   O "menu lateral" é uma imagem estática (`menulateral.png`) sem interatividade.

## Testes

*   **Ferramentas:** Jest e React Testing Library configurados e documentados em `INSTRUCOES_SETUP.md`. A biblioteca `@testing-library/user-event` foi adicionada para simulação de interações do usuário.
*   **Execução:**
    *   `npm test`: Roda todos os testes.
    *   `npm run test:coverage`: Roda os testes e gera um relatório de cobertura na pasta `coverage/` (incluindo um `index.html` para visualização detalhada).
*   **Arquivos de Teste:**
    *   `src/app/page.test.js`: Testa o título da página inicial.
    *   `src/components/ConfirmActionModal/ModalConfirmacaoAssustadora.test.js`: Testa o componente de modal, alcançando **100% de cobertura** de código (linhas, branches, funções).
    *   `src/components/PastaHeader/PastaHeader.test.js`: Testes para o header da pasta (em desenvolvimento inicial).
*   **Processo:** É **essencial** rodar os testes (`npm test`) após qualquer modificação em arquivos que possuem testes associados (ou nos próprios testes) para garantir que nada foi quebrado. Analisar a cobertura (`npm run test:coverage`) ajuda a identificar áreas não testadas. 