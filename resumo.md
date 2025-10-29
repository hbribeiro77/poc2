# Resumo do Projeto: poc2 (Protótipos Defensoria)

## Objetivo

Este projeto serve como uma Prova de Conceito (PoC) para desenvolver e testar protótipos de funcionalidades específicas, recriando interfaces de usuário semelhantes às do sistema da Defensoria, utilizando tecnologias web modernas.

## Tecnologias Utilizadas

*   **Framework:** Next.js (v15+) com App Router
*   **Linguagem:** JavaScript (React v19)
*   **UI Library:** Mantine UI (v7) com Notifications
*   **Ícones:** Tabler Icons
*   **Testes:** Jest (v29) e React Testing Library (com User Event)
*   **Gerenciamento de Estado:** React Context API (para chat global)
*   **Persistência:** localStorage (para históricos de chat)
*   **Drag & Drop:** react-draggable (para modais interativos)
*   **Notificações:** Mantine Notifications (para feedback de ações)
*   **Busca Fuzzy:** Fuse.js (para busca inteligente no Spotlight)

## Estrutura do Projeto (Arquivos Relevantes)

```diff
 poc2/
 ├── coverage/             # Relatórios de cobertura de testes gerados pelo Jest
 ├── public/
 │   ├── menulateral.png   # Imagem do menu lateral estático (usado em /listadepastas, /pasta)
 │   ├── menulateralminhadefensoria.png # Imagem do menu lateral para /minha-defensoria e /solicitacoes
 │   ├── menucadastro.png  # Imagem do menu superior estático (usado em /listadepastas)
 │   ├── atintimacoes.jpg  # Imagem de intimação para /intimacoes
 │   └── ... (outros arquivos como SVGs)
 ├── src/
 │   ├── app/
 │   │   ├── layout.js       # Layout raiz (contém MantineProvider)
 │   │   ├── page.js         # Página principal (Hub de Protótipos)
 │   │   ├── page.test.js    # Teste para a página principal (Hub)
 │   │   ├── globals.css     # Estilos globais (pode incluir imports do Mantine)
 │   │   ├── favicon.ico     # Ícone da aba do navegador
 │   │   ├── chat/
 │   │   │   └── [pastaId]/
 │   │   │       └── page.js     # Página de chat com o assistido
 │   │   ├── minha-defensoria/ # Rota confirmada
 │   │   │   └── page.js     # Componente da página Minha Defensoria
 │   │   ├── configuracoes/  # Nova seção (placeholder)
 │   │   │   └── page.js     # Componente da página de Configurações
 │   │   ├── notificacoes/
 │   │   │   └── page.js     # Componente da página de Notificações
 │   │   ├── listadepastas/  # Rota original (legado)
 │   │   │   └── page.js
 │   │   ├── listadepastas-v2/ # Evolução da UI
 │   │   │   └── page.js
 │   │   ├── listadepastas-v3/ # Versão mais recente com UI refinada
 │   │   │   └── page.js
 │   │   ├── listadepastas-v4/ # Nova versão de lista de pastas
 │   │   │   └── page.js
 │   │   ├── pasta/          # Rota original (legado)
 │   │   │   └── page.js
 │   │   ├── pasta-v2/         # Evolução da UI
 │   │   │   └── page.js
 │   │   ├── solicitacoes/   # Rota confirmada
 │   │   │   └── page.js     # Componente da página de Solicitações (placeholder para cadastro)
 │   │   ├── documentos/     # Nova seção (placeholder)
 │   │   │   └── page.js     # Componente da página de Documentos
 │   │   ├── inteligencia-artificial/  # Nova seção para IA
 │   │   │   └── page.js     # Componente da página de Inteligência Artificial
 │   │   ├── area-de-trabalho/  # Nova seção para área de trabalho
 │   │   │   └── page.js     # Página principal de gerenciamento de intimações
 │   │   ├── intimacoes/     # Nova seção para intimações
 │   │   │   └── page.js     # Página simples com imagem de intimação
 │   │   ├── historico-atividades/  # Nova seção para histórico
 │   │   │   └── page.js     # Página de consulta de histórico
 │   │   └── ... (outras pastas como hooks, utils, etc. se houver)
 │   ├── contexts/
 │   │   └── ChatManagerContext.js              # Contexto global para gerenciamento de múltiplos chats
 │   ├── hooks/
 │   │   └── useChatManager.js                  # Hook personalizado para usar o sistema de chat
 │   ├── components/
 │   │   ├── ChatManager/
 │   │   │   └── ChatManager.js                 # Componente que renderiza todos os chats ativos globalmente
 │   │   ├── DraggableModal/
 │   │   │   ├── DraggableModal.js              # Modal arrastável e redimensionável para chats
 │   │   │   └── DraggableModal.module.css      # Estilos CSS para o modal
 │   │   ├── ChatUI/
 │   │   │   └── ChatUI.js                      # Componente de UI para o chat
 │   │   ├── WhatsappChatModal/
 │   │   │   └── WhatsappChatModal.js           # Modal que simula a interface do WhatsApp
 │   │   ├── SendMessageModal/
 │   │   │   └── SendMessageModal.js            # Modal para envio de mensagens padronizadas
 │   │   ├── ApprovalChatModal/
 │   │   │   └── ApprovalChatModal.js           # Modal de chat para aprovação de peças
 │   │   ├── PecaParaAprovarCard/
 │   │   │   └── PecaParaAprovarCard.js         # Card para peças pendentes de aprovação
 │   │   ├── PecaseOficiosList/
 │   │   │   └── PecaseOficiosList.js           # Lista de peças e ofícios
 │   │   ├── VisaoGeralTimeline/
 │   │   │   └── VisaoGeralTimeline.js          # Timeline de eventos para a visão geral
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
 │   │   ├── NovaRegraModal/                        # Modal para criação/edição de regras de IA
 │   │   │   └── NovaRegraModal.js                  # Componente reutilizável com seção de ferramentas
    │   │   ├── ProcessoCard/                          # Card para exibir informações de processos jurídicos
    │   │   │   └── ProcessoCard.js                    # Componente com ações laterais, triagem e seleção
    │   │   ├── Spotlight/                             # Componente Command Palette (Spotlight)
    │   │   │   └── Spotlight.js                       # Modal de busca rápida com atalho de teclado
    │   │   ├── IAChatModal/                           # Modal de chat com IA
    │   │   │   └── IAChatModal.js                     # Chat flutuante para criação de tarefas com IA
    │   │   └── ... (outros componentes reutilizáveis)
 │   ├── data/                                      # Dados mockados
 │   │   ├── pastas-data.json                       # JSON com dados de pastas
 │   │   └── dadosEquipesDefensorias.json           # JSON com dados das equipes para Minha Defensoria
 │   │   ├── pecas-para-aprovar-data.json         # JSON com dados de peças para aprovação
 │   │   ├── visao-geral-data.json                # JSON com dados para a timeline de visão geral
 │   │   ├── regras-ia-data.json                  # JSON com dados de regras de IA e ferramentas
 │   │   └── processos-data.json                  # JSON com dados de processos jurídicos para Área de Trabalho
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

## Sistema de Chat Global

O projeto implementa um **sistema de chat global** que permite múltiplas conversas simultâneas em qualquer página da aplicação, usando React Context API para gerenciamento de estado.

### Arquitetura do Sistema de Chat

*   **`ChatManagerContext.js`:** Contexto React que gerencia o estado global de todos os chats ativos.
*   **`useChatManager.js`:** Hook personalizado que facilita o uso das funcionalidades de chat em qualquer componente.
*   **`ChatManager.js`:** Componente global renderizado no `layout.js` que exibe todos os chats ativos como modais flutuantes.
*   **`DraggableModal.js`:** Modal interativo com funcionalidades de arrastar, redimensionar, minimizar/maximizar.

### Funcionalidades do Sistema

*   **Múltiplos Chats Simultâneos:** Permite abrir várias conversas ao mesmo tempo, cada uma em seu próprio modal ou em nova aba (ambos padronizados).
*   **Persistência Automática:** Histórico de conversas salvo automaticamente no `localStorage` com a chave `'chat_histories'`.
*   **Estado Persistente:** Conversas mantêm estado entre sessões - ao reabrir um chat, o histórico é restaurado.
*   **Notificações Visuais:** Contador de mensagens não lidas e animações quando o chat está minimizado.
*   **Interação Não-Bloqueante:** Modais não impedem a navegação na página principal.
*   **Controles Avançados:** 
    *   Arrastar modais pela tela
    *   Redimensionar com alça no canto inferior direito
    *   Minimizar para botão flutuante
    *   Maximizar com configurações personalizáveis por página
    *   **Limpar conversa:** Cada modal de chat possui um botão discreto de lixeira no cabeçalho, que limpa apenas o histórico daquela conversa/modal, sem afetar outros chats abertos.
    *   **Encerramento e Continuação:** Ao encerrar a conversa (tanto na modal quanto na nova aba), é exibida uma mensagem automática padronizada com rodapé (#ID, Processo, Assunto) e o nome do atendente. O botão de encerrar fica desabilitado e aparece o botão "Continuar Conversa" para reativar o chat. O botão de encerrar exibe o ícone (i) com tooltip explicativo.

### Padrão do Rodapé das Mensagens

*   Toda mensagem enviada pelo defensor no chat (modal global ou WhatsApp em nova aba) inclui automaticamente um rodapé com informações da pasta:
    *   `#ID` (ex: #12345)
    *   `Processo: ...` (se existir, usando processoPrincipal ou processo)
    *   `Assunto: ...`
