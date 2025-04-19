"use client"; // Necessário para usar hooks/componentes do Mantine que dependem do client

import { Title, Text, Container, SimpleGrid, Card, Button, Group, Space } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="md">
        Central de Protótipos
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Bem-vindo! Esta página serve como um hub central para acessar os diferentes protótipos de funcionalidades desenvolvidos neste projeto.
      </Text>

      <Title order={2} mb="lg">
        Protótipos Disponíveis:
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {/* Card para o protótipo de Notificações (Exemplo Inicial) */}
        {/* No futuro, adicionaremos mais cards aqui */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Notificações</Text>
            {/* Pode adicionar um Badge aqui se quiser */}
          </Group>

          <Text size="sm" c="dimmed">
            Protótipo de visualização de notificações do sistema.
          </Text>

          {/* O Link ainda não aponta para lugar nenhum, ajustaremos depois */}
          <Link href="/notificacoes">
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Acessar Protótipo
            </Button>
          </Link>
        </Card>

        {/* NOVO Card: Lista de Pastas */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Lista de Pastas</Text>
            {/* Pode adicionar um Badge aqui se quiser */}
          </Group>

          <Text size="sm" c="dimmed">
            Protótipo para visualização e gerenciamento de pastas.
          </Text>

          {/* Link para a nova rota /pastas */}
          <Link href="/pastas">
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Acessar Protótipo
            </Button>
          </Link>
        </Card>

        {/* NOVO Card: Solicitacoes */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Solicitações</Text>
          </Group>

          <Text size="sm" c="dimmed">
            Protótipo para cadastro de novas solicitações.
          </Text>

          {/* Link para a nova rota /solicitacoes */}
          <Link href="/solicitacoes">
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Acessar Protótipo
            </Button>
          </Link>
        </Card>

        {/* Adicionar mais <Card> aqui para futuros protótipos */}

      </SimpleGrid>

      <Space h="xl" />

      {/* Poderíamos adicionar uma seção sobre o projeto aqui ou links úteis */}

    </Container>
  );
}
