# Guia: Como Criar uma Nova Página de Protótipo

Este guia descreve os passos para adicionar uma nova página de protótipo (funcionalidade) a este projeto, seguindo os padrões estabelecidos.

**Exemplo:** Vamos supor que queremos criar uma nova página para "Consulta de Processos" na rota `/processos`.

## Passos

1.  **Criar o Diretório da Rota:**
    *   Dentro de `src/app/`, crie um novo diretório com o nome da rota desejada (em minúsculas).
    *   Exemplo: `src/app/processos/`

2.  **Criar o Arquivo da Página (`page.js`):**
    *   Dentro do novo diretório (ex: `src/app/processos/`), crie um arquivo chamado `page.js`.

3.  **Estrutura Básica da Página (`page.js`):**
    *   Copie e cole a estrutura básica abaixo no seu novo `page.js`. Ela já inclui a diretiva `"use client"`, os imports básicos do Mantine para o layout de duas colunas e a estrutura `Flex` com a imagem lateral.
    *   A coluna da direita agora usa um `Card` que envolve um `Box` interno para controlar o padding, similar às páginas `/solicitacoes` e `/documentos`.
    *   **Importante:** Ajuste o nome da função (ex: `ProcessosPage`) e o conteúdo (título e texto). Se precisar de ícones específicos para o título, importe-os do `@tabler/icons-react`.
    *   **Nota:** Se a nova página for um formulário de **cadastro** ou similar, você provavelmente vai querer incluir a imagem estática do menu superior (`menucadastro.png`). O código para isso está comentado na seção "Imagem Superior Estática" abaixo; basta descomentá-lo.

    ```jsx
    'use client';

    import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon } from '@mantine/core';
    import Link from 'next/link';
    // Adicione imports de ícones específicos se necessário, ex:
    // import { IconScale } from '@tabler/icons-react';

    // Mude o nome da função para algo descritivo
    export default function NovaPaginaPage() {
      // const theme = useMantineTheme(); // Descomentar se precisar do tema

      return (
        // Envolver com Fragmento para permitir o link "Voltar" (Passo 6)
        <>
          <Flex gap={0} pb="xl"> {/* pb="xl" para dar espaço para o link "Voltar" */}

            {/* Coluna Esquerda (Imagem Lateral Estática) */}
            <Box style={{ maxWidth: 250, height: '100%' }}> {/* Ajustado height para 100% como em solicitacoes */}
              <Image
                  src="/menulateral.png"
                  alt="Menu Lateral"
                  height="70%" {/* Mantido height 70% como no exemplo original, pode ajustar se necessário */}
                  fit="contain"
              />
            </Box>

            {/* Coluna Direita (Conteúdo da Nova Página) */}
            <Box style={{ flex: 1 }}>
              {/* Card envolve todo o conteúdo da coluna direita */}
              <Card shadow="sm" padding={0} radius="md" withBorder>
                {/* Box interno controla o padding do conteúdo */}
                <Box pt={0} px="lg" pb="lg"> {/* Padding: sem topo, com horizontal/inferior */}

                  {/* Imagem Superior Estática (OPCIONAL - DESCOMENTE PARA PÁGINAS DE CADASTRO) */}
                  {/* Verifique se esta é a posição correta conforme /solicitacoes */}
                  {/*
                  <Image
                    src="/menucadastro.png"
                    alt="Menu Superior"
                    width="100%"
                    mb="lg" // Margem inferior para separar do título
                  />
                  */}

                  {/* Título da Página (Estrutura com Group/ThemeIcon/Text) */}
                  <Group align="center" mb="lg" bg="gray.1" p="sm">
                    <ThemeIcon variant="light" size="lg">
                       {/* Mude o ícone - Usando um placeholder genérico */}
                       <Text>?</Text>
                    </ThemeIcon>
                    {/* Mude o Texto e a Cor */}
                    <Text fw={500} size="xl" c="blue"> {/* Use uma cor do tema ou hex */}
                      Título da Nova Página
                    </Text>
                  </Group>

                  {/* Conteúdo Principal da Página (Placeholder) */}
                  <Text>
                    Conteúdo do protótipo virá aqui...
                  </Text>
                  {/* Adicione aqui os componentes Mantine para sua funcionalidade */}

                </Box>
              </Card>
            </Box>

          </Flex>

          {/* Link para voltar ao Hub (Passo 6) */}
          {/* Será adicionado no Passo 6 */}
        </>
      );
    }
    ```

4.  **Adicionar Conteúdo Específico:**
    *   Dentro do `<Box pt={0} px="lg" pb="lg">` na coluna da direita, substitua o `<Text>` placeholder pelo conteúdo real do seu protótipo.
    *   Se for uma página de cadastro, **descomente** a seção ` {/* Imagem Superior Estática ... */}` no código acima para incluir o menu `menucadastro.png`. Certifique-se de que a posição dela (antes do `<Group>` do título) está correta.
    *   Ajuste o título/ícone/cor no `<Group>` do título.

5.  **Adicionar Card no Hub (`src/app/page.js`):**
    *   Abra o arquivo `src/app/page.js`.
    *   Localize o componente `<SimpleGrid>`.
    *   Copie um dos `<Card>` existentes (ex: o de "Lista de Pastas").
    *   Cole o card copiado dentro do `<SimpleGrid>`.
    *   Modifique o **título** (`<Text fw={500}>`) e a **descrição** (`<Text size="sm" c="dimmed">`) do novo card.
    *   Atualize o `href` dentro do componente `<Link>` para apontar para a nova rota (ex: `href="/processos"`).

    ```jsx
    // Dentro de <SimpleGrid> em src/app/page.js

    {/* Exemplo: NOVO Card para Consulta de Processos */}
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        {/* Mude o título */}
        <Text fw={500}>Consulta de Processos</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {/* Mude a descrição */}
        Protótipo para consultar informações de processos.
      </Text>

      {/* Mude o href */}
      <Link href="/processos">
        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Acessar Protótipo
        </Button>
      </Link>
    </Card>
    ```

6.  **Adicionar Link "Voltar" (Opcional, mas recomendado):**
    *   Volte ao arquivo `page.js` da sua nova página (ex: `src/app/processos/page.js`).
    *   Certifique-se de que `import Link from 'next/link';` e `Group`, `Text` do `@mantine/core` estão presentes.
    *   Adicione o seguinte bloco de código **após** o fechamento da tag `<Flex>` principal, mas **dentro** do Fragmento `<>...</>`:

    ```jsx
      {/* Link discreto para voltar ao Hub */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>
    ```

7.  **Testar:**
    *   Navegue até o Hub (`/`) e verifique se o novo card aparece e o link funciona.
    *   Acesse a nova rota (ex: `/processos`) e verifique se a página carrega com o layout e conteúdo esperados.
    *   **Importante:** Rode `npm test` para garantir que a adição do card no Hub não quebrou os testes existentes da página principal.

Pronto! Seguindo esses passos, você pode adicionar novas páginas de protótipo mantendo a estrutura e o estilo do projeto.

### Exemplos Criados

Seguindo estes passos, foram criadas as páginas:

*   `/notificacoes` (exemplo inicial)
*   `/listadepastas` (página em branco -> com conteúdo)
*   `/solicitacoes` (com imagem de menu)
*   `/documentos` (com imagem de menu -> com CadastroHeader)
*   `/pasta` (template padrão sem header de cadastro) 