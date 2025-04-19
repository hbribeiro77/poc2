'use client';

import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Alert, Stack, Button } from '@mantine/core';
import { IconFolders, IconInfoCircle, IconFolderPlus } from '@tabler/icons-react';
import Link from 'next/link';
// Importar apenas os ícones necessários se houver algum elemento visual específico aqui,
// por enquanto, apenas a Image é usada na coluna esquerda.

export default function PastasPage() {
  // const theme = useMantineTheme(); // Descomentar se precisar do tema

  return (
    <>
      <Flex gap={0} pb="xl"> 

        {/* Coluna Esquerda (Imagem - igual à de Notificações) */}
        <Box style={{ maxWidth: 250, height: '100%' }}> 
          <Image
              src="/menulateral.png" 
              alt="Menu Lateral"
              height="70%"
              fit="contain"
          />
        </Box>

        {/* Coluna Direita (Conteúdo Pastas) */}
        <Box style={{ flex: 1 }}> 
          {/* Manter Card externo sem padding */}
          <Card shadow="sm" padding={0} radius="md" withBorder>
            {/* Box interno com padding ajustado (sem top padding) */}
            <Box pt={0} px="lg" pb="lg">
              {/* Adicionar Imagem do Menu Fake Acima */}
              <Image 
                src="/menucadastro.png"
                alt="Menu de Cadastro"
                width="100%" // Ocupar largura
                mb="lg" // Margem abaixo da imagem
              />

              {/* Título Pastas com fundo cinza */}
              <Group align="center" mb="lg" bg="gray.1" p="sm">
                <ThemeIcon variant="light" size="lg">
                    <IconFolders stroke={1.5} />
                </ThemeIcon>
                <Text fw={500} size="xl" c="#1c7ed6">Pastas</Text>
              </Group>
              
              {/* Conteúdo novo baseado na imagem */}
              <Stack>
                  <Alert 
                    variant="light" 
                    color="blue" 
                    title="Nenhum resultado encontrado." 
                    icon={<IconInfoCircle />}
                  >
                    A pessoa não possui pastas como Assistido
                  </Alert>

                  {/* Botão Nova Pasta alinhado à direita */}
                  <Group justify="flex-end">
                    <Button leftSection={<IconFolderPlus size={18} />}>
                      Nova pasta
                    </Button>
                  </Group>

                  <Alert 
                    variant="light" 
                    color="blue" 
                    title="Nenhum resultado encontrado." 
                    icon={<IconInfoCircle />}
                  >
                    A pessoa não possui pastas como Parte Adversa
                  </Alert>
              </Stack>

              {/* Remover texto placeholder antigo */}
              {/* 
              <Text>
                Conteúdo da página de listagem de pastas virá aqui...
              </Text>
              */}
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