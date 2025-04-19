# Resumo do Projeto: poc2 (Protótipos Defensoria)

## Objetivo

Este projeto serve como uma Prova de Conceito (PoC) para desenvolver e testar protótipos de funcionalidades específicas, recriando interfaces de usuário semelhantes às do sistema da Defensoria, utilizando tecnologias web modernas.

## Tecnologias Utilizadas

*   **Framework:** Next.js (v15+) com App Router
*   **Linguagem:** JavaScript (React)
*   **UI Library:** Mantine UI (v7)
*   **Ícones:** Tabler Icons
*   **Testes:** Jest e React Testing Library

## Estrutura do Projeto (Arquivos Relevantes)

```diff
 poc2/
 ├── public/
 │   ├── menulateral.png    # Imagem do menu lateral estático
 │   └── menucadastro.png   # Imagem do menu superior estático (página Pastas)
+│   └── ... (outros arquivos como SVGs)
 ├── src/
 │   └── app/
 │       ├── layout.js       # Layout raiz (contém MantineProvider)
 │       ├── page.js         # Página principal (Hub de Protótipos)
 │       ├── page.test.js    # Teste para a página principal (Hub)
+│       ├── globals.css     # Estilos globais (pode incluir imports do Mantine)
+│       ├── favicon.ico     # Ícone da aba do navegador
 │       ├── notificacoes/
 │       │   └── page.js     # Componente da página de Notificações
 │       └── pastas/
 │           └── page.js     # Componente da página de Pastas
+├── .git/               # Repositório Git
+├── .next/              # Cache e build do Next.js
+├── .swc/               # Cache do compilador SWC
+├── node_modules/       # Dependências do projeto
+├── .gitignore          # Arquivos ignorados pelo Git
+├── eslint.config.mjs   # (Ou .eslintrc.js/json) Configuração do ESLint
 ├── package.json        # Dependências e scripts do projeto
+├── package-lock.json   # Lockfile das dependências
 ├── next.config.mjs     # Configuração do Next.js
-├── postcss.config.js   # Configuração do PostCSS (usado pelo Mantine)
+├── postcss.config.mjs  # (Ou .js) Configuração do PostCSS (usado pelo Mantine)
 ├── jest.config.js      # Configuração do Jest
 ├── jest.setup.js       # Arquivo de setup do Jest (importa jest-dom)
+├── jsconfig.json       # (Ou tsconfig.json) Configuração do JS/TS
+├── README.md           # Arquivo README principal
 └── resumo.md           # Este arquivo de resumo
```

## Funcionalidades Implementadas (Protótipos)

1.  **Hub Central (`/`)**
    *   Página inicial que lista os protótipos disponíveis.
    *   Atualmente lista "Notificações" e "Lista de Pastas" usando Cards.

2.  **Notificações (`/notificacoes`)**
    *   Exibe uma lista de notificações (com dados de exemplo).
    *   Inclui funcionalidades simuladas como paginação e ocultar/desocultar.
    *   Apresenta um layout de duas colunas usando `Flexbox`:
        *   Coluna esquerda: Exibe a imagem estática `menulateral.png`.
        *   Coluna direita: Exibe o conteúdo principal das notificações dentro de um `Card`.
    *   Inclui um link "Voltar para a Central" na parte inferior.

3.  **Pastas (`/pastas`)**
    *   Página para (futuramente) listar e gerenciar pastas.
    *   Apresenta o mesmo layout `Flexbox` de duas colunas da página de notificações.
    *   Coluna direita contém:
        *   Uma imagem estática superior (`menucadastro.png`).
        *   Um título "Pastas" com ícone e fundo cinza claro.
        *   Alertas de exemplo indicando "Nenhum resultado encontrado".
        *   Um botão "Nova pasta".
    *   Inclui um link "Voltar para a Central" na parte inferior.

## Abordagem de Layout

*   O `layout.js` raiz é mínimo, apenas configurando o `MantineProvider`.
*   As páginas `/notificacoes` e `/pastas` implementam seu próprio layout de duas colunas usando `Flexbox`.
*   O "menu lateral" nessas páginas é atualmente uma imagem estática (`menulateral.png`) colocada na coluna esquerda, sem funcionalidade interativa. O espaçamento entre a imagem e o conteúdo principal foi minimizado.

## Testes

*   Configuração básica de testes com Jest e React Testing Library está implementada.
*   Existe um teste unitário para a página do Hub (`/`) que verifica a renderização do título principal.
*   **Processo:** Após modificações em arquivos com testes associados, o teste deve ser executado manually (`npm test`) e o resultado confirmado antes de considerar a tarefa concluída. 