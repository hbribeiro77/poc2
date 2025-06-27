'use client';

import { useContext } from 'react';
import { ChatManagerContext } from '../contexts/ChatManagerContext';

export const useChatManager = () => {
  const context = useContext(ChatManagerContext);
  if (!context) {
    throw new Error('useChatManager must be used within a ChatManagerProvider');
  }
  return context;
}; 