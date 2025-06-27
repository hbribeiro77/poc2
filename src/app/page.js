"use client"; // Necessário para usar hooks/componentes do Mantine que dependem do client

import React, { useState } from 'react';
import { Title, Text, Container, Card, Button, Group, Space, Grid, NumberInput } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [folderCount, setFolderCount] = useState(10);

  const handleNavigateToGeneratedList = () => {
    if (folderCount > 0) {
      router.push(`/listadepastas?generate=${folderCount}`);
    }
  };

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

        {/* NOVO Card: Lista de Pastas V2 */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Lista de Pastas V2</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Cópia da lista de pastas para novos desenvolvimentos.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/listadepastas-v2"
            >
              Acessar Protótipo V2
            </Button>
          </Card>
        </Grid.Col>

        {/* NOVO Card: Lista de Pastas V3 */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Lista de Pastas V3</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Cópia da lista de pastas v2 para novos desenvolvimentos.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/listadepastas-v3"
            >
              Acessar Protótipo V3
            </Button>
          </Card>
        </Grid.Col>

        {/* NOVO Card: Lista de Pastas V4 */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Lista de Pastas V4</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Cópia da lista de pastas v3 para novos desenvolvimentos.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/listadepastas-v4"
            >
              Acessar Protótipo V4
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

        {/* Card para Minha Defensoria */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Minha Defensoria</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Acessar a página Minha Defensoria (apenas menu lateral).
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/minha-defensoria"
            >
              Acessar Página
            </Button>
          </Card>
        </Grid.Col>

        {/* Card para Galeria de Componentes */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Galeria de Componentes</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Visualizar os componentes de UI reutilizáveis disponíveis no projeto.
            </Text>

            <Button
              variant="light"
              color="teal"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/componentes"
            >
              Acessar Galeria
            </Button>
          </Card>
        </Grid.Col>

        {/* Card para Controle da Lista de Pastas */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" display="flex" style={{ flexDirection: 'column' }}>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Gerar Lista de Pastas</Text>
            </Group>

            <Text size="sm" c="dimmed">
              Gere e acesse uma lista com uma quantidade específica de pastas (dados fictícios).
            </Text>

            <NumberInput
              label="Quantidade a Gerar"
              placeholder="Digite a quantidade"
              value={folderCount}
              onChange={(value) => setFolderCount(Number(value) || 0)}
              min={1}
              step={1}
              mt="md"
              mb="md"
            />

            <Button
              variant="light"
              color="teal"
              fullWidth
              mt="auto"
              radius="md"
              onClick={handleNavigateToGeneratedList}
              disabled={folderCount <= 0}
            >
              Ver Lista Gerada
            </Button>
          </Card>
        </Grid.Col>

        {/* NOVO Card: Configurações */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Configurações</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Acessar as configurações do sistema e preferências.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/configuracoes"
            >
              Acessar Configurações
            </Button>
          </Card>
        </Grid.Col>

        {/* NOVO Card: Contatos */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Contatos</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Acessar a seção de gerenciamento de contatos.
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/contatos"
            >
              Acessar Contatos
            </Button>
          </Card>
        </Grid.Col>

        {/* Card Pasta v2 */}
        <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mt="md" mb="xs">
              <Title order={5}>Pasta v2</Title>
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              Protótipo alternativo para visualização de pasta individual (nova versão).
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              component={Link}
              href="/pasta-v2"
            >
              Acessar Pasta v2
            </Button>
          </Card>
        </Grid.Col>

      </Grid>

      <Space h="xl" />

      {/* Poderíamos adicionar uma seção sobre o projeto aqui ou links úteis */}

    </Container>
  );
}
