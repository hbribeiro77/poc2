'use client';

import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon } from '@mantine/core';
import Link from 'next/link';
// Adicione imports de ícones específicos se necessário, ex:
// import { IconFilePlus } from '@tabler/icons-react'; // Exemplo de ícone

// Mude o nome da função para algo descritivo
export default function SolicitacoesPage() {
  // const theme = useMantineTheme(); // Descomentar se precisar do tema

  return (
    // Envolver com Fragmento para permitir o link "Voltar"
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

              {/* Imagem Superior Estática (DESCOMENTADO PARA PÁGINAS DE CADASTRO) */}
              <Image
                src="/menucadastro.png" // <-- VERIFIQUE SE ESTE É O CAMINHO CORRETO
                alt="Menu Superior"
                width="100%"
                mb="lg"
              />

              {/* Título da Página (Exemplo com Ícone) */}
              <Group align="center" mb="lg" bg="gray.1" p="sm">
                <ThemeIcon variant="light" size="lg">
                   {/* Mude o ícone - Usando um placeholder genérico por enquanto */}
                   {/* <IconFilePlus stroke={1.5} /> */ }
                   <Text>?</Text>
                </ThemeIcon>
                {/* Mude o Texto e a Cor */}
                <Text fw={500} size="xl" c="blue"> {/* Use uma cor do tema ou hex */}
                  Solicitações
                </Text>
              </Group>

              {/* Conteúdo Principal da Página (Placeholder) */}
              <Text>
                Formulário de cadastro de solicitações virá aqui...
              </Text>
              {/* Adicione aqui os componentes Mantine para sua funcionalidade */}

            </Box>
          </Card>
        </Box>

      </Flex>

      {/* Link discreto para voltar ao Hub */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>
    </>
  );
} 