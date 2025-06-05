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
 │   ├── menulateral.png   # Imagem do menu lateral estático (usado em /listadepastas, /pasta)
 │   ├── menulateralminhadefensoria.png # Imagem do menu lateral para /minha-defensoria e /solicitacoes
 │   └── menucadastro.png  # Imagem do menu superior estático (usado em /listadepastas)
 │   └── ... (outros arquivos como SVGs)
 ├── src/
 │   ├── app/
 │   │   ├── layout.js       # Layout raiz (contém MantineProvider)
 │   │   ├── page.js         # Página principal (Hub de Protótipos)
 │   │   ├── page.test.js    # Teste para a página principal (Hub)
 │   │   ├── globals.css     # Estilos globais (pode incluir imports do Mantine)
 │   │   ├── favicon.ico     # Ícone da aba do navegador
 │   │   ├── minha-defensoria/ # Rota confirmada
 │   │   │   └── page.js     # Componente da página Minha Defensoria
 │   │   ├── configuracoes/  # Nova seção (placeholder)
 │   │   │   └── page.js     # Componente da página de Configurações
 │   │   ├── notificacoes/
 │   │   │   └── page.js     # Componente da página de Notificações
 │   │   ├── listadepastas/  # Rota confirmada
 │   │   │   └── page.js     # Componente da página de Lista de Pastas
 │   │   ├── pasta/
 │   │   │   └── page.js     # Componente da página de Pasta Individual
 │   │   ├── solicitacoes/   # Rota confirmada
 │   │   │   └── page.js     # Componente da página de Solicitações (placeholder para cadastro)
 │   │   ├── documentos/     # Nova seção (placeholder)
 │   │   │   └── page.js     # Componente da página de Documentos
 │   │   └── ... (outras pastas como hooks, utils, etc. se houver)
 │   ├── components/
 │   │   ├── ConfirmActionModal/
 │   │   │   ├── ModalConfirmacaoAssustadora.js       # Componente modal reutilizável
 │   │   │   └── ModalConfirmacaoAssustadora.test.js  # Testes para o modal
 │   │   ├── PastaHeader/
 │   │   │   ├── PastaHeader.js                       # Componente header da pasta
 │   │   │   └── PastaHeader.test.js                  # Testes para o header (em andamento)
 │   │   ├── PastaActionButton/                     # Componente reutilizável para botões de ação quadrados
 │   │   │   └── PastaActionButton.js
 │   │   ├── DefensoriaActionButtons/               # Componente com botões de ação para Minha Defensoria
 │   │   │   └── DefensoriaActionButtons.js
 │   │   ├── EquipeTrabalhoTable/                   # Componente para exibir a tabela da equipe de trabalho
 │   │   │   └── EquipeTrabalhoTable.js
 │   │   ├── PastaListItem/                         # Novo componente para item da lista de pastas
 │   │   │   └── PastaListItem.js
 │   │   └── ... (outros componentes reutilizáveis)
 │   ├── data/                                      # Dados mockados
 │   │   ├── pastas-data.json                       # JSON com dados de pastas
 │   │   └── dadosEquipesDefensorias.json           # JSON com dados das equipes para Minha Defensoria
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
 ├── COMO_CRIAR_PAGINA.md # Documentação sobre criação de páginas
 ├── INSTRUCOES_SETUP.md # Guia de configuração do projeto (inclui setup de testes)
 ├── LESSONS_LEARNED.md  # Lições aprendidas durante o desenvolvimento
 └── resumo.md           # Este arquivo de resumo
