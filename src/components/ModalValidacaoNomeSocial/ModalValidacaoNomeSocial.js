'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Alert,
  Button,
  Stack,
  Group,
  Checkbox,
  Text,
  Radio,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const ALERT_MESSAGE =
  'Atenção, este cadastro possui um nome social ainda não validado. O campo Nome Social é de uso exclusivo para identidade de gênero de pessoas travestis e transexuais. Não utilize este campo de outra forma. O uso incorreto impacta documentos oficiais.';

const CHECKBOX_LABEL =
  'Sou responsável pelas informações aqui indicadas e confirmo sua veracidade. Todas as alterações são auditadas e sujeitas a revisão.';

export default function ModalValidacaoNomeSocial({
  opened,
  onClose,
  nomeSocial = '',
  onConfirm,
  confirmButtonLabel = 'Confirmar Edição',
  loading = false,
}) {
  const [acao, setAcao] = useState('confirmar');
  const [isChecked, setIsChecked] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (!opened) {
      setIsChecked(false);
      setAcao('confirmar');
    }
  }, [opened]);

  const handleConfirmClick = () => {
    if (isChecked && onConfirm) {
      onConfirm(acao);
      onClose();
    }
  };

  const handleClose = () => {
    setIsChecked(false);
    setAcao('confirmar');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Validação de Nome Social"
      centered
      size="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        header: { backgroundColor: '#373a40' },
        title: { color: '#ffffff', fontWeight: 700 },
        close: {
          color: '#ffffff',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        },
      }}
    >
      <Stack gap="md">
        <Alert
          icon={<IconAlertTriangle size={20} />}
          color="yellow"
          style={{ backgroundColor: '#fff3bf', color: theme.black }}
        >
          {ALERT_MESSAGE}
        </Alert>

        <Text size="sm" fw={500}>
          Identificamos o seguinte preenchimento no cadastro deste assistido:
        </Text>
        <Text size="sm" fw={600} c="dark">
          {nomeSocial || '[Nome Social Encontrado]'}
        </Text>

        <Text size="sm" fw={500} mt="sm">
          Selecione a ação adequada para prosseguir:
        </Text>
        <Radio.Group value={acao} onChange={setAcao}>
          <Stack gap="xs">
            <Radio
              value="confirmar"
              label={
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    Confirmar como Nome Social
                  </Text>
                  <Text size="xs" c="dimmed">
                    O dado está correto e refere-se à identidade de gênero do assistido.
                  </Text>
                </Stack>
              }
            />
            <Radio
              value="mover-observacoes"
              label={
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    Não é Nome Social (Mover para Observações)
                  </Text>
                  <Text size="xs" c="dimmed">
                    É um apelido, "vulgo" ou outra informação útil que deve ser preservada no histórico.
                  </Text>
                </Stack>
              }
            />
            <Radio
              value="excluir"
              label={
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    Não é Nome Social (Excluir dado)
                  </Text>
                  <Text size="xs" c="dimmed">
                    A informação está incorreta ou não deve constar no cadastro.
                  </Text>
                </Stack>
              }
            />
          </Stack>
        </Radio.Group>

        <Checkbox
          label={CHECKBOX_LABEL}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.currentTarget.checked)}
          mt="md"
          styles={{ label: { fontWeight: 500 } }}
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            color="blue"
            disabled={!isChecked || loading}
            onClick={handleConfirmClick}
            loading={loading}
          >
            {confirmButtonLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
