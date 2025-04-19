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
    *   Copie e cole a estrutura básica abaixo no seu novo `page.js`. Ela já inclui a diretiva `"use client"`, os imports básicos do Mantine para o layout de duas colunas e a estrutura `Flex` com a imagem lateral e um placeholder para o conteúdo.
    *   **Importante:** Ajuste o nome da função (ex: `ProcessosPage`) e o conteúdo do placeholder (título e texto). Se precisar de ícones específicos para o título (como fizemos em Pastas), importe-os do `@tabler/icons-react`.
    *   **Nota:** Se a nova página for um formulário de **cadastro** ou similar, você provavelmente vai querer incluir a imagem estática do menu superior (`menucadastro.png`). O código para isso está comentado na seção "Imagem Superior Estática" abaixo; basta descomentá-lo e ajustar o `src` se necessário.

    ```jsx
    'use client';

    import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon } from '@mantine/core';
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
            <Box style={{ maxWidth: 250, height: '100%' }}>
              <Image
                  src="/menulateral.png"
                  alt="Menu Lateral"
                  height="70%"
                  fit="contain"
              />
            </Box>

            {/* Coluna Direita (Conteúdo da Nova Página) */}
            <Box style={{ flex: 1 }}>
              <Card shadow="sm" padding={0} radius="md" withBorder>
                {/* Box interno controla o padding do conteúdo */}
                <Box pt={0} px="lg" pb="lg"> {/* Padding: sem topo, com horizontal/inferior */}

                  {/* Imagem Superior Estática (OPCIONAL - DESCOMENTE PARA PÁGINAS DE CADASTRO) */}
                  {/*
                  <Image
                    src="/menucadastro.png" // <-- VERIFIQUE SE ESTE É O CAMINHO CORRETO
                    alt="Menu Superior"
                    width="100%"
                    mb="lg"
                  />
                  */}

                  {/* Título da Página (Exemplo com Ícone) */}
                  <Group align="center" mb="lg" bg="gray.1" p="sm">
                    <ThemeIcon variant="light" size="lg">
                       {/* Mude o ícone */}
                       {/* <IconScale stroke={1.5} /> */}
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
    *   Dentro do `<Box pt={0} px="lg" pb="lg">` na coluna da direita, substitua o `<Text>` placeholder pelo conteúdo real do seu protótipo, usando componentes Mantine conforme necessário. Adicione ou remova a imagem superior e ajuste o título/ícone.
    *   **Lembrete:** Se for uma página de cadastro, **descomente** a seção ` {/* Imagem Superior Estática ... */}` no código acima para incluir o menu fake do topo (`menucadastro.png`). Ajuste o `src` se o nome ou local da imagem for diferente.
    *   Ajuste o título/ícone.

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