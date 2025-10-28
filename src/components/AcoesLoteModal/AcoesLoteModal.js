'use client';

import React from 'react';
import { 
  Modal, Title, Text, Button, Stack, Checkbox, Group
} from '@mantine/core';

export default function AcoesLoteModal({ 
  opened, 
  onClose, 
  selectedCount,
  acoesSelecionadas = [],
  onAcoesChange,
  onSalvar
}) {
  const acoesDisponiveis = [
    { id: 'ocultar', label: 'Ocultar' },
    { id: 'renunciar', label: 'Renunciar em Lote' },
    { id: 'encaminhar', label: 'Encaminhar em Lote' }
  ];

  const handleAcaoChange = (acaoId, checked) => {
    if (checked) {
      onAcoesChange([...acoesSelecionadas, acaoId]);
    } else {
      onAcoesChange(acoesSelecionadas.filter(id => id !== acaoId));
    }
  };

  const handleSalvar = () => {
    onSalvar(acoesSelecionadas);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} c="dark" style={{ color: '#2d5a27' }}>
          Ação para o item selecionado
        </Title>
      }
      centered
      size="sm"
      radius="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {selectedCount} processo(s) selecionado(s)
        </Text>
        
        <Stack gap="sm">
          {acoesDisponiveis.map((acao) => (
            <Group key={acao.id}>
              <Checkbox
                checked={acoesSelecionadas.includes(acao.id)}
                onChange={(event) => handleAcaoChange(acao.id, event.currentTarget.checked)}
                size="sm"
              />
              <Text size="sm">{acao.label}</Text>
            </Group>
          ))}
        </Stack>

        <Group justify="center" mt="md">
          <Button 
            onClick={handleSalvar}
            disabled={acoesSelecionadas.length === 0}
            size="sm"
          >
            Salvar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