*   Não exibe mais a descrição da pasta no rodapé.

### Integração Global

O sistema está integrado no `layout.js` raiz através do `ChatManagerProvider`, tornando-o disponível em toda a aplicação. Qualquer página pode iniciar um chat usando o hook `useChatManager`.

## Funcionalidades Implementadas (Protótipos)

1.  **Hub Central (`/`)**
    *   Página inicial que lista os protótipos disponíveis (Notificações, Lista de Pastas, Inteligência Artificial, etc.).
    *   Coberta por teste básico (`page.test.js`).
    *   Permite gerar lista de pastas com quantidade específica.
    *   **Novo Card "Inteligência Artificial":** Adicionado com cor roxa e link para `/inteligencia-artificial`.

2.  **Notificações (`/notificacoes`)**
    *   Lista de notificações com paginação simulada. Layout de duas colunas. (Sem alterações recentes significativas)

3.  **Lista de Pastas (`/listadepastas`, `/listadepastas-v2`, `/listadepastas-v3`)**
    *   Layout de duas colunas (menu lateral estático à esquerda, conteúdo à direita).
    *   Exibe uma lista de pastas, podendo carregar dados de um JSON (`pastas-data.json`) ou gerar dados fictícios via parâmetro URL (`?generate=N`).
    *   **Versões:** A funcionalidade evoluiu através das versões, com a `v3` sendo a mais recente e refinada em termos de UI, melhorando a organização das abas e da barra de ferramentas.
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
    *   **Radio Buttons de Versão do Chat (v3 apenas):**
        *   Localizados discretamente na parte inferior da página, acima do botão "Voltar à Central".
        *   **V0**: Chat abre sem o botão "Encerrar Conversa".
        *   **V1**: Chat abre com comportamento padrão (com botão "Encerrar Conversa").
        *   Controla o parâmetro `hideEndButton=true` na URL da página de chat.
        *   Implementação customizada usando `onCustomWhatsappClick` e `chatBehavior="custom"` no `PastaListItem`.
    *   **Itens da Lista (`PastaListItem.js`):**
        *   Cada pasta é renderizada por este componente.
        *   Possui borda esquerda colorida indicando status (verde para ativa, amarelo para ativa com "Réu preso", cinza para arquivada).
        *   Exibe badges "ASSISTIDO" e condicionalmente "RÉU PRESO".
        *   Ações: Ícone para adicionar (sem funcionalidade), ícone para arquivar/desarquivar (funcional) e **ícone de chat**.
        *   **Ação de Chat (v1-v3):** O clique no ícone de chat salva os dados da pasta no `localStorage` e abre a página `/chat/[pastaId]` em uma nova aba para iniciar a conversa.
        *   **Comportamentos de Chat Diferenciados:**
            *   **v1-v2**: `chatBehavior="newTab"` - comportamento padrão.
            *   **v3**: `chatBehavior="custom"` - usa `onCustomWhatsappClick` para controlar se o chat abre com ou sem botão "Encerrar Conversa" baseado nos radio buttons.
            *   **v4**: `onChatClick` - abre modal de chat global.
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

