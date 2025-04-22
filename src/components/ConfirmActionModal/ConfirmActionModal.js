'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal, Alert, Button, Stack, Group, Checkbox, Text, useMantineTheme
} from '@mantine/core';

// Componente Reutilizável para Modais de Confirmação
export default function ConfirmActionModal({
  opened,
  onClose,
  onConfirm,
  title,
  alertIcon,
  alertColor,
  alertMessage,
  bodyText,
  checkboxLabel,
  confirmButtonLabel,
  confirmButtonColor,
  isLoading = false // Opcional: para estado de carregamento
}) {
  const [isChecked, setIsChecked] = useState(false);
  const theme = useMantineTheme();

  // Reseta o checkbox quando o modal é fechado externamente
  useEffect(() => {
    if (!opened) {
      setIsChecked(false);
    }
  }, [opened]);

  const handleConfirmClick = () => {
      if (isChecked) {
          onConfirm();
      }
  };

  const handleClose = () => {
      setIsChecked(false); // Garante reset ao fechar pelo botão ou X
      onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title}
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
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
        }
      }}
    >
      <Stack gap="md">
        <Alert 
            icon={alertIcon}
            mt="md" 
            style={{
                // Usa a cor específica ou um padrão se não fornecida
                backgroundColor: alertColor ? (alertColor === 'yellow' ? '#fff3bf' : theme.colors[alertColor]?.[1] || theme.colors.gray[1]) : theme.colors.gray[1],
                color: theme.black, 
            }}
        >
          {alertMessage}
        </Alert>

        <Text size="sm">
            {bodyText}
        </Text>

        <Checkbox
            label={checkboxLabel}
            checked={isChecked}
            onChange={(event) => setIsChecked(event.currentTarget.checked)}
            mt="md"
            styles={{ label: { fontWeight: 500 } }}
        />

        <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleClose}>
                Cancelar
            </Button>
            <Button
                color={confirmButtonColor}
                disabled={!isChecked || isLoading}
                onClick={handleConfirmClick}
                loading={isLoading}
            >
                {confirmButtonLabel}
            </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 