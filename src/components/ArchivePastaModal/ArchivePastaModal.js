'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Stack, Text, Textarea, useMantineTheme } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ModalConfirmacaoAssustadora from '../ConfirmActionModal/ModalConfirmacaoAssustadora';

const motivosArquivamento = [
  'Conclusão do Caso/Atendimento',
  'Perda de Contato com o Assistido',
  'Encaminhamento para Outro Órgão/Setor',
  'Arquivamento Administrativo',
];

export default function ArchivePastaModal({ opened, onClose, onConfirm }) {
  const theme = useMantineTheme();
  const [motivoSelecionado, setMotivoSelecionado] = useState(null);
  const [archiveObservation, setArchiveObservation] = useState('');

  // Reseta o estado interno quando a modal é aberta
  useEffect(() => {
    if (opened) {
      setMotivoSelecionado(null);
      setArchiveObservation('');
    }
  }, [opened]);

  const handleConfirm = () => {
    if (!motivoSelecionado) return;
    onConfirm({
      motivo: motivoSelecionado,
      observacao: archiveObservation,
    });
  };

  return (
    <ModalConfirmacaoAssustadora
      opened={opened}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmar Arquivamento de Pasta"
      alertIcon={<IconAlertCircle size={16} style={{ color: theme.colors.yellow[8] }} />}
      alertColor="yellow"
      alertMessage="Atenção! Arquivar a pasta a oculta na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
      checkboxLabel="Declaro ciência das implicações e confirmo o arquivamento desta pasta."
      confirmButtonLabel="Confirmar Arquivamento"
      isConfirmDisabled={!motivoSelecionado}
    >
      <Stack gap="xs">
        <Radio.Group
          value={motivoSelecionado}
          onChange={setMotivoSelecionado}
          label="Selecione o motivo do arquivamento:"
          withAsterisk
        >
          <Stack mt="xs">
            {motivosArquivamento.map((motivo) => (
              <Radio key={motivo} value={motivo} label={<Text fw={700} size="sm">{motivo}</Text>} />
            ))}
          </Stack>
        </Radio.Group>
        
        <Textarea
          label="Observação adicional (opcional):"
          placeholder="Forneça um contexto adicional para o arquivamento."
          value={archiveObservation}
          onChange={(event) => setArchiveObservation(event.currentTarget.value)}
          autosize
          minRows={2}
          mt="xs"
        />

        <Text size="sm" mt={0}>
          Todas as alterações são auditadas e sujeitas a revisão.
        </Text>
      </Stack>
    </ModalConfirmacaoAssustadora>
  );
} 