4.  **Lista de Pastas v4 (`/listadepastas-v4`)**
    *   **Objetivo:** Demonstrar a integração com o **Sistema de Chat Global**, substituindo a navegação para uma nova página por uma experiência de modal flutuante e persistente, permitindo que o usuário continue navegando na lista de pastas enquanto conversa.
    *   **Diferença Chave vs. v3:** O clique no ícone de chat em um `PastaListItem` não abre mais uma nova aba. Em vez disso, utiliza o hook `useChatManager` para abrir um **modal de chat flutuante** gerenciado globalmente pelo sistema.
    *   **Componente `DraggableModal.js`:**
        *   **Arrastável (Drag):** O modal pode ser movido livremente pela tela.
        *   **Redimensionável (Resize):** Possui uma alça no canto inferior direito para redimensionamento. As dimensões são salvas em `vw` e `vh` para manter a proporção.
        *   **Minimizar:** Um botão no cabeçalho minimiza o modal para um botão flutuante no canto da tela (semelhante a chats do Messenger).
        *   **Maximizar/Restaurar:** Alterna o tamanho do modal entre as dimensões definidas pelo usuário e um estado maximizado (com um offset para não cobrir o menu lateral).
        *   **Fechar:** Fecha o modal, mas mantém o estado da conversa salvo.
        *   **Interação com Fundo:** O modal não bloqueia a interação com a página principal. O usuário pode clicar em outros itens da lista enquanto o chat está aberto.
        *   **Limpar conversa:** Botão discreto de lixeira no cabeçalho da modal permite limpar apenas o histórico daquela conversa/modal, sem afetar outros chats abertos.
    *   **Botão Minimizado Interativo:**
        *   **Estado Padrão:** Um botão redondo com o ícone do WhatsApp, posicionado de forma flutuante.
        *   **Efeito Hover:** Ao passar o mouse, o botão se expande para mostrar o título do chat (nome do assistido).
        *   **Notificações:** Quando uma nova mensagem é simulada enquanto o chat está minimizado, o botão exibe uma animação "pulsante" e um contador (`Badge`) de mensagens não lidas.
    *   **Integração com Sistema Global (`listadepastas-v4/page.js`):**
        *   **Uso do Hook `useChatManager`:** A página utiliza o hook personalizado para acessar as funcionalidades de chat global (openChat, simulateNewMessage, etc.).
        *   **Configurações Personalizadas:** Define estilos customizados para maximização (não cobrir o menu lateral) e alinhamento inicial à direita.
        *   **Simulação de Chat:** Um botão "Simular Nova Mensagem" demonstra o sistema de notificação, adicionando mensagens aos chats ativos.
        *   **Gerenciamento Automático:** O estado dos chats, persistência e renderização são gerenciados automaticamente pelo sistema global.
    *   **Modificações em `PastaListItem.js`:**
        *   O componente foi refatorado para aceitar uma prop `onChatClick`. Isso o torna mais flexível, permitindo que a página pai (`listadepastas-v4`) defina o que acontece quando o ícone de chat é clicado (neste caso, abrir o modal em vez de navegar).

