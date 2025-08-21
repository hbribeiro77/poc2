'use client';

import React, { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  Divider,
  Loader
} from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';

const SimpleConfirmModal = ({ opened, onClose, onConfirm, selectedCounts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { documentosPasta, documentosCadastro, atendimentos, pecas } = selectedCounts;
  const total = documentosPasta + documentosCadastro + atendimentos + pecas;

  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Abre o link em nova aba
    window.open('https://www.minutaia.com.br/', '_blank');
    
    onConfirm();
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirmar envio para o Portal-IA"
      centered
      size="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        header: { backgroundColor: '#373a40' },
        title: { color: '#ffffff', fontWeight: 700 },
        close: {
          color: '#ffffff',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
        }
      }}
    >
      <Stack gap="md">
        <Text size="md" fw={500}>
          Tem certeza que deseja enviar os itens selecionados para o Portal-IA?
        </Text>
        
        <Divider />
        
        <Stack gap="xs">
          <Text size="sm" fw={500}>Itens selecionados:</Text>
          {documentosPasta > 0 && (
            <Text size="sm">• Documentos da Pasta: {documentosPasta}</Text>
          )}
          {documentosCadastro > 0 && (
            <Text size="sm">• Documentos do Cadastro: {documentosCadastro}</Text>
          )}
          {atendimentos > 0 && (
            <Text size="sm">• Atendimentos: {atendimentos}</Text>
          )}
          {pecas > 0 && (
            <Text size="sm">• Peças: {pecas}</Text>
          )}
          
          <Divider variant="dashed" />
          <Text size="sm" fw={600}>Total: {total} itens</Text>
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            leftSection={!isLoading ? <IconSparkles size={16} /> : null}
            onClick={handleConfirm}
            color="blue"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Confirmar Envio'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default SimpleConfirmModal;