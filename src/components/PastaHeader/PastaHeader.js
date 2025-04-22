'use client';

import React from 'react';
import {
  Box, Title, Text, Group, ThemeIcon, Paper,
  ActionIcon, Grid, Stack, SimpleGrid, UnstyledButton, useMantineTheme,
  Badge, Tooltip,
  Menu
} from '@mantine/core';
import {
  IconTrash, IconPlus, IconUser, IconMessageChatbot, IconFileText,
  IconLicense, IconFile, IconMessageCircle, IconScale, IconInfoCircle, IconChevronLeft,
  IconAlertTriangle,
  IconArchive, IconArchiveOff
} from '@tabler/icons-react';

// --- Componente interno PastaActionButton --- (Movido de page.js)
function PastaActionButton({ title, icon: Icon, count, alert }) {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      p="sm"
      style={{
        textAlign: 'left',
        width: '110px',
        height: '110px',
        border: `1px solid ${theme.colors.blue[3]}`, // Borda azul claro
        borderRadius: theme.radius.md,
        backgroundColor: theme.white,
        color: theme.colors.blue[6],
        position: 'relative',
        boxShadow: theme.shadows.xs,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        transition: 'background-color 0.15s ease',
        '&:hover': {
            backgroundColor: theme.colors.gray[0],
        },
      }}
    >
      {(count !== undefined || alert) && (
        <Box style={{ position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs, zIndex: 1 }}>
          {count !== undefined && !alert && (
              <Text size="xs" fw={500} c="blue.6">{count}</Text>
          )}
          {alert && (<IconAlertTriangle size={16} style={{ color: theme.colors.orange[6] }} />)}
        </Box>
      )}
      <Box style={{ width: 35, height: 35, display: 'flex', alignItems: 'center', marginBottom: theme.spacing.xs }}>
        <Icon size={30} />
      </Box>
      <Text size="xs" fw={500} ta="left" style={{ whiteSpace: 'normal' }}>{title}</Text>
    </UnstyledButton>
  );
}