5.  **Pasta Individual (`/pasta`, `/pasta-v2`)**
    *   **Objetivo:** Exibir detalhes e permitir o gerenciamento do status e dados de uma pasta específica. A versão `v2` representa um refinamento da interface.
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

6.  **Minha Defensoria (`/minha-defensoria`)**
    *   **Objetivo:** Permitir a visualização e gerenciamento da equipe de trabalho da defensoria selecionada, além de acesso rápido a outras funcionalidades do contexto da defensoria do usuário.
    *   **Layout:** Segue o padrão de duas colunas. O menu lateral esquerdo utiliza a imagem `menulateralminhadefensoria.png` e funciona como um link para a própria página `/minha-defensoria`.
    *   **Seleção de Defensoria:** Um `Select` permite ao usuário escolher qual defensoria visualizar (1ª a 8ª), carregando dinamicamente a equipe correspondente.
    *   **Botões de Ação (`DefensoriaActionButtons.js`):
        *   Renderiza um grupo de botões utilizando o componente `PastaActionButton`.
        *   Botões disponíveis (com respectivos ícones):
            *   **"Visão Geral" (`IconLayoutDashboard`):** Funcionalidade implementada. Mostra uma timeline de eventos da pasta.
            *   **"Peças e Ofícios" (`IconFileText`):** Funcionalidade implementada. Exibe uma lista de peças para aprovação.
            *   "Modelos e Favoritos" (`IconStar`)
            *   "Mensagens recebidas" (`IconMail`)
            *   "Documentos recebidos" (`IconFileDownload`)
            *   "Certidões recebidas" (`IconCertificate`)
            *   "Assistidos atendidos" (`IconListCheck`)
        *   O clique nos botões alterna a visualização do conteúdo principal da página entre a Visão Geral, a lista de Peças/Ofícios e a Equipe de Trabalho.
    *   **Alerta de "Não Pertence à Equipe":**
        *   Exibido se o usuário logado (Humberto) não fizer parte da equipe da defensoria selecionada.
        *   Mensagem: "Você está visualizando uma Defensoria da qual não integra a equipe de trabalho. Para solicitar acesso e permissões de alteração, por favor, contate o Gerente desta Defensoria. A visualização dos membros está disponível."
    *   **Conteúdo Dinâmico (Novas Funcionalidades):**
        *   **Visão Geral:** Renderiza o componente `VisaoGeralTimeline`, que exibe uma linha do tempo com eventos da defensoria, carregados de `visao-geral-data.json`.
        *   **Peças e Ofícios:** Renderiza o componente `PecaseOficiosList`, que mostra cards (`PecaParaAprovarCard`) com peças pendentes de aprovação, carregadas de `pecas-para-aprovar-data.json`. Cada card possui ações para "Ver peça", "Aprovar" e "Reprovar".
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

