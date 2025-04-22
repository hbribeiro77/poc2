"use client"; // Necessário para usar hooks/componentes do Mantine que dependem do client

import { Title, Text, Container, Card, Button, Group, Space, Grid } from '@mantine/core';
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

      <Grid gutter="lg">
        {/* Card para o protótipo de Notificações (Exemplo Inicial) */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Notificações</Text>
              {/* Pode adicionar um Badge aqui se quiser */}
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Protótipo de visualização de notificações do sistema.
            </Text>

            {/* O Link ainda não aponta para lugar nenhum, ajustaremos depois */}
            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/notificacoes"
            >
              Acessar Protótipo
            </Button>
          </Card>
        </Grid.Col>

        {/* NOVO Card: Lista de Pastas */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Lista de Pastas</Text>
              {/* Pode adicionar um Badge aqui se quiser */}
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Protótipo para visualização e gerenciamento de pastas.
            </Text>

            {/* Link para a nova rota /listadepastas */}
            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/listadepastas"
            >
              Acessar Protótipo
            </Button>
          </Card>
        </Grid.Col>

        {/* NOVO Card: Solicitacoes */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Solicitações</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Protótipo para cadastro de novas solicitações.
            </Text>

            {/* Link para a nova rota /solicitacoes */}
            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/solicitacoes"
            >
              Acessar Protótipo
            </Button>
          </Card>
        </Grid.Col>

        {/* Card Documentos - Corrigido e Adicionado */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            {/* <Card.Section>
              Você pode adicionar uma imagem representativa aqui se desejar
              <Image src="/path/to/documentos_icon.png" height={160} alt="Documentos" />
            </Card.Section> */}

            <Group justify="space-between" mt="md" mb="xs">
              {/* Usando Title aqui para consistência, pode ser Text se preferir */}
              <Title order={5}>Documentos</Title>
              {/* <Badge color="blue" variant="light">
                Novo
              </Badge> */}
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Acessar a seção de gerenciamento de documentos.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/documentos"
            >
              Acessar Documentos
            </Button>
          </Card>
        </Grid.Col>

        {/* Card Pasta */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Title order={5}>Pasta</Title> { /* Título Singular */}
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Acessar a seção de visualização de pasta individual.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto" // Alinha o botão na parte inferior
              radius="md"
              component={Link}
              href="/pasta" // <<< Link para /pasta (singular)
            >
              Acessar Pasta
            </Button>
          </Card>
        </Grid.Col>

      </Grid>

      <Space h="xl" />

      {/* Poderíamos adicionar uma seção sobre o projeto aqui ou links úteis */}

    </Container>
  );
}
