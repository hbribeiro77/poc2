import React from 'react';
import { Modal, Box, Group, Text, Stack, Paper, Badge, Button, Divider, ActionIcon, ScrollArea } from '@mantine/core';
import { IconBrandWhatsapp, IconX, IconClock, IconFolder, IconUser } from '@tabler/icons-react';

const conversasMockadas = [
  {
    id: 1,
    nome: "Olivia Palito",
    processo: "#20250087",
    descricao: "Ação de guarda",
    status: "Assistido aguarda resposta",
    statusColor: "red",
    prazo: "4 horas",
    prazoColor: "red"
  },
  {
    id: 2,
    nome: "Bruce Banner",
    processo: "#202500088",
    descricao: "Regulamentação de Dano Colateral",
    status: "Aguardando resposta do Assistido",
    statusColor: "teal",
    prazo: "5 horas",
    prazoColor: "orange"
  },
  {
    id: 3,
    nome: "Natasha Romanoff",
    processo: "#20250089",
    descricao: "Solicitação de Nova Identidade e Proteção",
    status: "Aguardando resposta do Assistido",
    statusColor: "teal",
    prazo: "16 horas",
    prazoColor: "green"
  },
  {
    id: 4,
    nome: "Jessica Jones",
    processo: "#20250087",
    descricao: "Denúncia de Assédio e Perseguição",
    status: "Aguardando resposta do Assistido",
    statusColor: "teal",
    prazo: "24 horas",
    prazoColor: "green"
  },
  {
    id: 5,
    nome: "Wilson Fisk",
    processo: "#20250087",
    descricao: "Recurso contra Bloqueio de Ativos Financeiros",
    status: "Aguardando resposta do Assistido",
    statusColor: "teal",
    prazo: "24 horas",
    prazoColor: "green"
  }
];

export default function ConversasAtivasModal({ opened, onClose, pastaAtual }) {
  
  // Criar a conversa da Martha Wayne baseada nos dados da pasta atual
  const conversaMartha = pastaAtual ? {
    id: 'martha',
    nome: "Martha Wayne",
    processo: pastaAtual.processoPrincipal || "#20250087",
    descricao: pastaAtual.area || "Atendimento jurídico",
    status: "Aguardando resposta do Assistido",
    statusColor: "teal",
    prazo: "2 horas",
    prazoColor: "orange"
  } : {
    id: 'martha',
    nome: "Martha Wayne",
    processo: "#20250087",
    descricao: "Atendimento jurídico",
    status: "Aguardando resposta do Assistido",
    statusColor: "teal",
    prazo: "2 horas",
    prazoColor: "orange"
  };

  // Combinar Martha Wayne como primeira da lista
  const todasConversas = [conversaMartha, ...conversasMockadas];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group align="center" gap="sm">
          <IconBrandWhatsapp size={20} color="green" />
          <Text fw={600} size="lg">Conversas Ativas</Text>
        </Group>
      }
      size="xl"
      centered
      scrollAreaComponent={ScrollArea.Autosize}
      styles={{
        header: {
          backgroundColor: '#2c2c2c',
          color: 'white',
          padding: '1rem 1.5rem'
        },
        title: {
          color: 'white',
          fontWeight: 600
        },
        close: {
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        },
        body: {
          maxHeight: '70vh',
          overflow: 'auto'
        }
      }}
    >
      <Box p="md">
        {/* Cabeçalho com data */}
        <Text ta="center" size="sm" c="dimmed" fw={500} mb="lg">
          DEFENSORIA PÚBLICA DE PORTO ALEGRE - 16/06/2025
        </Text>

        {/* Lista de conversas */}
        <Stack gap="md">
          {todasConversas.map((conversa) => (
            <Paper 
              key={conversa.id} 
              p="md" 
              withBorder 
              radius="md" 
              style={{ backgroundColor: '#f9f9f9' }}
            >
              <Stack gap="sm">
                {/* Status */}
                <Badge 
                  color={conversa.statusColor} 
                  variant="light" 
                  size="sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  {conversa.status}
                </Badge>

                {/* Nome do assistido */}
                <Group align="center" gap="xs">
                  <IconUser size={16} color="#666" />
                  <Text fw={600} size="md">{conversa.nome}</Text>
                  <Group ml="auto">
                    <Button 
                      variant="subtle" 
                      size="xs" 
                      color="green"
                      leftSection={<IconBrandWhatsapp size={14} />}
                      style={{ fontSize: '11px' }}
                    >
                      Visualizar conversa
                    </Button>
                  </Group>
                </Group>

                {/* Processo */}
                <Group align="center" gap="xs">
                  <IconFolder size={16} color="#666" />
                  <Text size="sm" c="dimmed">
                    <Text span fw={500}>{conversa.processo}</Text> {conversa.descricao}
                  </Text>
                </Group>

                {/* Prazo */}
                <Group align="center" gap="xs">
                  <IconClock size={16} color="#666" />
                  <Text size="sm" c="dimmed">
                    Prazo para encerrar essa conversação: 
                    <Text span fw={500} c={conversa.prazoColor}> {conversa.prazo}</Text>
                  </Text>
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* Histórico de conversas */}
        <Divider my="lg" />
        <Group justify="center">
          <Button 
            variant="subtle" 
            color="blue" 
            size="sm"
            style={{ textDecoration: 'none' }}
          >
            Histórico de Conversas
          </Button>
        </Group>
      </Box>
    </Modal>
  );
} 