7.  **Chat com Assistido (`/chat/[pastaId]`) - Sistema Legado**
    *   **Status:** Página de fallback mantida para compatibilidade com as versões v1-v3 da lista de pastas.
    *   **Objetivo:** Fornecer uma interface de comunicação direta com o assistido, simulando um chat de WhatsApp em página dedicada.
    *   **Fluxo de Início (Legado):**
        *   Iniciado a partir do ícone de chat na `PastaListItem` nas versões v1-v3 da lista de pastas.
        *   Os dados da pasta clicada são salvos no `localStorage` do navegador.
        *   A página de chat é aberta em uma nova aba, lendo o ID da pasta da URL.
    *   **Parâmetro `hideEndButton` (v3 apenas):**
        *   Aceita parâmetro URL `?hideEndButton=true` para controlar a exibição do botão "Encerrar Conversa".
        *   Quando `true`, o botão "Encerrar Conversa" não é exibido no `WhatsappChatModal`.
        *   O botão "Enviar" é alinhado automaticamente à direita quando o botão encerrar está oculto.
        *   Implementado para suportar os radio buttons V0/V1 da lista de pastas v3.
    *   **Carregamento de Dados:** A página busca os dados da pasta e o histórico de conversas do `localStorage`. Se os dados não forem encontrados, exibe uma mensagem de erro.
    *   **Interface:** Utiliza o componente `WhatsappChatModal` para renderizar a UI do chat, exibindo as informações do processo e do assistido no cabeçalho.
    *   **Persistência:** Todo o histórico de chat é salvo automaticamente no `localStorage`.
    *   **Nota:** Esta funcionalidade foi **substituída pelo Sistema de Chat Global** na versão v4+, que oferece melhor experiência de usuário com modais flutuantes e múltiplos chats simultâneos.

8.  **Refatoração da Modal de Arquivamento e Integração**
    *   **Objetivo:** Centralizar a lógica de arquivamento em um componente reutilizável, limpando o código de outras páginas e garantindo consistência.
    *   **Criação do Componente `ArchivePastaModal.js`:**
        *   A lógica e a interface da modal de arquivamento, que antes estavam na página `/pasta`, foram extraídas para este novo componente.
        *   O componente é totalmente encapsulado, gerenciando seus próprios estados internos (motivo, observação) e se comunicando com o componente "pai" através de `props` (`opened`, `onClose`, `onConfirm`).
    *   **Refatoração da Página da Pasta (`/pasta`):**
        *   O código da modal foi removido da página e substituído por uma única chamada ao `<ArchivePastaModal />`.
        *   A função `handleConfirmArchive` foi simplificada para apenas receber os dados do componente da modal.
    *   **Refatoração da Lista de Pastas (`/listadepastas`):**
        *   O componente `PastaListItem.js` foi simplificado, removendo sua lógica interna e modal de arquivamento duplicada.
        *   A página `listadepastas/page.js` agora gerencia a exibição da `ArchivePastaModal`.
        *   Clicar no ícone de arquivar em um item da lista agora aciona a modal centralizada, que por sua vez atualiza o estado da lista na página principal.
    *   **Correção de Bugs:**
        *   Durante o processo, foram corrigidos bugs de `render` nas páginas `/componentes` e `/pasta` que foram causados por uma refatoração anterior do componente `ApprovalChatModal`, garantindo a estabilidade da aplicação.
    *   **Atualização da Galeria de Componentes (`/componentes`):**
        *   O novo componente `ArchivePastaModal` foi adicionado à galeria para fácil visualização e teste.

9.  **Componente Reutilizável `PastaActionButton.js`**
    *   Movido para seu próprio arquivo: `src/components/PastaActionButton/PastaActionButton.js`.
    *   Utilizado em `PastaHeader.js` e `DefensoriaActionButtons.js`.
    *   **Props Principais:** `title`, `icon`, `count`, `alert`, `onClick`, `isActive`.
    *   **Estilo Condicional (`isActive`):
        *   **Ativo (`isActive={true}`):** Fundo azul (`#228be6`), texto/ícone/contador brancos, borda azul `#228be6`.
        *   **Inativo (`isActive={false}`):** Fundo branco, texto/ícone/contador azuis (`#228be6`), borda azul clara. Hover com fundo cinza claro.
    *   Exibe um contador numérico ou um ícone de alerta no canto superior direito.

10. **Componente Reutilizável `ModalConfirmacaoAssustadora.js`**
    *   Modal genérica para ações que exigem atenção.
    *   Apresenta Alerta, título, mensagem, checkbox de ciência (obrigatório para habilitar confirmação) e botões de Confirmar/Cancelar.
    *   Foi modificada para aceitar `children`, permitindo a inclusão de conteúdo customizado (como `Radio.Group` e `Textarea`).

