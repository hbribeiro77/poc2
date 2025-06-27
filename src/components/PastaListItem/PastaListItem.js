'use client';

import React, { useState } from 'react';
import { Paper, Group, Text, Badge, ActionIcon, Stack, Title, Box, useMantineTheme, Radio, Textarea } from '@mantine/core';
import { IconFolder, IconPlus, IconArrowDown, IconArchive, IconArchiveOff, IconBrandWhatsapp } from '@tabler/icons-react';
import ModalConfirmacaoAssustadora from '../ConfirmActionModal/ModalConfirmacaoAssustadora'; // Importar o modal

export default function PastaListItem({ pasta, onArchive, onUnarchive, onStartChat, chatBehavior = 'inline', onChatClick }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpened, setModalOpened] = useState(false); // Estado para o modal DE ARQUIVAMENTO
  const [unarchiveModalOpened, setUnarchiveModalOpened] = useState(false); // Estado para o modal DE DESARQUIVAMENTO
  const [selectedReason, setSelectedReason] = useState(''); // Estado para o motivo selecionado
  const [archiveObservation, setArchiveObservation] = useState(''); // Estado para a observação
  const theme = useMantineTheme(); // Hook para acessar o tema

  const toggleExpanded = () => setExpanded((prev) => !prev);

  // Verifica se a tag "Réu preso" existe
  const hasReuPreso = pasta.tags && pasta.tags.includes('Réu preso');
  
  // Define a cor da borda esquerda com a nova lógica
  let borderLeftColor;
  if (pasta.status === 'Arquivada') {
    borderLeftColor = '#7d7d7d'; // Cinza para arquivadas
  } else { // Se for Ativa
    borderLeftColor = hasReuPreso ? theme.colors.yellow[6] : '#1b7847'; // Amarelo se réu preso, senão verde
  }

  // Define o estilo do Paper
  const paperStyle = {
    borderLeft: `5px solid ${borderLeftColor}`,
    transition: 'all 0.2s ease',
  };

  // Handlers do Modal
  const openModal = () => setModalOpened(true);
  const closeModal = () => {
    setModalOpened(false);
    setSelectedReason(''); // Resetar motivo ao fechar
    setArchiveObservation(''); // Resetar observação ao fechar
  };

  const handleConfirmArchive = () => {
    onArchive(pasta.id, selectedReason, archiveObservation);
    closeModal();
  };

  // Handlers do Modal de DESARQUIVAMENTO
  const openUnarchiveModal = () => setUnarchiveModalOpened(true);
  const closeUnarchiveModal = () => setUnarchiveModalOpened(false);

  const handleConfirmUnarchive = () => {
    onUnarchive(pasta.id);
    closeUnarchiveModal();
  };

  const handleWhatsappClick = () => {
    // Se uma função onChatClick for fornecida, use-a.
    if (onChatClick) {
      onChatClick(pasta);
      return;
    }

    // Comportamento original
    if (chatBehavior === 'newTab') {
      // Salva os dados da pasta e o histórico atual (se houver) no localStorage para a nova aba ler
      localStorage.setItem(`chatPastaData-${pasta.id}`, JSON.stringify(pasta));
      window.open(`/chat/${pasta.id}`, '_blank');
    } else if (onStartChat) {
      onStartChat();
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
           >
              <IconBrandWhatsapp size={16} />
           </ActionIcon>
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            onClick={pasta.status === 'Arquivada' ? openUnarchiveModal : openModal}
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

      {/* Modal de confirmação de arquivamento */}
      <ModalConfirmacaoAssustadora
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={handleConfirmArchive}
        title="Arquivar Pasta"
        message="Você tem certeza que deseja arquivar esta pasta? Esta ação pode ter implicações importantes."
      >
        <Stack>
          <Radio.Group
            name="motivoArquivamento"
            label="Selecione o motivo do arquivamento"
            withAsterisk
            value={selectedReason}
            onChange={setSelectedReason}
          >
            <Stack mt="xs">
              {motivosArquivamento.map((motivo) => (
                <Radio key={motivo} value={motivo} label={motivo} />
              ))}
            </Stack>
          </Radio.Group>
          <Textarea
            label="Observação (Opcional)"
            placeholder="Adicione uma observação se necessário"
            value={archiveObservation}
            onChange={(event) => setArchiveObservation(event.currentTarget.value)}
          />
        </Stack>
      </ModalConfirmacaoAssustadora>

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