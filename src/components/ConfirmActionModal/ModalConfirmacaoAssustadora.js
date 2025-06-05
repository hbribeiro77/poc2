'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal, Alert, Button, Stack, Group, Checkbox, Text, useMantineTheme
} from '@mantine/core';

// Componente Reutilizável para Modais de Confirmação Assustadora
export default function ModalConfirmacaoAssustadora({
  opened,
  onClose,
  onConfirm,
  title,
  alertIcon,
  alertColor,
  alertMessage,
  bodyText,
  children,
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

  // Define a cor padrão do botão de confirmação como 'red' se não for fornecida
  const finalConfirmButtonColor = confirmButtonColor || 'red';

  // Define a cor de fundo do alerta
  let alertBackgroundColor = theme.colors.gray[1]; // Padrão cinza claro
  if (alertColor === 'yellow') {
    alertBackgroundColor = '#fff3bf'; // Amarelo específico
  } else if (alertColor === 'blue') {
    alertBackgroundColor = theme.colors.blue[1]; // Azul claro do tema
  } else if (alertColor && theme.colors[alertColor]?.[1]) {
    alertBackgroundColor = theme.colors[alertColor][1]; // Outra cor do tema
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
                // Usa a cor de fundo definida acima
                backgroundColor: alertBackgroundColor,
                color: theme.black, 
            }}
        >
          {alertMessage}
        </Alert>

        {children}

        <Text size="sm">
            {bodyText}
        </Text>

        <Checkbox
            label={checkboxLabel}
            checked={isChecked}
            onChange={(event) => setIsChecked(event.currentTarget.checked)}
            mt="xs"
            styles={{ label: { fontWeight: 500 } }}
        />

        <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleClose}>
                Cancelar
            </Button>
            <Button
                color={finalConfirmButtonColor} // Usa a cor final (padrão red ou fornecida)
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