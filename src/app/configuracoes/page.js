'use client';

import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Button } from '@mantine/core';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react'; // Ícone para Configurações

export default function ConfiguracoesPage() {
  return (
    <>
      <Flex gap={0} pb="xl">
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image
            src="/menulateral.png"
            alt="Menu Lateral"
            height="70%"
            fit="contain"
          />
        </Box>

        <Box style={{ flex: 1 }}>
          <Card shadow="sm" padding={0} radius="md" withBorder>
            <Box pt={0} px="lg" pb="lg">
              <Group justify="space-between" align="center" mb="xl">
                <Title order={2} style={{ display: 'flex', alignItems: 'center' }}>
                  <IconSettings size={28} style={{ marginRight: 'var(--mantine-spacing-xs)' }} />
                  Configurações
                </Title>
              </Group>

              <Text>
                Opções de configuração do sistema e preferências do usuário virão aqui.
              </Text>
              {/* Adicionar componentes Mantine para as configurações */}

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