```

## Funcionalidades Implementadas (Protótipos)

1.  **Hub Central (`/`)**
    *   Página inicial que lista os protótipos disponíveis (Notificações, Lista de Pastas, etc.).
    *   Coberta por teste básico (`page.test.js`).
    *   Permite gerar lista de pastas com quantidade específica.

2.  **Notificações (`/notificacoes`)**
    *   Lista de notificações com paginação simulada. Layout de duas colunas. (Sem alterações recentes significativas)

3.  **Lista de Pastas (`/listadepastas`)**
    *   Layout de duas colunas (menu lateral estático à esquerda, conteúdo à direita).
    *   Exibe uma lista de pastas, podendo carregar dados de um JSON (`pastas-data.json`) ou gerar dados fictícios via parâmetro URL (`?generate=N`).
    *   **Abas de Filtragem:**
        *   "Pastas ativas", "Pastas Arquivadas", "Todas as Pastas".
        *   Exibem contadores dinâmicos da quantidade de pastas em cada categoria.
        *   Filtram a lista de pastas exibida de acordo com a aba selecionada.
    *   **Barra de Ferramentas (Visual):**
        *   Botões "Configurações de exibição", "Remover destaque".
        *   Badge "RÉU PRESO".
        *   Select "Último atendimento".
        *   Ícone de ordenação.
        *   (Estes controles são visuais e não possuem funcionalidade implementada).
    *   **Itens da Lista (`PastaListItem.js`):**
        *   Cada pasta é renderizada por este componente.
        *   Possui borda esquerda colorida indicando status (verde para ativa, amarelo para ativa com "Réu preso", cinza para arquivada).
        *   Exibe badges "ASSISTIDO" e condicionalmente "RÉU PRESO".
        *   Ações: Ícone para adicionar (sem funcionalidade), ícone para arquivar/desarquivar (funcional).
        *   Detalhes exibidos: Processo Principal, Comarca, Órgão Julgador, Área, Classe, Assunto (clicável, mas sem ação definida), Descrição.
        *   Se arquivada, exibe "Motivo do arquivamento" com a observação opcional (em itálico e entre parênteses).
        *   Exibe "Último Atendimento" e data.
        *   Badge de status ("Ativa"/"Arquivada") visível no cabeçalho do item, à esquerda das ações.
        *   Link para expandir/recolher processos associados.
        *   **Modais de Ação (no `PastaListItem.js`):**
            *   **Arquivamento:** Acionado pelo ícone de arquivo. Utiliza o `ModalConfirmacaoAssustadora`. Permite selecionar motivo (Radio.Group) e adicionar observação (Textarea).
            *   **Desarquivamento:** Acionado pelo ícone de desarquivar. Utiliza o `ModalConfirmacaoAssustadora`. Exibe motivo do arquivamento.
            *   Ambas modais exigem checkbox de ciência.
            *   As ações de arquivar/desarquivar atualizam o estado da lista de pastas na página principal.

4.  **Pasta Individual (`/pasta`)**
    *   **Objetivo:** Exibir detalhes e permitir o gerenciamento do status e dados de uma pasta específica.
    *   **Layout:** Segue o padrão de duas colunas.
    *   **Componente Principal:** Utiliza o `PastaHeader` para exibir as informações e ações principais.
    *   **`PastaHeader.js`:**
        *   **Cabeçalho Superior:** Ícone de voltar, título "Pasta [Área]". Ações de:
            *   Informações da pasta (ícone 'i'): Abre modal padrão com metadados.
            *   Arquivar/Desarquivar (ícones `IconArchive`/`IconArchiveOff`): Abre modal de confirmação correspondente.
            *   Excluir (sem funcionalidade).
            *   Adicionar (sem funcionalidade).
        *   **Bloco de Informações Principal (Grade):** Exibe Assistido, Assunto, Descrição (simplificada), Status (badge simplificado, sem tooltip ou motivo ao lado), Processo, Comarca, Órgão Julgador, Classe.
        *   **Barra de Botões de Ação:** Botões quadrados para "Assistidos...", "Atendimentos", "Peças e ofícios", "Requisição de certidões", "Documentos", "Observações", "Processos", "Dados da pasta" (com ícone `IconClipboardText`). (Estes botões são visuais e não possuem funcionalidade de navegação ou conteúdo implementada).
        *   **Seção "Dados da Pasta" (Condicional):**
            *   Aparece ao clicar no botão "Dados da pasta".
            *   Exibe informações de leitura: Data de criação, Criado por, Defensoria, Status (com detalhes de arquivamento: data, motivo com observação opcional em itálico, arquivado por).
            *   Contém campos editáveis: Área (Select), Assunto CNJ (Select), Descrição adicional (Textarea).
            *   Botões "Salvar" e "Cancelar" (Salvar apenas loga no console por enquanto).
            *   Permite alternar entre layouts ("Atual", "Colunas", "Agrupado com Divisor") através de RadioButtons (localizados no final da página `pasta/page.js`).
    *   **Gerenciamento de Estado (`pasta/page.js`):**
        *   Usa `useState` para controlar os dados da pasta (`pastaData`), que são atualizados localmente pelas ações de arquivar/desarquivar.
        *   Controla a visibilidade das modais de confirmação e o `selectedLayout` para a seção "Dados da Pasta".
    *   **Modais de Confirmação (`pasta/page.js`):**
        *   **Arquivamento:** Acionada pelo `PastaHeader`. Utiliza `ModalConfirmacaoAssustadora`. É idêntica à modal da lista de pastas (com seleção de motivo e observação).
        *   **Desarquivamento:** Acionada pelo `PastaHeader`. Utiliza `ModalConfirmacaoAssustadora`. Exibe motivo do arquivamento.
        *   **Modal de Informações (no `PastaHeader.js`):** Acionada pelo ícone 'i' no cabeçalho. É uma modal padrão do Mantine, com cabeçalho escuro, exibindo os metadados da pasta.

5.  **Minha Defensoria (`/minha-defensoria`)**
    *   **Objetivo:** Permitir a visualização e gerenciamento da equipe de trabalho da defensoria selecionada, além de acesso rápido a outras funcionalidades do contexto da defensoria do usuário.
    *   **Layout:** Segue o padrão de duas colunas. O menu lateral esquerdo utiliza a imagem `menulateralminhadefensoria.png` e funciona como um link para a própria página `/minha-defensoria`.
    *   **Seleção de Defensoria:** Um `Select` permite ao usuário escolher qual defensoria visualizar (1ª a 8ª), carregando dinamicamente a equipe correspondente.
    *   **Botões de Ação (`DefensoriaActionButtons.js`):
        *   Renderiza um grupo de botões utilizando o componente `PastaActionButton`.
        *   Botões disponíveis (com respectivos ícones):
            *   "Visão Geral" (`IconLayoutDashboard`)
            *   "Modelos e Favoritos" (`IconStar`)
            *   "Mensagens recebidas" (`IconMail`)
            *   "Documentos recebidos" (`IconFileDownload`)
            *   "Certidões recebidas" (`IconCertificate`)
            *   "Assistidos atendidos" (`IconListCheck`)
        *   O botão "Visão Geral" é destacado como ativo por padrão (fundo azul `#228be6`, texto/ícone branco).
        *   Botões inativos possuem fundo branco e texto/ícone azul (`#228be6`).
        *   Atualmente, o clique nos botões apenas registra no console.
    *   **Alerta de "Não Pertence à Equipe":**
        *   Exibido se o usuário logado (Humberto) não fizer parte da equipe da defensoria selecionada.
        *   Mensagem: "Você está visualizando uma Defensoria da qual não integra a equipe de trabalho. Para solicitar acesso e permissões de alteração, por favor, contate o Gerente desta Defensoria. A visualização dos membros está disponível."
    *   **Equipe de Trabalho (`EquipeTrabalhoTable.js`):
        *   Exibe os membros da defensoria selecionada em uma tabela paginada.
        *   Os controles de paginação (número de páginas e seletor de itens por página) são exibidos mesmo que haja apenas uma página de resultados (desde que a equipe não esteja vazia).
        *   Nomes na 3ª Defensoria foram atualizados para serem mais realistas (substituindo os genéricos), mantendo "Humberto Borges Ribeiro" como exemplo.
        *   **Ações por Membro na Tabela:**
            *   **Informações (ícone `IconInfoCircle`):** Primeiro ícone, sempre habilitado. Abre uma modal com:
                *   Dados do usuário: Nome, Matrícula, Cargo.
                *   Tabela de participação em equipes: Defensoria, Funções (exibidas como `Badges` coloridos - rosa para Gerente não removível, azul para os demais, com tooltips descritivos), Data de Entrada.
                *   Tooltip na "Data de Entrada": Mostra "Adicionado por: [Nome do Gerente (Matrícula)]" ou "Adicionado por: Sistema" (para Defensores ou se não houver gerente).
                *   A modal possui cabeçalho escuro personalizado.
            *   **Adicionar Função (ícone `IconPlaylistAdd`):** Habilitado se o usuário logado for Gerente na defensoria selecionada e pertencer à equipe. Abre modal com cabeçalho escuro para adicionar funções não existentes ao membro.
            *   **Remover Usuário (ícone `IconUserOff`):** Habilitado sob as mesmas condições de "Adicionar Função", mas não aparece para membros com cargo "Defensor(a) Público(a)". (Funcionalidade de remoção ainda é placeholder).
        *   **Botão "Adicionar Usuário à Equipe":** Visível no cabeçalho da seção da equipe e habilitado se o usuário logado for Gerente e pertencer à equipe. (Funcionalidade ainda é placeholder).
    *   **Dados da Equipe:** Carregados de `src/data/dadosEquipesDefensorias.json`.

