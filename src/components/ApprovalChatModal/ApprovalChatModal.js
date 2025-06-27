'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Group, Text, Button, Stack, ThemeIcon, ActionIcon, useMantineTheme, Flex, Tooltip, Paper } from '@mantine/core';
import { IconCheck, IconDoorExit, IconInfoCircle, IconSend, IconX, IconMinus, IconMaximize, IconMinimize as IconRestoreDown } from '@tabler/icons-react';
import ChatUI from '../ChatUI/ChatUI';
import DraggableModal from '../DraggableModal/DraggableModal';

export default function ApprovalChatModal({ 
  opened, 
  onClose, 
  messageCount,
  onRestore,
  contact,
  pasta,
  chatHistory,
  onSendMessage,
  isChatActive,
  onEndChat,
  onContinueChat,
  firstUnreadId,
  onScrolledToUnread,
  maximizedStyles,
  onToggleMaximize,
  initialAlignment,
}) {
  const theme = useMantineTheme();
  const [approvalMessageContent, setApprovalMessageContent] = useState('');
  const chatViewportRef = useRef(null);

  useEffect(() => {
    if (opened) {
      setApprovalMessageContent('');
    }
  }, [opened]);

  const handleSend = () => {
    if (!approvalMessageContent.trim()) return;
    onSendMessage(approvalMessageContent);
    setApprovalMessageContent('');
  };

  return (
    <DraggableModal
      opened={opened}
      onClose={onClose}
      padding={0}
      title={`Chat com ${contact?.nome || 'Contato'}`}
      messageCount={messageCount}
      onRestore={onRestore}
      maximizedStyles={maximizedStyles}
      onToggleMaximize={onToggleMaximize}
      initialAlignment={initialAlignment}
    >
      {({ minimize, isMaximized, toggleMaximize }) => (
        <Flex direction="column" style={{ height: '100%' }}>
          {/* Cabeçalho do Modal */}
          <Box 
            className="drag-handle"
            style={{
              backgroundColor: theme.colors.dark[7],
              borderTopLeftRadius: 'var(--mantine-radius-md)',
              borderTopRightRadius: 'var(--mantine-radius-md)',
              cursor: 'move',
            }}
            px="md" 
            py="sm"
          >
            <Group justify="space-between" align="center">
              <Text fw={700} c="white">Contato com {contact.nome} {contact.telefone}</Text>
              <Group>
                <ActionIcon variant="transparent" onClick={minimize} aria-label="Minimizar modal">
                  <IconMinus size={20} color={theme.white} />
                </ActionIcon>
                <ActionIcon variant="transparent" onClick={toggleMaximize} aria-label="Maximizar/Restaurar">
                  {isMaximized ? <IconRestoreDown size={20} color={theme.white} /> : <IconMaximize size={20} color={theme.white} />}
                </ActionIcon>
                <ActionIcon variant="transparent" onClick={onClose} aria-label="Fechar modal">
                  <IconX size={20} color={theme.white} />
                </ActionIcon>
              </Group>
            </Group>
          </Box>

          {/* Seção de Informações da Pasta */}
          {pasta && (
            <Stack p="sm" gap={4} bg={theme.colors.gray[0]} style={{ borderBottom: `1px solid ${theme.colors.gray[2]}`}}>
                <Text size="xs" truncate>
                    <Text span fw={500}>Processo:</Text> {pasta.processoPrincipal} | <Text span fw={500}>PID:</Text> {pasta.id}
                </Text>
                <Text size="xs" truncate>
                    <Text span fw={500}>Assunto:</Text> {pasta.assunto}
                </Text>
                 <Text size="xs" truncate>
                    <Text span fw={500}>Descrição:</Text> {pasta.descricao}
                </Text>
            </Stack>
          )}

          {/* Corpo do Chat */}
          <Stack p="md" gap="lg" style={{ flex: 1, minHeight: 0 }}>
            <Box style={{ flex: 1, minHeight: 0 }}>
              <ChatUI
                fullHeight={true}
                chatHistory={chatHistory}
                viewportRef={chatViewportRef}
                firstUnreadId={firstUnreadId}
                onScrolledToUnread={onScrolledToUnread}
                messageContent={approvalMessageContent}
                onMessageChange={(event) => setApprovalMessageContent(event.currentTarget.value)}
                isChatActive={isChatActive}
                contactName={contact?.nome || 'Assistido'}
                fixedMessageSuffix={null}
                actionButtons={
                  <Group justify="space-between" mt="lg">
                    <Group gap="xs">
                      <Button
                        color="red"
                        leftSection={<IconDoorExit size={16}/>} 
                        onClick={onEndChat}
                        disabled={!isChatActive}
                      >
                        Encerrar conversa
                      </Button>
                      <Tooltip 
                        label="Caso encerre a conversa, você não receberá novas respostas do assistido e precisará continuar a conversa para reativá-la." 
                        withArrow 
                        multiline
                        w={220}
                        position="top-start"
                      >
                        <ThemeIcon variant="subtle" color="gray" radius="xl">
                          <IconInfoCircle size={20} />
                        </ThemeIcon>
                      </Tooltip>
                    </Group>
                    <Group>
                      {!isChatActive ? (
                        <Button color="green" onClick={onContinueChat}>
                          Continuar Conversa
                        </Button>
                      ) : (
                        <Button 
                          leftSection={<IconSend size={16}/>} 
                          onClick={handleSend}
                          disabled={!approvalMessageContent.trim()}
                        >
                          Enviar Mensagem
                        </Button>
                      )}
                    </Group>
                  </Group>
                }
              />
            </Box>
          </Stack>
        </Flex>
      )}
    </DraggableModal>
  );
} 