'use client';

import React, { useState } from 'react';
import { Modal, Group, Text, Button, Stack, MultiSelect, Select, useMantineTheme } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

const messageTemplates = [
  { value: 'local_atendimento', label: 'Informar local do atendimento' },
  { value: 'texto_livre', label: 'Texto livre' },
  { value: 'corona_cancelado', label: 'Atendimento cancelado - CORONAVÍRUS' },
  { value: 'corona_cancelado_poa', label: 'Atendimento cancelado - CORONAVÍRUS (Porto Alegre)' },
  { value: 'aprov_providencia', label: 'Aprovação de providência' },
  { value: 'decl_hipo_financeira', label: 'Declaração de hipossuficiência financeira' },
  { value: 'decl_hipo_organizacional', label: 'Declaração de hipossuficiência organizacional' },
  { value: 'decl_desemprego', label: 'Declaração de desemprego' },
];

const defensoriaOptions = [
  { value: 'cate', label: 'CENTRO DE APOIO TÉCNICO ESPECIALIZADO - CATE' },
  { value: 'sistemas', label: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO' },
  { value: 'dpe_14', label: '14ª DEFENSORIA PÚBL ESPECIALIZADA EM...' },
];

export default function SendMessageModal({ opened, onClose, contact, onSend }) {
  const theme = useMantineTheme();
  const [selectedMessageTemplate, setSelectedMessageTemplate] = useState('');
  const [selectedDefensoria, setSelectedDefensoria] = useState(['sistemas']);

  const handleSend = () => {
    if (onSend && selectedMessageTemplate) {
      const selectedTemplateObject = messageTemplates.find(t => t.value === selectedMessageTemplate);
      onSend({
        contact,
        template: selectedMessageTemplate,
        templateLabel: selectedTemplateObject ? selectedTemplateObject.label : '',
        defensorias: selectedDefensoria,
      });
    }
    setSelectedMessageTemplate('');
    setSelectedDefensoria(['sistemas']);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconSend size={22} />
          <Text fw={700}>Fazer contato objetivo</Text>
        </Group>
      }
      size="lg"
      centered
      radius="md"
      styles={{
        header: { backgroundColor: theme.colors.dark[6] },
        title: { color: theme.white },
        close: {
          color: theme.white,
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        },
      }}
    >
      <Stack pt="sm">
        <Text>Para: {contact?.nome || contact?.contato || '-'}</Text>
        <MultiSelect
          label="Defensoria"
          placeholder="Selecione a(s) defensoria(s)"
          data={defensoriaOptions}
          value={selectedDefensoria}
          onChange={setSelectedDefensoria}
        />
        <Select
          label="Modelo de Mensagem"
          placeholder="Selecione um modelo"
          data={messageTemplates}
          value={selectedMessageTemplate}
          onChange={(value) => setSelectedMessageTemplate(value || '')}
          searchable
          nothingFoundMessage="Nenhum template encontrado"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={!selectedMessageTemplate}>
            Enviar Mensagem
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 