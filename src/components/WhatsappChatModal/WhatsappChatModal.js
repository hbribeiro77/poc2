import React, { useState, useRef, useEffect } from 'react';
import { Box, Group, Button, Tooltip, ThemeIcon } from '@mantine/core';
import { IconSend, IconDoorExit, IconInfoCircle } from '@tabler/icons-react';
import ChatUI from '../ChatUI/ChatUI'; // Importar o componente de UI de Chat

const ATENDENTE_NOME = 'Humberto Borges Ribeiro';

export default function WhatsappChatModal({ pasta, chatHistory, onChatUpdate, templateId, hideEndButton = false }) {
  const [messageContent, setMessageContent] = useState('');
  const [isChatActive, setIsChatActive] = useState(true);
  const viewportRef = useRef(null);
  const responseTimeoutRef = useRef(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  const getSuffixForTemplate = (template) => {
    if (template === 'aprov_providencia') {
      return 'Responda "Sim" para aprovar a providencia encaminhada pela Defensoria.';
    }
    // Adicione outros templates aqui se necessário
    return null;
  };

  // O sufixo só deve aparecer se for a primeira mensagem do defensor
  const fixedMessageSuffix = !chatHistory.some(m => m.sender === 'defensor')
    ? getSuffixForTemplate(templateId)
    : null;

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;

    let finalMessageText = messageContent;
    // Se o sufixo existe (ou seja, é a primeira mensagem com template), anexa ele.
    if (fixedMessageSuffix) {
      finalMessageText += `\n\n${fixedMessageSuffix}`;
    }

    // Adiciona o rodapé padronizado em todas as mensagens enviadas
    let infoBlock = `#${pasta.id}`;
    const processoNumero = pasta.processoPrincipal || pasta.processo;
    if (processoNumero) {
      infoBlock += `\nProcesso: ${processoNumero}`;
    }
    infoBlock += `\nAssunto: ${pasta.assunto}`;
    const messageFooter = `\n\n---\n${infoBlock}`;
    finalMessageText += messageFooter;

    const newMessage = {
      id: `defensor-${Date.now()}`,
      sender: 'defensor',
      name: ATENDENTE_NOME,
      text: finalMessageText, // Usa o texto final com o sufixo e o rodapé
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatHistory, newMessage];
    onChatUpdate(updatedHistory);
    setMessageContent('');

    // Simula uma resposta do assistido após 2 segundos
    responseTimeoutRef.current = setTimeout(() => {
      const assistidoResponse = {
        id: `assistido-reply-${Date.now()}`,
        sender: 'assistido',
        name: 'Assistido (placeholder)', // Usar um nome real se disponível no objeto 'pasta'
        text: 'Ok, entendi. Obrigado!',
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      // Usa a 'updatedHistory' para evitar problemas com 'stale closure'
      onChatUpdate([...updatedHistory, assistidoResponse]);
    }, 2000);
  };

  const handleEndChat = () => {
    let infoBlock = `#${pasta.id}`;
    const processoNumero = pasta.processoPrincipal || pasta.processo;
    if (processoNumero) {
      infoBlock += `\nProcesso: ${processoNumero}`;
    }
    infoBlock += `\nAssunto: ${pasta.assunto}`;
    const endText = `Esta conversa foi encerrada pelo atendente.\n\n---\n${infoBlock}`;
    const endMessage = {
      id: `system-end-${Date.now()}`,
      sender: 'defensor',
      name: ATENDENTE_NOME,
      text: endText,
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    onChatUpdate([...chatHistory, endMessage]);
    setIsChatActive(false);
  };

  const handleContinueChat = () => {
    setIsChatActive(true);
  };

  const actionButtons = (
    <Group justify="space-between" mt="md">
      {!hideEndButton && (
        <Group gap="xs">
          <Button color="red" leftSection={<IconDoorExit size={16} />} onClick={handleEndChat} disabled={!isChatActive}>
            Encerrar Conversa
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
      )}
      {isChatActive ? (
        <Button
          leftSection={<IconSend size={16} />}
          onClick={handleSendMessage}
          disabled={!messageContent.trim() || !isChatActive}
          style={hideEndButton ? { marginLeft: 'auto' } : {}}
        >
          Enviar
        </Button>
      ) : (
        <Button color="green" onClick={handleContinueChat}>
          Continuar Conversa
        </Button>
      )}
    </Group>
  );

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatUI
        chatHistory={chatHistory}
        viewportRef={viewportRef}
        messageContent={messageContent}
        onMessageChange={(e) => setMessageContent(e.currentTarget.value)}
        isChatActive={isChatActive}
        contactName="Assistido"
        actionButtons={actionButtons}
        fullHeight={true}
        fixedMessageSuffix={fixedMessageSuffix}
      />
    </Box>
  );
} 