// --- Componente Principal PastaHeader ---
export default function PastaHeader({ pastaData, onArchiveReasonSelected, onOpenReactivateConfirmModal }) {
  // Verifica se pastaData existe para evitar erros
  if (!pastaData) {
    return null; // Ou renderizar um estado de carregamento/vazio
  }

  const isAtiva = pastaData.status === 'Ativa';
  const archiveButtonLabel = isAtiva ? 'Arquivar Pasta' : 'Desarquivar Pasta';
  const ArchiveIcon = isAtiva ? IconArchive : IconArchiveOff;

  // Motivos de arquivamento
  const motivosArquivamento = [
    'Conclusão do Caso/Atendimento',
    'Perda de Contato com o Assistido',
    'Encaminhamento para Outro Órgão/Setor',
    'Arquivamento Administrativo'
  ];

  // Função para formatar a data/hora para o tooltip
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('pt-BR'); // Formato local brasileiro
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      {/* 1. Cabeçalho */}
      <Group justify="space-between" mb="md">
          <Group gap="xs">
              <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconChevronLeft />
              </ActionIcon>
              <Title order={3}>Pasta {pastaData.area}</Title>
          </Group>
        <Group>
          {/* Botão Arquivar/Reativar com Menu condicional */}
          {isAtiva ? (
            <Menu shadow="md" width={250} position="bottom-end" withArrow>
              <Menu.Target>
                <Tooltip label={archiveButtonLabel} withArrow position="bottom">
                  <ActionIcon
                    variant="default"
                    size="lg"
                    aria-label={archiveButtonLabel}
                  >
                    <ArchiveIcon stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Selecione o motivo do arquivamento</Menu.Label>
                <Menu.Divider />
                {motivosArquivamento.map((motivo) => (
                  <Menu.Item
                    key={motivo}
                    onClick={() => onArchiveReasonSelected(motivo)}
                  >
                    {motivo}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          ) : (
            // Se não estiver ativa, botão chama onOpenReactivateConfirmModal
            <Tooltip label={archiveButtonLabel} withArrow position="bottom">
              <ActionIcon
                variant="default"
                size="lg"
                aria-label={archiveButtonLabel}
                onClick={onOpenReactivateConfirmModal}
              >
                <ArchiveIcon stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}

          {/* Botões existentes */}
          <Tooltip label="Excluir Pasta" withArrow position="bottom">
            <ActionIcon variant="default" size="lg" aria-label="Excluir Pasta"><IconTrash stroke={1.5} /></ActionIcon>
          </Tooltip>
          <Tooltip label="Adicionar Novo Item" withArrow position="bottom">
            <ActionIcon variant="default" size="lg" aria-label="Adicionar"><IconPlus stroke={1.5} /></ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* 2. Bloco de Informações */}
      <Grid gutter="lg" mb="md">
          {/* Coluna Assistido */}
          <Grid.Col span={{ base: 12, md: 4 }}>
              <Group wrap="nowrap" align="flex-start">
              <ThemeIcon variant="light" size="lg" radius="xl"><IconUser stroke={1.5} /></ThemeIcon>
              <Stack gap={0}>
                  <Text fw={500} size="sm">{pastaData.assistido}</Text>
                  <Text size="xs" c="dimmed">Assistido</Text>
              </Stack>
              </Group>
          </Grid.Col>
            {/* Coluna Assunto/Status */}
          <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xs">
              <Group gap="xs"><Text size="xs" fw={700} w={70}>Assunto</Text><Text size="xs">{pastaData.assunto}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={70}>Descrição</Text><Text size="xs">{pastaData.descricao || '-'}</Text></Group>
              <Group gap="xs" align="center">
                <Text size="xs" fw={700} w={70}>Status</Text>
                <Tooltip
                  label={pastaData.lastStatusChangeAt ? `Última alteração por ${pastaData.lastStatusChangeBy || 'Desconhecido'} em ${formatTimestamp(pastaData.lastStatusChangeAt)}` : 'Status inicial'}
                  withArrow
                  position="bottom"
                  disabled={!pastaData.lastStatusChangeAt}
                >
                  <Badge color={pastaData.status === 'Ativa' ? 'green' : 'gray'} variant="light" size="sm" style={{ cursor: 'help' }}>
                    {pastaData.status}
                  </Badge>
                </Tooltip>
                {pastaData.status !== 'Ativa' && pastaData.motivoArquivamento && (
                  <Text size="xs" c="dimmed" ml={4}>
                    ({pastaData.motivoArquivamento})
                  </Text>
                )}
              </Group>
              </Stack>
          </Grid.Col>
          {/* Coluna Processo */}
          <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xs">
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Processo</Text><Text size="xs">{pastaData.processo}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Comarca</Text><Text size="xs">{pastaData.comarca}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Órgão Julgador</Text><Text size="xs">{pastaData.orgaoJulgador}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Classe</Text><Text size="xs">{pastaData.classe}</Text></Group>
              </Stack>
          </Grid.Col>
      </Grid>

      {/* 3. Barra de Ações com botões quadrados */}
      <Group mt="md" gap="sm" grow style={{ justifyContent: 'space-between'}} >
        <PastaActionButton title="Assistidos, parte adversa e qualificação" icon={IconUser} />
        <PastaActionButton title="Atendimentos" icon={IconMessageChatbot} count={pastaData.counts.atendimentos} />
        <PastaActionButton title="Peças e ofícios" icon={IconFileText} count={pastaData.counts.pecas} />
        <PastaActionButton title="Requisição de certidões" icon={IconLicense} />
        <PastaActionButton title="Documentos" icon={IconFile} count={pastaData.counts.documentos} />
        <PastaActionButton title="Observações" icon={IconMessageCircle} count={pastaData.counts.observacoes} />
        <PastaActionButton title="Processos" icon={IconScale} />
        <PastaActionButton title="Dados da pasta" icon={IconInfoCircle} />
      </Group>
    </Paper>
  );
} 