## Abordagem de Layout

*   O `layout.js` raiz configura o `MantineProvider` e o **`ChatManagerProvider`** (sistema de chat global).
*   O componente **`ChatManager`** é renderizado globalmente no `layout.js`, gerenciando todos os chats ativos como modais flutuantes.
*   Páginas como `/notificacoes`, `/listadepastas`, `/pasta`, `/minha-defensoria` e `/solicitacoes` usam `Flexbox` para um layout de duas colunas.
*   O "menu lateral" nas páginas `/listadepastas` e `/pasta` é a imagem estática `menulateral.png` sem interatividade.
*   Nas páginas `/minha-defensoria` e `/solicitacoes`, o "menu lateral" é a imagem `menulateralminhadefensoria.png`, que também funciona como um link para a página `/minha-defensoria`.
*   O "menu superior" (`menucadastro.png`) também é estático e usado em `/listadepastas` (e `/solicitacoes`).
*   **Modais de Chat:** Renderizados como `Portal` do Mantine, posicionados acima de todos os outros elementos com z-index alto, não interferindo no layout das páginas.

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

11. **Configurações (`/configuracoes`)**
    *   Página placeholder destinada a futuras opções de configuração do sistema e preferências do usuário.
    *   Utiliza o layout padrão de duas colunas com `menulateral.png`.

12. **Documentos (`/documentos`)**
    *   Página placeholder destinada à funcionalidade de gerenciamento de documentos.
    *   Utiliza o componente `CadastroHeader` (com dados mockados) e o layout padrão de duas colunas com `menulateral.png`.

13. **Inteligência Artificial (`/inteligencia-artificial`)**
    *   **Objetivo:** Página para gerenciamento de regras de IA e atividades automatizadas.
    *   **Layout:** Segue o padrão de duas colunas com `menulateral.png` (que funciona como link para `/area-de-trabalho`).
    *   **Navegação por Abas:** Três botões principais:
        *   **"Minhas Regras":** Gerencia regras de IA personalizadas do usuário.
        *   **"Explore Regras":** (Placeholder) Para explorar regras compartilhadas.
        *   **"Ranking":** (Placeholder) Para visualizar rankings de regras.
        *   **"Automatizações":** Exibe atividades automatizadas executadas pelo sistema.
    *   **Seção "Minhas Regras":**
        *   **Filtros:** Duas abas para "Triagem de intimação" e "Geração de petição".
        *   **Tabela:** Exibe regras com colunas: Data/Hora, Descrição, Regra, Usa Ferramenta, Ações.
        *   **Coluna "Usa Ferramenta":** Mostra "Não" ou badges com nomes das ferramentas utilizadas (Tarefa, Cota, Audiência).
        *   **Paginação:** Dinâmica baseada na quantidade de itens filtrados.
        *   **Botão "Criar Regra":** Abre modal para criação/edição de regras.
    *   **Modal "Nova Regra" (`NovaRegraModal.js`):**
        *   **Componente Reutilizável:** Extraído para componente independente e adicionado à galeria de componentes.
        *   **Campos Principais:** Tipo de Inferência (pré-selecionado como "Triagem de intimação"), Descrição, Regra, Status Ativa.
        *   **Seção "Ferramentas":** Configuração de ferramentas automatizadas:
            *   **Checkbox Principal:** "Usar ferramentas" para ativar/desativar toda a seção.
            *   **Ferramentas Disponíveis:**
                *   **"Criar Tarefa":** Checkbox simples (sem configurações adicionais).
                *   **"Criar Cota":** Checkbox com configurações (Prazo em dias, Observações).
                *   **"Criar Audiência":** Checkbox simples (sem configurações adicionais).
        *   **Funcionalidades Avançadas:**
            *   **Header e Footer Fixos:** Modal com cabeçalho e rodapé fixos, scroll apenas no conteúdo.
            *   **Scroll Automático:** Tela rola automaticamente para enquadrar conteúdo quando ferramentas são ativadas.
            *   **Edição:** Suporte para editar regras existentes com dados pré-preenchidos.
        *   **Integração:** Conectado ao sistema de dados JSON (`regras-ia-data.json`).
    *   **Seção "Automatizações":**
        *   **Filtros:** Período (Hoje, Esta Semana, Este Mês, Personalizado) e Tipo de Atividade (Todas, Criar Tarefa, Criar Cota, Criar Audiência).
        *   **Tabela:** Exibe atividades com colunas: Data/Hora, Atividade, Detalhes, Ações.
        *   **Dados de Exemplo:** 
            *   **Criar Tarefa:** "Elaborar peça de memoriais e entregue para HUMBERTO BORGES RIBEIRO".
            *   **Criar Cota:** "Criada cota para o processo 50012345678901234001".
            *   **Criar Audiência:** "Criada audiência para processo 1234567-89.2024.5.02.0001 para 15/11/2025".
        *   **Paginação:** Idêntica à seção "Minhas Regras" para consistência visual.
    *   **Dados:** Carregados de `src/data/regras-ia-data.json` com estrutura completa incluindo ferramentas e configurações.

