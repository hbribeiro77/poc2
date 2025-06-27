'use client';

import React from 'react';
import { Box, Paper, ActionIcon, Title, Text, Group, Divider, Stack } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import WhatsappChatModal from '../WhatsappChatModal/WhatsappChatModal';

export default function ChatPanel({ isOpen, onClose, pasta, chatHistory, onChatUpdate }) {
  if (!isOpen || !pasta) {
    return null;
  }

  return (
    <Paper p="md" withBorder shadow="md" radius="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack gap="xs">
            <Group justify="space-between">
                <Title order={4}>
                Contato objetivo via whatsapp
                </Title>
                <ActionIcon onClick={onClose} variant="subtle" color="gray">
                <IconX size={20} />
                </ActionIcon>
            </Group>
            <Text c="blue.8" fw={700} size="sm">
                Marta Wayne (51) 99238-7768
            </Text>
            <Divider />
            <Group>
                <Text size="xs"><Text span fw={500}>Processo:</Text> {pasta.processoPrincipal}</Text>
            </Group>
            <Text size="xs"><Text span fw={500}>Assunto:</Text> {pasta.assunto}</Text>
        </Stack>
        <Divider my="md" />
        <Box style={{ flex: 1, overflowY: 'auto' }}>
            <WhatsappChatModal
                pasta={pasta}
                chatHistory={chatHistory}
                onChatUpdate={onChatUpdate}
                templateId={null}
            />
        </Box>
    </Paper>
  );
} 