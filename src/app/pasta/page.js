'use client';

import React, { useState } from 'react';
import {
  Box, Flex, Image, Group, Text,
  useMantineTheme
} from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import PastaHeader from '../../components/PastaHeader/PastaHeader';
import ModalConfirmacaoAssustadora from '../../components/ConfirmActionModal/ModalConfirmacaoAssustadora';

// Dados de Exemplo INICIAL para passar ao PastaHeader
const initialPastaData = {
  area: "Cível",
  assistido: "BART SIMPSON",
  assunto: "DIREITO DA SAÚDE / Mental / Internação compulsória",
  descricao: "",
  status: "Ativa",
  motivoArquivamento: null,
  lastStatusChangeBy: null,
  lastStatusChangeAt: null,
  processo: "5000260-33.2019.8.21.0109",
  comarca: "Marau",
  orgaoJulgador: "Juízo da 2ª Vara Judicial da Comarca de Marau",
  classe: "Procedimento Comum",
  counts: {
      atendimentos: 0,
      pecas: 1,
      documentos: 0,
      observacoes: 0,
      assistidos: null,
      certidoes: null,
      processos: null,
      dadosPasta: null,
  }
};

export default function PastaPage() {
  const [pastaData, setPastaData] = useState(initialPastaData);
  const theme = useMantineTheme();

  // Estados dos Modais (simplificado)
  const [archiveModalOpened, setArchiveModalOpened] = useState(false);
  const [reactivateModalOpened, setReactivateModalOpened] = useState(false);
  const [motivoSelecionado, setMotivoSelecionado] = useState(null);

  // Abre modal de arquivamento
  const handleOpenArchiveModal = (motivo) => {
    setMotivoSelecionado(motivo);
    setArchiveModalOpened(true);
  };
  // Fecha modal de arquivamento
  const handleCloseArchiveModal = () => setArchiveModalOpened(false);

  // Abre modal de desarquivamento
  const handleOpenReactivateModal = () => setReactivateModalOpened(true);
  // Fecha modal de desarquivamento
  const handleCloseReactivateModal = () => setReactivateModalOpened(false);

  // Confirma ARQUIVAMENTO
  const handleConfirmArchive = () => {
    if (!motivoSelecionado) return;
    const timestamp = new Date();
    const user = "Humberto Borges Ribeiro (3925811)";
    setPastaData({
      ...pastaData,
      status: 'Arquivada',
      motivoArquivamento: motivoSelecionado,
      lastStatusChangeBy: user,
      lastStatusChangeAt: timestamp
    });
    handleCloseArchiveModal(); // Fecha o modal específico
  };

  // Confirma DESARQUIVAMENTO
  const handleConfirmReactivate = () => {
    const timestamp = new Date();
    const user = "Humberto Borges Ribeiro (3925811)";
    setPastaData({
      ...pastaData,
      status: 'Ativa',
      motivoArquivamento: null,
      lastStatusChangeBy: user,
      lastStatusChangeAt: timestamp
    });
    handleCloseReactivateModal(); // Fecha o modal específico
  };

  return (
    <>
      <Flex gap={0} pb="xl">
        {/* Coluna Esquerda */}
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image src="/menulateral.png" alt="Menu Lateral" height="70%" fit="contain" />
        </Box>

        {/* Coluna Direita */}
        <Box style={{ flex: 1 }}>
          {/* Renderiza o componente PastaHeader passando a prop renomeada */}
          <PastaHeader
            pastaData={pastaData}
            onArchiveReasonSelected={handleOpenArchiveModal}
            onOpenReactivateConfirmModal={handleOpenReactivateModal}
          />

          {/* Conteúdo ADICIONAL específico da página Pasta (se houver) pode vir aqui */}
          {/* Exemplo:
          <Paper mt="md" p="md" withBorder>
              <Title order={4}>Seção Adicional</Title>
              <Text>Mais detalhes sobre a pasta...</Text>
          </Paper>
          */}
        </Box>
      </Flex>

      {/* Link Voltar (sem o checkbox) */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">Voltar para a Central</Text>
        </Link>
      </Group>

      {/* Modal de Confirmação de ARQUIVAMENTO */}
      <ModalConfirmacaoAssustadora
        opened={archiveModalOpened}
        onClose={handleCloseArchiveModal}
        onConfirm={handleConfirmArchive}
        title={`Confirmar Arquivamento de Pasta por ${motivoSelecionado || 'Motivo não selecionado'}`}
        alertIcon={<IconAlertCircle size={16} style={{ color: theme.colors.yellow[8] }}/>}
        alertColor="yellow" // Amarelo para arquivamento
        alertMessage="Atenção! Arquivar a pasta a oculta na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        bodyText="Todas as alterações são auditadas e sujeitas a revisão."
        checkboxLabel="Declaro ciência das implicações e confirmo o arquivamento desta pasta."
        confirmButtonLabel="Confirmar Arquivamento"
        // confirmButtonColor não definido, usará o padrão 'red' do componente
      />

      {/* Modal de Confirmação de DESARQUIVAMENTO (estilo assustador, textos originais restaurados) */}
      <ModalConfirmacaoAssustadora
        opened={reactivateModalOpened}
        onClose={handleCloseReactivateModal}
        onConfirm={handleConfirmReactivate}
        title="Confirmar Desarquivamento de Pasta"
        alertIcon={<IconAlertCircle size={16} style={{ color: theme.colors.yellow[8] }}/>} // Ícone AMARELO
        alertColor="yellow" // Cor AMARELA
        // Texto original restaurado:
        alertMessage="Atenção: Desarquivar a pasta a torna visível na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        // Texto original restaurado:
        bodyText={`A pasta foi arquivada pelo motivo: ${pastaData.motivoArquivamento || 'Não especificado'}. Confirma o desarquivamento?`}
        // Texto original restaurado:
        checkboxLabel="Declaro ciência das implicações e confirmo o desarquivamento desta pasta."
        confirmButtonLabel="Confirmar Desarquivamento"
        // confirmButtonColor não definido, usará o padrão 'red'
      />
    </>
  );
} 