14. **Área de Trabalho (`/area-de-trabalho`)** + **Spotlight Command Palette e Chat com IA**
    *   **Objetivo:** Página principal para gerenciamento de intimações e processos, baseada na página de configurações.
    *   **Layout:** Segue o padrão de duas colunas com `menulateral.png` (que funciona como link para `/intimacoes`).
    *   **Navegação por Abas:** Sete abas coloridas para diferentes categorias:
        *   **"Tarefas"** - `#337ab7` (azul)
        *   **"Peças para aprovação"** - `#f0ad4e` (laranja)
        *   **"Atendimentos para aprovação"** - `#5cb85c` (verde)
        *   **"Agendamentos"** - `#003366` (azul escuro)
        *   **"Audiências"** - `#ba8759` (marrom)
        *   **"Peticionamentos eletrônicos"** - `#da90aa` (rosa)
        *   **"Intimações"** - `#ff6a5b` (vermelho)
    *   **Barra de Filtros:**
        *   **Filtro por Defensoria:** Select com opções de 1ª a 4ª Defensoria Pública.
        *   **Filtro Geral:** Campo de texto para busca geral.
        *   **Botões de Ação:** Filtro, Ações em Lote (quando há seleções), Atualizar.
    *   **Sistema de Ações em Lote:**
        *   **Ícone de Ações:** Aparece apenas quando há processos selecionados (checkbox marcado).
        *   **Menu Dropdown:** Opções de "Ocultar", "Renunciar em Lote", "Encaminhar em Lote", "Triagem por IA em lote".
        *   **Triagem por IA:** Simula processamento com loading de 3 segundos e notificação toast.
    *   **Cards de Processo (`ProcessoCard.js`):**
        *   **Componente Reutilizável:** Extraído para componente independente e adicionado à galeria de componentes.
        *   **Layout de Informações:** Organizado em três linhas horizontais:
            *   **Linha 1:** Órgão julgador e Classe
            *   **Linha 2:** Disponibilização e Intimado
            *   **Linha 3:** Status (badge) e Prazo
        *   **Cabeçalho:** Checkbox de seleção, ícone de ampulheta, badge de categoria colorida.
        *   **Categoria como Badge:** Primeira informação exibida como badge colorido (Justiça Gratuita, Criminal, Família, etc.).
        *   **Botão de Triagem Manual:** Três pontos discretos no canto superior direito com menu dropdown.
        *   **Ações Laterais:** Sete botões de ação alinhados horizontalmente.
        *   **Resultados de Triagem:**
            *   **Triagem por IA:** Badge com ícone de cérebro (meio do card, canto direito).
            *   **Triagem Manual:** Badge colorida (60% da altura do card, canto direito).
    *   **Sistema de Triagem:**
        *   **Triagem por IA:** Cores `#f0ad4e` (Elaborar peça) e `#da90aa` (Renunciar ao prazo).
        *   **Triagem Manual:** Quatro opções com cores específicas:
            *   **"Elaborar peça"** - `#f0ad4e` (laranja)
            *   **"Contatar assistido"** - `#5cb85c` (verde)
            *   **"Renunciar ao prazo"** - `#da90aa` (rosa)
            *   **"Ocultar"** - `#888888` (cinza)
    *   **Notificações:** Sistema de toast integrado com Mantine Notifications para feedback de ações.
    *   **Dados:** Carregados de `src/data/processos-data.json` com estrutura de processos jurídicos.
    *   **Spotlight Command Palette (`Ctrl + Alt + T`):**
        *   Modal de busca rápida com ações disponíveis no sistema.
        *   Navegação por teclado (setas, Enter, Esc).
        *   Busca fuzzy com Fuse.js para encontrar ações rapidamente.
        *   Ações disponíveis: Criar Tarefa/Cota/Audiência com IA, Navegação para outras páginas, Ações da Área de Trabalho.
        *   Botão visual na barra de filtros para abrir o Spotlight.
    *   **Chat com IA (Modal Flutuante):**
        *   Modal compacto no canto inferior direito (420px de largura).
        *   z-index alto (20000) para aparecer acima de todos os elementos.
        *   Sem overlay escuro, permite interação com a página.
        *   Funcionalidades:
            *   Chat interativo com mensagens de usuário e IA.
            *   Ferramentas selecionáveis: Criar Tarefa, Criar Cota, Registrar Audiência.
            *   Criação automática de tarefas quando solicitado via chat.
            *   Botão de minimizar → Transforma em botão flutuante circular.
            *   Estado de "pensando" da IA com animação.
    *   **Sistema de Tarefas nos Cards:**
        *   Seção "Tarefas:" nos cards de processos (após Status e Prazo).
        *   Exibe tarefas criadas com ícone de relógio.
        *   Texto da tarefa com sublinhado (link).
        *   Tag "Peça" no formato badge laranja.
        *   Formato: `🕐 Fazer memoriais (em andamento por [Nome]) Peça`
    *   **Modo Automático de Criação de Tarefas (`Ctrl + Shift + H`):**
        *   Atalho secreto para ativar/desativar modo automático.
        *   Quando ativo, mostra indicador amarelo no topo: "Auto-criar tarefas: ON".
        *   Ao executar "Triagem por IA em lote", cria tarefas automaticamente para processos com resultado "Elaborar peça".
        *   Notificação diferenciada informando quantas tarefas foram criadas automaticamente.