6.  **Componente Reutilizável `PastaActionButton.js`**
    *   Movido para seu próprio arquivo: `src/components/PastaActionButton/PastaActionButton.js`.
    *   Utilizado em `PastaHeader.js` e `DefensoriaActionButtons.js`.
    *   **Props Principais:** `title`, `icon`, `count`, `alert`, `onClick`, `isActive`.
    *   **Estilo Condicional (`isActive`):
        *   **Ativo (`isActive={true}`):** Fundo azul (`#228be6`), texto/ícone/contador brancos, borda azul `#228be6`.
        *   **Inativo (`isActive={false}`):** Fundo branco, texto/ícone/contador azuis (`#228be6`), borda azul clara. Hover com fundo cinza claro.
    *   Exibe um contador numérico ou um ícone de alerta no canto superior direito.

7.  **Componente Reutilizável `ModalConfirmacaoAssustadora.js`**
    *   Modal genérica para ações que exigem atenção.
    *   Apresenta Alerta, título, mensagem, checkbox de ciência (obrigatório para habilitar confirmação) e botões de Confirmar/Cancelar.
    *   Foi modificada para aceitar `children`, permitindo a inclusão de conteúdo customizado (como `Radio.Group` e `Textarea`).

## Abordagem de Layout

*   O `layout.js` raiz configura o `MantineProvider`.
*   Páginas como `/notificacoes`, `/listadepastas`, `/pasta`, `/minha-defensoria` e `/solicitacoes` usam `Flexbox` para um layout de duas colunas.
*   O "menu lateral" nas páginas `/listadepastas` e `/pasta` é a imagem estática `menulateral.png` sem interatividade.
*   Nas páginas `/minha-defensoria` e `/solicitacoes`, o "menu lateral" é a imagem `menulateralminhadefensoria.png`, que também funciona como um link para a página `/minha-defensoria`.
*   O "menu superior" (`menucadastro.png`) também é estático e usado em `/listadepastas` (e `/solicitacoes`).

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

## Novas Seções (Placeholders)

8.  **Configurações (`/configuracoes`)**
    *   Página placeholder destinada a futuras opções de configuração do sistema e preferências do usuário.
    *   Utiliza o layout padrão de duas colunas com `menulateral.png`.

9.  **Documentos (`/documentos`)**
    *   Página placeholder destinada à funcionalidade de gerenciamento de documentos.
    *   Utiliza o componente `CadastroHeader` (com dados mockados) e o layout padrão de duas colunas com `menulateral.png`.

## Observações Adicionais sobre Funcionalidades

*   **Solicitações (`/solicitacoes`):**
    *   Atualmente é uma página placeholder para um futuro formulário de cadastro de solicitações.
    *   Utiliza o menu lateral `menulateralminhadefensoria.png` (que direciona para `/minha-defensoria`) e o menu superior `menucadastro.png`. 