'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Group, Text, Button, Stack, ThemeIcon, Flex, Tooltip } from '@mantine/core';
import { IconDoorExit, IconInfoCircle, IconSend } from '@tabler/icons-react';
import ChatUI from '../ChatUI/ChatUI';

export default function ApprovalChatModal({ 
  assistido,
  processo,
  id,
  assunto,
  descricao,
  messages,
  onSendMessage,
}) {
  const [approvalMessageContent, setApprovalMessageContent] = useState('');
  const chatViewportRef = useRef(null);

  const isChatActive = true; 
  const onEndChat = () => console.log("Encerrar chat (lógica a ser implementada no contexto)");
  const onContinueChat = () => console.log("Continuar chat (lógica a ser implementada no contexto)");

  const handleSend = () => {
    if (!approvalMessageContent.trim()) return;
    onSendMessage(approvalMessageContent);
    setApprovalMessageContent('');
  };

  return (
    <Flex direction="column" style={{ height: '100%' }}>
      <Stack p="sm" gap={4} bg="var(--mantine-color-gray-0)" style={{ borderBottom: `1px solid var(--mantine-color-gray-2)`}}>
          <Text size="xs" truncate>
            <Text span fw={500}>Processo:</Text> {processo} | <Text span fw={500}>PID:</Text> {id}
          </Text>
          <Text size="xs" truncate>
            <Text span fw={500}>Assunto:</Text> {assunto} | <Text span fw={500}>Descrição:</Text> {descricao}
          </Text>
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