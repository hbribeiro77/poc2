'use client';

import React from 'react'; // Import React se não estiver global
import {
  Container,
  Stack,
  Text,
  ActionIcon,
  Group,
  UnstyledButton,
  Box,
  useMantineTheme,
  Anchor,
} from '@mantine/core';
import {
  IconClipboardCopy,
  IconPhone,
  IconPlus,
  IconChevronDown,
  IconFiles,
  IconUser,
  IconFileDescription,
  IconHome,
  IconAddressBook,
  IconAlertTriangle,
  IconCalendarEvent,
  IconFolders,
  IconArrowsDoubleSwNe,
  IconChecklist,
} from '@tabler/icons-react';
// Importar o CSS Module do componente
import classes from './CadastroHeader.module.css';

// --- Componente SquareMenuButton (interno) ---
function SquareMenuButton({
  title,
  icon: Icon,
  count,
  alert,
  active,
  isTopButton = false,
  dropdownIcon = false,
  ...props
}) {
  const theme = useMantineTheme();
  const isBlue = active || isTopButton;
  // Usa as classes do CadastroHeader.module.css
  const buttonClassName = `${classes.squareButton} ${isBlue ? classes.squareButtonActive : ''}`;

  return (
    <UnstyledButton className={buttonClassName} p="sm" {...props}>
      {(count !== undefined || alert || dropdownIcon) && (
        <Box style={{ position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs, zIndex: 1 }}>
          {count !== undefined && !alert && !dropdownIcon && (<Text size="xs" fw={500} className={classes.indicatorText}>{count}</Text>)}
          {alert && !dropdownIcon && (<IconAlertTriangle size={16} className={classes.alertIcon} />)}
          {dropdownIcon && (<IconChevronDown size={16} className={classes.dropdownIcon} />)}
        </Box>
      )}
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: theme.spacing.xs, width: '100%' }}>
        <Box style={{ width: 35, height: 35, display: 'flex', alignItems: 'center' }}>
          <Icon size={30} />
        </Box>
        <Text size="xs" fw={500} ta="left">{title}</Text>
      </Box>
    </UnstyledButton>
  );
}

// --- Componente Principal CadastroHeader ---
export default function CadastroHeader({ assistidoData, activeButtonTitle }) {
  const theme = useMantineTheme();

  // Verifica se assistidoData existe para evitar erros
  if (!assistidoData) {
    return null; // Ou renderizar um estado de carregamento/vazio
  }

  return (
    // Usar o Container aqui garante o size="lg" e padding
    <Container size="lg" p="md">
      {/* O Box aplica o layout CSS Grid definido no .module.css */}
      <Box className={classes.mainGridContainer}>
        {/* Item 1: Bloco de Informações */}
        <Stack gap="xs" align="flex-start" style={{ gridColumn: '1' }}>
          <Box>
            <Text size="sm" c="dimmed">Nome registral: {assistidoData.nomeRegistral}</Text>
            <Text size="xl" fw={500} c={theme.primaryColor}>{assistidoData.nomeSocial}</Text>
            <Group gap={4}>
              <Text size="sm">{assistidoData.telefone}</Text>
              <ActionIcon variant="subtle" size="sm" aria-label="Copiar telefone">
                <IconClipboardCopy size={16} />
              </ActionIcon>
            </Group>
          </Box>
          <Group justify="flex-start" mt="sm">
            <Anchor href="#" size="sm" underline="hover">Voltar à pesquisa</Anchor>
          </Group>
        </Stack>

        {/* Item 2: Menu Rápido */}
        {/* Este Group é filho direto do .mainGridContainer e é posicionado na coluna 2 */}
        <Group gap="sm" justify="flex-end" wrap="nowrap" style={{ gridColumn: '2', justifySelf: 'end' }}>
          <SquareMenuButton title="Atendimento Rápido" icon={IconPhone} isTopButton />
          <SquareMenuButton title="Adicionar tarefa" icon={IconPlus} isTopButton />
          <SquareMenuButton title="Atestados e Declarações" icon={IconFiles} isTopButton dropdownIcon />
        </Group>

        {/* Item 3: Menu Principal */}
        {/* Este Box é filho direto do .mainGridContainer e ocupa as colunas 1 a -1 */}
        <Box className={classes.bottomButtonsGroupContainer}>
          {/* Os SquareMenuButtons são filhos diretos do grid definido por .bottomButtonsGroupContainer */}
          <SquareMenuButton title="Dados Pessoais" icon={IconUser} active={activeButtonTitle === 'Dados Pessoais'} />
          <SquareMenuButton title="Documentos" icon={IconFileDescription} count={assistidoData.contagem.documentos} active={activeButtonTitle === 'Documentos'} />
          <SquareMenuButton title="Endereços" icon={IconHome} count={assistidoData.contagem.enderecos} active={activeButtonTitle === 'Endereços'} />
          <SquareMenuButton title="Contatos" icon={IconAddressBook} count={assistidoData.contagem.contatos} active={activeButtonTitle === 'Contatos'} />
          <SquareMenuButton title="Observações" icon={IconAlertTriangle} count={assistidoData.contagem.observacoes} active={activeButtonTitle === 'Observações'} />
          <SquareMenuButton title="Agendamentos" icon={IconCalendarEvent} count={assistidoData.contagem.agendamentos} active={activeButtonTitle === 'Agendamentos'} />
          <SquareMenuButton title="Pastas" icon={IconFolders} count={assistidoData.contagem.pastas} active={activeButtonTitle === 'Pastas'} />
          <SquareMenuButton title="Solicitações" icon={IconArrowsDoubleSwNe} alert={assistidoData.contagem.solicitacoes} active={activeButtonTitle === 'Solicitações'} />
          <SquareMenuButton title="Tarefas" icon={IconChecklist} count={assistidoData.contagem.tarefas} active={activeButtonTitle === 'Tarefas'} />
        </Box>
      </Box>
    </Container>
  );
} 