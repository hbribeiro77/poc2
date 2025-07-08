import React, { useEffect, useRef } from 'react';
import {
  ScrollArea,
  Stack,
  Paper,
  Group,
  ThemeIcon,
  Box,
  Text,
  Textarea,
  useMantineTheme,
  Flex,
} from '@mantine/core';
import { IconMessageChatbot, IconMessageCircle } from '@tabler/icons-react';

const ChatUI = ({
  chatHistory,
  viewportRef,
  messageContent,
  onMessageChange,
  isChatActive,
  contactName,
  actionButtons,
  fixedMessageSuffix,
  fullHeight = false,
  firstUnreadId,
  onScrolledToUnread,
}) => {
  const theme = useMantineTheme();
  const inputRef = useRef(null);

  // Efeito para rolar para a primeira mensagem não lida
  useEffect(() => {
    const viewport = viewportRef.current;
    if (firstUnreadId && viewport) {
      const timer = setTimeout(() => {
        const unreadElement = viewport.querySelector(`#${firstUnreadId}`);
        if (unreadElement) {
          viewport.scrollTo({
            top: unreadElement.offsetTop - 20,
            behavior: 'smooth',
          });
          // Avisa o pai que a rolagem foi feita
          if (onScrolledToUnread) {
            onScrolledToUnread();
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [firstUnreadId]); // Depende APENAS da âncora de não lida

  // Efeito para rolar para o final em novas mensagens (quando já está lido)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!firstUnreadId && viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory.length]); // Depende APENAS do número de mensagens

  // Efeito para focar no input quando o chat se torna ativo
  useEffect(() => {
    if (isChatActive) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Pequeno atraso para garantir que o elemento está no DOM
      return () => clearTimeout(timer);
    }
  }, [isChatActive]);

  const renderInputArea = () => {
    if (fixedMessageSuffix) {
      return (
        <Paper withBorder p="xs" radius="md">
          <Flex direction="column">
            <Textarea
              ref={inputRef}
              placeholder={`Mensagem para ${contactName || 'o contato'}...`}
              value={messageContent}
              onChange={onMessageChange}
              autosize
              minRows={1}
              disabled={!isChatActive}
              variant="unstyled"
            />
            <Text c="dimmed" size="sm" mt="xs">
              {fixedMessageSuffix}
            </Text>
          </Flex>
        </Paper>
      );
    }

    return (
      <Textarea
        ref={inputRef}
        placeholder={`Mensagem para ${contactName || 'o contato'}...`}
        value={messageContent}
        onChange={onMessageChange}
        autosize
        minRows={1}
        disabled={!isChatActive}
      />
    );
  };
  
  const chatContent = (
    <Flex direction="column" gap="md" p="sm">
      {chatHistory.length > 0 ? (
        chatHistory.map((chat) => {
          if (chat.sender === 'system') {
            return (
              <Text key={chat.id} id={chat.id} size="xs" c="dimmed" ta="center" p="xs" my="md">
                {chat.text}
                <br />
                <Text span size="xs" c="dimmed">{chat.timestamp}</Text>
              </Text>
            );
          }
          
          return (
            <Paper
              key={chat.id}
              id={chat.id}
              p="sm"
              radius="md"
              withBorder
              bg={chat.sender === 'defensor' ? theme.colors.green[1] : theme.colors.gray[1]}
              style={{
                alignSelf: chat.sender === 'defensor' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                border: chat.sender === 'defensor' 
                  ? `1px solid ${theme.colors.green[3]}` 
                  : `1px solid ${theme.colors.gray[3]}`
              }}
            >
              <Group gap="xs" align="flex-start" wrap="nowrap">
                <ThemeIcon
                  variant="light"
                  color={chat.sender === 'defensor' ? 'green' : 'gray'}
                  size="md"
                  radius="xl"
                >
                  {chat.sender === 'defensor' ? <IconMessageChatbot size={18} /> : <IconMessageCircle size={18} />}
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="xs" fw={700}>{chat.name}</Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</Text>
                </Box>
              </Group>
              <Text size="xs" c="dimmed" ta="right" mt={4}>{chat.timestamp}</Text>
            </Paper>
          );
        })
      ) : (
        <Text size="sm" c="dimmed" ta="center">O histórico da conversa aparecerá aqui.</Text>
      )}
    </Flex>
  );

  if (fullHeight) {
    return (
        <Flex direction="column" style={{ height: '100%' }}>
            <ScrollArea style={{ flex: 1, border: `1px solid ${theme.colors.gray[2]}`, borderRadius: theme.radius.sm }} viewportRef={viewportRef}>
                {chatContent}
            </ScrollArea>
            <Stack gap="sm" mt="sm">
                {isChatActive && renderInputArea()}
                {actionButtons}
            </Stack>
        </Flex>
    );
  }

  return (
    <Stack gap="xs">
      <ScrollArea h={180} style={{ border: `1px solid ${theme.colors.gray[2]}`, borderRadius: theme.radius.sm }} viewportRef={viewportRef}>
        {chatContent}
      </ScrollArea>
      {isChatActive && renderInputArea()}
      {actionButtons}
    </Stack>
  );
};

export default ChatUI; 