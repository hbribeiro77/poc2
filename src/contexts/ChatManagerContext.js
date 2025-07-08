'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';

export const ChatManagerContext = createContext();

export const ChatManagerProvider = ({ children }) => {
  const [chats, setChats] = useState([]); // Array para gerenciar múltiplos chats

  // Efeito para salvar o histórico no localStorage sempre que os chats mudarem
  useEffect(() => {
    // Não faz nada se não houver chats para evitar apagar o storage desnecessariamente
    if (chats.length === 0) return;

    // Pega todos os históricos salvos
    const existingHistories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
    
    // Cria um objeto com os históricos da sessão atual
    const currentSessionHistories = chats.reduce((acc, chat) => {
      if (chat.messages.length > 0) {
        acc[chat.id] = chat.messages;
      }
      return acc;
    }, {});

    // Mescla os históricos, dando prioridade aos da sessão atual
    const mergedHistories = { ...existingHistories, ...currentSessionHistories };
    
    localStorage.setItem('chat_histories', JSON.stringify(mergedHistories));
  }, [chats]);

  // Abre um novo chat ou foca em um já existente
  const openChat = useCallback((pasta, options = {}) => {
    setChats(currentChats => {
      const existingChatIndex = currentChats.findIndex(c => c.pastaData.assistido === pasta.assistido);
      
      if (existingChatIndex > -1) {
        const chatToUpdate = { ...currentChats[existingChatIndex], isMinimized: false, unreadCount: 0 };
        const updatedChats = [...currentChats];
        updatedChats.splice(existingChatIndex, 1);
        updatedChats.push(chatToUpdate);
        return updatedChats;
      }

      // Carrega o histórico salvo antes de criar o chat
      const savedHistories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
      const initialMessages = savedHistories[pasta.id] || [];

      const newChat = {
        id: pasta.id,
        title: `Chat com ${pasta.assistido} ${pasta.telefone || ''}`,
        pastaData: pasta,
        messages: initialMessages, // Usa o histórico salvo ou um array vazio
        unreadCount: 0,
        isMinimized: false,
        isMaximized: false,
        isChatActive: true,
        position: { x: 50, y: 50 },
        size: { width: '32.81vw', height: '93.97vh' },
        maximizedStyles: options.maximizedStyles || {},
        initialAlignment: options.initialAlignment || 'center',
      };
      return [...currentChats, newChat];
    });
  }, []);

  // Fecha um chat
  const closeChat = useCallback((chatId) => {
    setChats(currentChats => currentChats.filter(c => c.id !== chatId));
  }, []);

  // Minimiza um chat
  const minimizeChat = useCallback((chatId) => {
    setChats(currentChats =>
      currentChats.map(c => (c.id === chatId ? { ...c, isMinimized: true } : c))
    );
  }, []);
  
  // Maximiza/Restaura um chat
  const toggleMaximizeChat = useCallback((chatId) => {
    setChats(currentChats =>
      currentChats.map(c => (c.id === chatId ? { ...c, isMaximized: !c.isMaximized } : c))
    );
  }, []);

  // Restaura um chat minimizado
  const restoreChat = useCallback((chatId) => {
    setChats(currentChats => {
      const existingChatIndex = currentChats.findIndex(c => c.id === chatId);
      if (existingChatIndex === -1) return currentChats; // Chat não encontrado
      
      const chatToUpdate = { ...currentChats[existingChatIndex], isMinimized: false, unreadCount: 0 };
      const updatedChats = [...currentChats];
      updatedChats.splice(existingChatIndex, 1);
      updatedChats.push(chatToUpdate);
      return updatedChats;
    });
  }, []);

  // Encerra uma conversa (torna-a inativa)
  const endChat = useCallback((chatId) => {
    setChats(currentChats => {
      const chatToEnd = currentChats.find(c => c.id === chatId);
      if (!chatToEnd) return currentChats;

      const { id, assunto, descricao } = chatToEnd.pastaData;
      const endMessage = {
        id: `defensor-end-${Date.now()}`,
        sender: 'defensor',
        name: 'Humberto Borges Ribeiro',
        text: `Esta conversa foi encerrada pelo atendente.\n\n---\nID: ${id}\nAssunto: ${assunto}\nDescrição: ${descricao}`,
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      return currentChats.map(c =>
        c.id === chatId
          ? { ...c, isChatActive: false, messages: [...c.messages, endMessage] }
          : c
      );
    });
  }, []);

  // Continua uma conversa (torna-a ativa)
  const continueChat = useCallback((chatId) => {
    setChats(currentChats =>
      currentChats.map(c => (c.id === chatId ? { ...c, isChatActive: true } : c))
    );
  }, []);

  // Envia uma mensagem
  const sendMessage = useCallback((chatId, text) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat || !chat.isChatActive) return; // Não envia se o chat estiver inativo

    const { id, assunto, descricao } = chat.pastaData;
    const formattedText = `${text}\n\n---\nID: ${id}\nAssunto: ${assunto}\nDescrição: ${descricao}`;

    const newMessage = {
      id: `defensor-${Date.now()}`,
      sender: 'defensor',
      name: 'Humberto Borges Ribeiro',
      text: formattedText,
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setChats(currentChats =>
      currentChats.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      )
    );

    // Simula resposta do assistido
    setTimeout(() => {
      const assistidoResponse = {
        id: `assistido-reply-${Date.now()}`,
        sender: 'assistido',
        name: chat.pastaData.assistido || 'Assistido(a)',
        text: 'Ok, recebido. Obrigado!',
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setChats(currentChats => {
        const targetChat = currentChats.find(c => c.id === chatId);
        // Resposta só é adicionada se o chat ainda existir e estiver ativo
        if (!targetChat || !targetChat.isChatActive) return currentChats;

        return currentChats.map(c =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, assistidoResponse], unreadCount: c.isMinimized ? c.unreadCount + 1 : 0 }
            : c
        )
      });
    }, 2000);
  }, [chats]);
  
  // Simula uma mensagem chegando
  const simulateNewMessage = useCallback((chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

     const assistidoResponse = {
        id: `assistido-${Date.now()}`,
        sender: 'assistido',
        name: chat.pastaData.assistido || 'Assistido(a)',
        text: 'Olá! Fiquei com uma dúvida sobre a petição...',
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
       setChats(currentChats =>
        currentChats.map(c =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, assistidoResponse], unreadCount: c.isMinimized ? c.unreadCount + 1 : c.unreadCount }
            : c
        )
      );
  },[chats]);

  const value = {
    chats,
    openChat,
    closeChat,
    minimizeChat,
    toggleMaximizeChat,
    restoreChat,
    sendMessage,
    simulateNewMessage,
    endChat,
    continueChat
  };

  return (
    <ChatManagerContext.Provider value={value}>
      {children}
    </ChatManagerContext.Provider>
  );
}; 