15. **Contatos (`/contatos`, `/contatos-v2`)**
    *   **Objetivo:** Página para gerenciamento de contatos (assistidos, partes contrárias, etc.).
    *   **Layout:** Segue o padrão de duas colunas com `menulateral.png` e `menucadastro.png`.
    *   **Funcionalidades:**
        *   **Tabela de Contatos Principais:** Exibe contatos com colunas: Tipo, Contato, Observações, Atualizado em, Principal, Ações.
        *   **Ações por Contato:**
            *   Enviar mensagem (abre modal de envio)
            *   Editar contato (placeholder)
            *   Excluir contato (placeholder)
        *   **Paginação:** Dinâmica com controle de itens por página.
        *   **Modal de Envio de Mensagem:** Permite selecionar template e defensoria para envio.
        *   **Modal de Aprovação de Providência:** Sistema de chat integrado com timeline de aprovação.
        *   **Outros Contatos Disponíveis:** Seção adicional para contatos secundários.
        *   **Histórico:** Visualização de histórico de interações com os contatos.
    *   **`/contatos-v2`:** Cópia da página para novos desenvolvimentos.

17. **Intimações (`/intimacoes`)**
    *   **Objetivo:** Página simples para exibir uma grande imagem de intimação.
    *   **Conteúdo:** Apenas uma imagem (`atintimacoes.jpg`) centralizada na tela.
    *   **Navegação:** A imagem funciona como link para `/historico-atividades`.

18. **Histórico de Atividades (`/historico-atividades`)**
    *   **Objetivo:** Página para consulta de histórico de atividades do sistema.
    *   **Layout:** Segue o padrão de duas colunas com `menulateral.png`.
    *   **Funcionalidades:**
        *   **Filtros Simples:** Período (campos de data) e Atividade (Select com opções: Triagem de Intimações, Geração de Petições, Criação de Regras IA, Todas as Atividades).
        *   **Botão "Pesquisar":** Para executar a busca (funcionalidade placeholder).
    *   **Design:** Interface limpa e consistente com outras páginas do sistema.

## Integração com RAG (Retrieval-Augmented Generation)

*   **Sistema RAG de Defensoria:**
    *   O projeto está integrado com um sistema RAG através do MCP (Model Context Protocol).
    *   Funcionalidade disponível via `mcp_servidor-rag-defensoria_fazer_pergunta_rag`.
    *   Permite fazer perguntas e obter respostas baseadas em documentação específica da Defensoria.

## Observações Adicionais sobre Funcionalidades

*   **Solicitações (`/solicitacoes`):**
    *   Atualmente é uma página placeholder para um futuro formulário de cadastro de solicitações.
    *   Utiliza o menu lateral `menulateralminhadefensoria.png` (que direciona para `/minha-defensoria`) e o menu superior `menucadastro.png`.

## Evolução Arquitetural Principal

**Sistema de Chat:** O projeto evoluiu de um sistema de chat baseado em páginas individuais (`/chat/[pastaId]`) para um **sistema de chat global integrado** usando React Context API. Esta mudança fundamental permite:

*   Múltiplas conversas simultâneas em qualquer página
*   Modais flutuantes não-bloqueantes 
*   Persistência automática e gerenciamento de estado centralizado
*   Melhor experiência do usuário com notificações e controles avançados
*   Arquitetura mais escalável e reutilizável

A versão v4 da lista de pastas (`/listadepastas-v4`) serve como demonstração desta nova arquitetura, enquanto as versões anteriores mantêm compatibilidade com o sistema legado. 