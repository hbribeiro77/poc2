'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Group, Text, Button, Stack, ThemeIcon, Flex, Tooltip } from '@mantine/core';
import { IconDoorExit, IconInfoCircle, IconSend, IconTrash } from '@tabler/icons-react';
import ChatUI from '../ChatUI/ChatUI';

export default function ApprovalChatModal({ 
  assistido,
  processo,
  id,
  assunto,
  descricao,
  messages,
  onSendMessage,
  isChatActive,
  onEndChat,
  onContinueChat,
  onClearChat,
}) {
  const [approvalMessageContent, setApprovalMessageContent] = useState('');
  const chatViewportRef = useRef(null);

  const handleSend = () => {
    if (!approvalMessageContent.trim()) return;
    onSendMessage(approvalMessageContent);
    setApprovalMessageContent('');
  };

  return (
    <Flex direction="column" style={{ height: '100%' }}>
      <Stack p="sm" gap={4} bg="var(--mantine-color-gray-0)" style={{ borderBottom: `1px solid var(--mantine-color-gray-2)`, position: 'relative' }}>
          <Text size="xs" truncate>
            <Text span fw={500}>Processo:</Text> {processo} | <Text span fw={500}>PID:</Text> {id}
          </Text>
          <Text size="xs" truncate>
            <Text span fw={500}>Assunto:</Text> {assunto} | <Text span fw={500}>Descrição:</Text> {descricao}
          </Text>
          {onClearChat && (
            <Button
              variant="subtle"
              color="red"
              size="xs"
              px={6}
              style={{ position: 'absolute', top: 4, right: 4, opacity: 0.3, zIndex: 10 }}
              onClick={onClearChat}
              title="Limpar conversa (apenas esta janela)"
              onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.3}
            >
              <IconTrash size={14} />
            </Button>
          )}
      </Stack>

      <Stack p="md" gap="lg" style={{ flex: 1, minHeight: 0 }}>
        <Box style={{ flex: 1, minHeight: 0 }}>
          <ChatUI
            fullHeight={true}
            chatHistory={messages}
            viewportRef={chatViewportRef}
            messageContent={approvalMessageContent}
            onMessageChange={(event) => setApprovalMessageContent(event.currentTarget.value)}
            isChatActive={isChatActive}
            contactName={assistido || 'Assistido'}
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
  );
} 