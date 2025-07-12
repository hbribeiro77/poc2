'use client';

import React, { useState } from 'react';
import { Paper, Group, Text, Badge, ActionIcon, Stack, Title, Box, useMantineTheme, Radio, Textarea } from '@mantine/core';
import { IconFolder, IconPlus, IconArrowDown, IconArchive, IconArchiveOff, IconBrandWhatsapp } from '@tabler/icons-react';
import ModalConfirmacaoAssustadora from '../ConfirmActionModal/ModalConfirmacaoAssustadora'; // Importar o modal

export default function PastaListItem({ pasta, onUnarchive, onChatClick, onArchiveClick, onStartChat, onCustomWhatsappClick, chatBehavior = "modal" }) {
  const [expanded, setExpanded] = useState(false);
  const [unarchiveModalOpened, setUnarchiveModalOpened] = useState(false);
  const theme = useMantineTheme();

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const hasReuPreso = pasta.tags && pasta.tags.includes('Réu preso');
  
  let borderLeftColor;
  if (pasta.status === 'Arquivada') {
    borderLeftColor = '#7d7d7d';
  } else {
    borderLeftColor = hasReuPreso ? theme.colors.yellow[6] : '#1b7847';
  }

  const paperStyle = {
    borderLeft: `5px solid ${borderLeftColor}`,
    transition: 'all 0.2s ease',
  };

  const openUnarchiveModal = () => setUnarchiveModalOpened(true);
  const closeUnarchiveModal = () => setUnarchiveModalOpened(false);

  const handleConfirmUnarchive = () => {
    onUnarchive(pasta.id);
    closeUnarchiveModal();
  };
  
  const handleArchiveIconClick = () => {
    if (pasta.status === 'Arquivada') {
      openUnarchiveModal();
    } else {
      if (onArchiveClick) {
        onArchiveClick(pasta.id);
      }
    }
  };

  const handleWhatsappClick = () => {
    if (onChatClick) {
      // Comportamento da v4: usar função de callback (modal)
      onChatClick(pasta);
    } else if (onStartChat) {
      // Comportamento da v2: abrir painel lateral
      onStartChat();
    } else if (chatBehavior === "custom" && onCustomWhatsappClick) {
      // Comportamento customizado da v3: usar função personalizada
      onCustomWhatsappClick(pasta);
    } else if (chatBehavior === "newTab") {
      // Comportamento da v1-v3: salvar dados e abrir nova aba
      try {
        // Salva os dados da pasta no localStorage para a página de chat acessar
        localStorage.setItem(`chatPastaData-${pasta.id}`, JSON.stringify(pasta));
        
        // Abre nova aba com a página de chat
        window.open(`/chat/${pasta.id}`, '_blank');
      } catch (error) {
        console.error('Erro ao abrir chat em nova aba:', error);
      }
    }
  };

  const handleWhatsappMiddleClick = () => {
    try {
      // Salva os dados da pasta no localStorage para a página de chat acessar
      localStorage.setItem(`chatPastaData-${pasta.id}`, JSON.stringify(pasta));
      
      // Abre nova aba com a página de chat (igual na v3)
      window.open(`/chat/${pasta.id}`, '_blank');
    } catch (error) {
      console.error('Erro ao abrir chat em nova aba:', error);
    }
  };

  const handleWhatsappMouseDown = (event) => {
    if (event.button === 1) { // Botão do meio
      event.preventDefault(); // Previne comportamento padrão
      handleWhatsappMiddleClick();
    }
  };

  const motivosArquivamento = [
    'Trânsito em Julgado / Cumprimento de Sentença Finalizado',
    'Acordo Homologado Judicialmente',
    'Desistência da Ação / Extinção do Processo',
    'Remessa para Outro Juízo / Declínio de Competência'
  ];

  return (
    <Paper p="md" radius="md" shadow="xs" style={paperStyle}>
      {/* Cabeçalho da Pasta */}
      <Group justify="space-between" mb="md">
        <Group gap="xs" align="center">
          <IconFolder size={20} color="var(--mantine-color-gray-7)"/>
          <Badge color="blue" variant="light" size="sm">ASSISTIDO</Badge>
          {hasReuPreso && (
            <Badge color="orange" variant="filled" size="sm">RÉU PRESO</Badge>
          )}
        </Group>
        <Group gap="xs" align="center"> 
          <Badge 
              color={pasta.status === 'Ativa' ? 'green' : 'gray'} 
              variant="light" 
              size="sm"
            >
              {pasta.status}
          </Badge>
           <Text size="sm" fw={500}>Ações:</Text>
           <ActionIcon variant="subtle" color="gray">
              <IconPlus size={16} />
           </ActionIcon>
           <ActionIcon 
             variant="subtle" 
             color="green" 
             onClick={handleWhatsappClick}
             onMouseDown={handleWhatsappMouseDown}
             onAuxClick={handleWhatsappMiddleClick}
             title="Clique esquerdo: modal | Clique do meio: nova aba"
           >
              <IconBrandWhatsapp size={16} />
           </ActionIcon>
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            onClick={handleArchiveIconClick}
          >
            {pasta.status === 'Arquivada' ? <IconArchiveOff size={16} /> : <IconArchive size={16} />}
          </ActionIcon>
        </Group>
      </Group>

      {/* Corpo Detalhado da Pasta */}
      <Group justify="space-between" align="flex-start" mb="sm" wrap="nowrap"> 
          <Stack gap="xs" style={{ flex: 1 }}>
              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Processo Principal:</Text>
                  <Text size="sm" fw={700}>{pasta.processoPrincipal}</Text>
              </Group>

              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Comarca:</Text>
                  <Text size="sm">{pasta.comarca}</Text>
              </Group>

               <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Órgão Julgador:</Text>
                  <Text size="sm">{pasta.orgaoJulgador}</Text>
              </Group>

              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Área:</Text>
                  <Group gap="xs">
                      <Text size="sm">{pasta.area}</Text>
                      <Text size="sm" fw={500} ml="lg">Classe:</Text> 
                      <Text size="sm">{pasta.classe}</Text>
                  </Group>
              </Group>

               <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Assunto:</Text>
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>{pasta.assunto}</Text>
              </Group>

              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Descrição:</Text>
                  <Text size="sm">{pasta.descricao}</Text>
              </Group>

              {pasta.status === 'Arquivada' && (
                  <Group wrap="nowrap" gap="xs" align="baseline">
                      <Text size="sm" fw={500} w={180}>Motivo do arquivamento:</Text>
                      <Text size="sm">
                        {pasta.motivoArquivamento || 'Não informado'}
                        {pasta.observacaoArquivamento && (
                          <Text span style={{ fontStyle: 'italic', marginLeft: '4px' }}>
                            ({pasta.observacaoArquivamento})
                          </Text>
                        )}
                      </Text>
                  </Group>
              )}
          </Stack>
          
          <Stack gap={2} align="flex-end" style={{ marginLeft: 'var(--mantine-spacing-lg)' }}>
              <Group gap="xs" wrap="nowrap">
              <Text size="sm" fw={500}>Último Atendimento</Text>
              <Text size="xs">{pasta.ultimoAtendimento}</Text>
              </Group>
          </Stack>
      </Group>
      
      {pasta.processosAssociados && pasta.processosAssociados.length > 1 && (
          <Box mt="md">
              {expanded && (
                  <Box mb="xs">
                      <Title order={6} mb="xs">Processos Associados</Title>
                      <Stack gap={2} ml="md">
                      {pasta.processosAssociados.map((proc, index) => (
                          <Text key={index} size="xs">{proc}</Text>
                      ))}
                      </Stack>
                  </Box>
              )}
              <Text
                component="span"
                onClick={toggleExpanded}
                style={{ cursor: 'pointer', color: theme.colors.blue[6], display: 'inline-flex', alignItems: 'center' }}
              >
                  {expanded ? 'Recolher Processos' : `+${pasta.processosAssociados.length - 1} Processos Associados`}
                  <IconArrowDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </Text>
          </Box>
      )}

      {/* Modal de confirmação de DESARQUIVAMENTO */}
      <ModalConfirmacaoAssustadora
        opened={unarchiveModalOpened}
        onClose={closeUnarchiveModal}
        onConfirm={handleConfirmUnarchive}
        title="Desarquivar Pasta"
        message="Você tem certeza que deseja desarquivar esta pasta? A pasta voltará para a lista de ativas."
      >
        {pasta.motivoArquivamento && (
          <Text size="sm">
            <b>Motivo do arquivamento:</b> {pasta.motivoArquivamento}
            {pasta.observacaoArquivamento && ` (${pasta.observacaoArquivamento})`}
          </Text>
        )}
      </ModalConfirmacaoAssustadora>
    </Paper>
  );
} 