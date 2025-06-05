'use client';

import React, { useState } from 'react';
import { Paper, Group, Text, Badge, ActionIcon, Stack, Title, Box, useMantineTheme, Radio, Textarea } from '@mantine/core';
import { IconFolder, IconPlus, IconTrash, IconArrowDown, IconArchive, IconAlertTriangle, IconInfoCircle, IconArchiveOff } from '@tabler/icons-react';
import Link from 'next/link'; // Manter para o link interno se necessário, ou remover se o link for só controle de estado
import ModalConfirmacaoAssustadora from '../ConfirmActionModal/ModalConfirmacaoAssustadora'; // Importar o modal

export default function PastaListItem({ pasta, onArchive, onUnarchive }) {
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
    // Mantém um padding interno, mas remove a borda padrão
  };

  // Handlers do Modal
  const openModal = () => setModalOpened(true);
  const closeModal = () => {
    setModalOpened(false);
    setSelectedReason(''); // Resetar motivo ao fechar
    setArchiveObservation(''); // Resetar observação ao fechar
  };

  const handleConfirmArchive = () => {
    // Chama a função passada pelo pai para arquivar
    onArchive(pasta.id, selectedReason, archiveObservation);
    // Aqui viria a lógica real de arquivamento (ex: chamada API)
    closeModal();
  };

  // Handlers do Modal de DESARQUIVAMENTO
  const openUnarchiveModal = () => setUnarchiveModalOpened(true);
  const closeUnarchiveModal = () => setUnarchiveModalOpened(false);

  const handleConfirmUnarchive = () => {
    // Chama a função passada pelo pai para desarquivar
    onUnarchive(pasta.id);
    // Aqui viria a lógica real de desarquivamento
    closeUnarchiveModal();
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
          {/* Novos Badges Fixos/Condicionais */}
          <Badge color="blue" variant="light" size="sm">ASSISTIDO</Badge>
          {hasReuPreso && (
            <Badge color="orange" variant="filled" size="sm">RÉU PRESO</Badge>
          )}
        </Group>
        {/* Grupo da Direita no Cabeçalho: Status + Ações */}
        <Group gap="xs" align="center"> 
          {/* Badge de Status Movido para cá */}
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
          {/* Ícone Condicional Arquivar/Desarquivar com onClick condicional */}
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            onClick={pasta.status === 'Arquivada' ? openUnarchiveModal : openModal} // << onClick Condicional
          >
            {pasta.status === 'Arquivada' ? <IconArchiveOff size={16} /> : <IconArchive size={16} />}
          </ActionIcon>
        </Group>
      </Group>

      {/* Corpo Detalhado da Pasta */}
      <Group justify="space-between" align="flex-start" mb="sm" wrap="nowrap"> 
          {/* Coluna Esquerda Detalhes - Ajustar gap */}
          <Stack gap="xs" style={{ flex: 1 }}>
             {/* Processo Principal */}
              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Processo Principal:</Text>
                  <Text size="sm" fw={700}>{pasta.processoPrincipal}</Text>
              </Group>

              {/* Comarca */}
              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Comarca:</Text>
                  <Text size="sm">{pasta.comarca}</Text>
              </Group>

              {/* Órgão Julgador */}
               <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Órgão Julgador:</Text>
                  <Text size="sm">{pasta.orgaoJulgador}</Text>
              </Group>

              {/* Área e Classe */}
              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Área:</Text>
                  <Group gap="xs">
                      <Text size="sm">{pasta.area}</Text>
                      <Text size="sm" fw={500} ml="lg">Classe:</Text> 
                      <Text size="sm">{pasta.classe}</Text>
                  </Group>
              </Group>

              {/* Assunto */}
               <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Assunto:</Text>
                  {/* Usar um span ou div clicável em vez de Link se for só para estado */}
                  <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>{pasta.assunto}</Text>
              </Group>

              {/* Descrição */}
              <Group wrap="nowrap" gap="xs" align="baseline">
                  <Text size="sm" fw={500} w={180}>Descrição:</Text>
                  <Text size="sm">{pasta.descricao}</Text>
              </Group>

              {/* Motivo do Arquivamento (Condicional) - Nova Linha */}
              {pasta.status === 'Arquivada' && (
                  <Group wrap="nowrap" gap="xs" align="baseline">
                      {/* Label com largura fixa para alinhar */}
                      <Text size="sm" fw={500} w={180}>Motivo do arquivamento:</Text>
                      {/* Exibe o motivo e a observação opcional */}
                      <Text size="sm">
                        {/* Motivo */}
                        {pasta.motivoArquivamento || 'Não informado'}
                        {/* Observação Opcional em Itálico */}
                        {pasta.observacaoArquivamento && (
                          <Text span style={{ fontStyle: 'italic', marginLeft: '4px' }}>
                            ({pasta.observacaoArquivamento})
                          </Text>
                        )}
                      </Text>
                  </Group>
              )}
          </Stack>
          
          {/* Coluna Direita - Reestruturado com Stack */}
          <Stack gap={2} align="flex-end" style={{ marginLeft: 'var(--mantine-spacing-lg)' }}>
              {/* Grupo para Último Atendimento + Data */}
              <Group gap="xs" wrap="nowrap">
              <Text size="sm" fw={500}>Último Atendimento</Text>
              <Text size="xs">{pasta.ultimoAtendimento}</Text>
              </Group>
              {/* Badge de Status REMOVIDO daqui */}
          </Stack>
      </Group>
      
      {/* Processos Associados e Link (Renderização Condicional) */}
      {pasta.processosAssociados && pasta.processosAssociados.length > 1 && (
          <Box mt="md">
              {/* Renderiza a lista apenas se expanded for true */}
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
              {/* Link/Botão para expandir/recolher - Estilo Atualizado */}
              <Text
                component="span"
                size="xs"
                c="blue"
                mt="xs"
                onClick={toggleExpanded}
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              >
                  Visualizar todos os processos da pasta
                  <Badge color="yellow" size="xs" variant='filled' radius="sm" style={{ marginLeft: '4px'}}>
                    <IconArrowDown size={12} />
                  </Badge>
              </Text>
          </Box>
      )}

      {/* Instância do Modal de Confirmação */}
      <ModalConfirmacaoAssustadora
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={handleConfirmArchive}
        title="Confirmação de arquivamento"
        alertIcon={<IconInfoCircle size={20} color="#f29c1d" />}
        alertColor="yellow"
        alertMessage="Atenção! Arquivar a pasta a oculta na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        checkboxLabel="Declaro ciência das implicações e confirmo o arquivamento da pasta"
        confirmButtonLabel="Confirmar Arquivamento"
        confirmButtonColor="orange" // Cor do botão como na imagem
        // Passando o Radio.Group e o texto de auditoria como children
      >
        <Stack gap={4}> { /* Reduzindo MAIS o gap interno do modal */}
          <Radio.Group
            value={selectedReason}
            onChange={setSelectedReason}
            label="Selecione o motivo do arquivamento:"
            withAsterisk
          >
            <Stack mt="xs">
              {motivosArquivamento.map((motivo) => (
                <Radio key={motivo} value={motivo} label={<Text fw={700} size="sm">{motivo}</Text>} />
              ))}
            </Stack>
          </Radio.Group>

          {/* Campo de Observação Adicional */}
          <Textarea
            label="Observação adicional (opcional):"
            value={archiveObservation}
            onChange={(event) => setArchiveObservation(event.currentTarget.value)}
            autosize
            minRows={2}
            mt="md"
          />

          <Text>
            Todas as alterações são auditadas e sujeitas a revisão.
          </Text>
        </Stack>
      </ModalConfirmacaoAssustadora>

      {/* Instância do Modal de Confirmação para DESARQUIVAMENTO */}
      <ModalConfirmacaoAssustadora
        opened={unarchiveModalOpened}
        onClose={closeUnarchiveModal}
        onConfirm={handleConfirmUnarchive}
        title="Confirmar Desarquivamento de Pasta"
        alertIcon={<IconInfoCircle size={20} color="#f29c1d" />}
        alertColor="yellow"
        alertMessage="Atenção: Desarquivar a pasta a torna visível na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        // Usando bodyText para a mensagem principal
        bodyText={`A pasta foi arquivada pelo motivo: ${pasta.motivoArquivamento || 'Não informado'}. Confirma o desarquivamento?`}
        checkboxLabel="Declaro ciência das implicações e confirmo o desarquivamento desta pasta."
        confirmButtonLabel="Confirmar Desarquivamento"
        // Não especificando confirmButtonColor para usar o padrão do tema (geralmente azul)
      />
    </Paper>
  );
} 