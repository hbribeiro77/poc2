'use client';

import React from 'react';
import {
  UnstyledButton,
  Box,
  Text,
  useMantineTheme
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function PastaActionButton({ title, icon: Icon, count, alert, onClick, isActive = false }) {
  const theme = useMantineTheme();

  // Definir cores com base no estado isActive
  const buttonBackgroundColor = isActive ? theme.colors.blue[6] : theme.white;
  const buttonTextColor = isActive ? theme.white : theme.colors.blue[6];
  const buttonBorderColor = isActive ? theme.colors.blue[6] : theme.colors.blue[3];
  const countColor = isActive ? theme.white : theme.colors.blue[6];

  return (
    <UnstyledButton
      p="sm"
      onClick={onClick}
      style={{
        textAlign: 'left',
        width: '110px',
        height: '110px',
        border: `1px solid ${buttonBorderColor}`,
        borderRadius: theme.radius.md,
        backgroundColor: buttonBackgroundColor,
        color: buttonTextColor, // Cor principal para ícone e texto
        position: 'relative',
        boxShadow: theme.shadows.xs,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
        '&:hover': !isActive ? { // Efeito hover apenas para botões não ativos
            backgroundColor: theme.colors.gray[0],
        } : {},
      }}
    >
      {(count !== undefined || alert) && (
        <Box style={{ position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs, zIndex: 1 }}>
          {count !== undefined && !alert && (
              <Text size="xs" fw={500} c={countColor}>{count}</Text> // Usa countColor
          )}
          {alert && (<IconAlertTriangle size={16} style={{ color: theme.colors.orange[6] }} />)}
        </Box>
      )}
      <Box style={{ width: 35, height: 35, display: 'flex', alignItems: 'center', marginBottom: theme.spacing.xs }}>
        {/* O Ícone herda a cor do pai (UnstyledButton) através da prop style.color */}
        <Icon size={30} /> 
      </Box>
      {/* O Texto do título herda a cor do pai (UnstyledButton) */}
      <Text size="xs" fw={500} ta="left" style={{ whiteSpace: 'normal' }}>{title}</Text>
    </UnstyledButton>
  );
} 