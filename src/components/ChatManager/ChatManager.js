'use client';

import React from 'react';
import { useChatManager } from '../../hooks/useChatManager';
import DraggableModal from '../DraggableModal/DraggableModal';
import ApprovalChatModal from '../ApprovalChatModal/ApprovalChatModal';

export default function ChatManager() {
  const { 
    chats, 
    closeChat, 
    minimizeChat, 
    restoreChat,
    sendMessage,
    toggleMaximizeChat,
    endChat,
    continueChat
  } = useChatManager();

  console.log('Renderizando ChatManager. Chats atuais:', chats);

  if (!chats || chats.length === 0) {
    return null;
  }

  return (
    <>
      {chats.map(chat => (
        <DraggableModal
          key={chat.id}
          opened={true}
          onClose={() => closeChat(chat.id)}
          title={chat.title}
          messageCount={chat.unreadCount}
          isMinimized={chat.isMinimized}
          isMaximized={chat.isMaximized}
          onMinimize={() => minimizeChat(chat.id)}
          onRestore={() => restoreChat(chat.id)}
          onMaximize={() => toggleMaximizeChat(chat.id)}
          initialPosition={chat.position}
          initialSize={chat.size}
          maximizedStyles={chat.maximizedStyles}
          initialAlignment={chat.initialAlignment}
        >
          <ApprovalChatModal
            assistido={chat.pastaData.assistido}
            processo={chat.pastaData.processoPrincipal}
            id={chat.pastaData.id}
            assunto={chat.pastaData.assunto}
            descricao={chat.pastaData.descricao}
            messages={chat.messages}
            onSendMessage={(text) => sendMessage(chat.id, text)}
            isChatActive={chat.isChatActive}
            onEndChat={() => endChat(chat.id)}
            onContinueChat={() => continueChat(chat.id)}
          />
        </DraggableModal>
      ))}
    </>
  );
} 