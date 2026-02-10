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
  useMantineTheme,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const ALERT_MESSAGE =
  'Atenção: O campo Nome Social é de uso exclusivo para identidade de gênero de pessoas travestis e transexuais. Não é permitido utilizar para apelidos ou cadastro de outra pessoa. O uso incorreto impacta documentos oficiais.';

const BODY_TEXT =
  'A edição do nome social do assistido só é possível por alteração do registro civil ou correção de grafia no cadastro. Todas as alterações são auditadas e sujeitas a revisão.';

const CHECKBOX_LABEL =
  'Sou responsável pelas informações aqui indicadas e confirmo sua veracidade. Todas as alterações são auditadas e sujeitas a revisão.';

export default function ModalEditarNomeSocial({
  opened,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (!opened) {
      setIsChecked(false);
    }
  }, [opened]);

  const handleConfirmClick = () => {
    if (isChecked && onConfirm) {
      onConfirm();
      onClose();
    }
  };

  const handleClose = () => {
    setIsChecked(false);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Editar Nome Social"
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

        <Text size="sm">{BODY_TEXT}</Text>

        <Checkbox
          label={CHECKBOX_LABEL}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.currentTarget.checked)}
          mt="md"
          styles={{ label: { fontWeight: 500 } }}
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={handleClose}>
            Cancelar Edição
          </Button>
          <Button
            color="blue"
            disabled={!isChecked || loading}
            onClick={handleConfirmClick}
            loading={loading}
          >
            Confirmar Edição
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
