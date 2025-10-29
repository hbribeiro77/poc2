'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  TextInput,
  ScrollArea,
  Group,
  Text,
  ActionIcon,
  Paper,
  Button,
  Box,
  Chip,
  Stack,
} from '@mantine/core';
import { 
  IconSend, IconX, IconRobot, IconCheck, IconClock, IconGavel,
  IconSparkles, IconBrain, IconMinus
} from '@tabler/icons-react';

/**
 * Modal de Chat com IA para criação de tarefas/cotas/audiências
 */
export default function IAChatModal({ opened, onClose, defaultTool = 'criar-tarefa', onCriarTarefa = null }) {
  // CSS para animação de "pensando"
  const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
  if (styleTag) {
    styleTag.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `;
    if (!document.head.querySelector('style[data-ia-chat-animation]')) {
      styleTag.setAttribute('data-ia-chat-animation', 'true');
      document.head.appendChild(styleTag);
    }
  }
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTool, setSelectedTool] = useState(defaultTool);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mensagem inicial baseada na ferramenta selecionada
  useEffect(() => {
    if (opened) {
      const initialMessage = getInitialMessage(selectedTool);
      setMessages([initialMessage]);
      // Foca no input após um delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      // Limpa as mensagens ao fechar
      setMessages([]);
      setInputValue('');
      setIsLoading(false);
      setIsMinimized(false);
    }
  }, [opened, selectedTool]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitialMessage = (tool) => {
    const toolMessages = {
      'criar-tarefa': {
        role: 'assistant',
        content: 'Olá! Estou aqui para ajudá-lo a criar uma tarefa usando IA. \n\nPor favor, descreva a tarefa que você precisa criar, e eu vou gerar uma proposta para você.',
      },
      'criar-cota': {
        role: 'assistant',
        content: 'Olá! Estou aqui para ajudá-lo a criar uma cota usando IA. \n\nPor favor, descreva os detalhes da cota que você precisa criar.',
      },
      'registrar-audiencia': {
        role: 'assistant',
        content: 'Olá! Estou aqui para ajudá-lo a registrar uma audiência usando IA. \n\nPor favor, forneça as informações da audiência que você precisa registrar.',
      },
    };
    return toolMessages[tool] || toolMessages['criar-tarefa'];
  };

  const getToolInfo = (tool) => {
    const tools = {
      'criar-tarefa': {
        label: 'Criar Tarefa',
        icon: IconCheck,
        color: '#228be6',
      },
      'criar-cota': {
        label: 'Criar Cota',
        icon: IconClock,
        color: '#f0ad4e',
      },
      'registrar-audiencia': {
        label: 'Registrar Audiência',
        icon: IconGavel,
        color: '#5cb85c',
      },
    };
    return tools[tool] || tools['criar-tarefa'];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
    };

    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Detecta se a mensagem é uma solicitação de criação de tarefa
    const mensagemLower = userMessage.content.toLowerCase();
    const criarTarefaKeywords = ['criar tarefa', 'criar', 'tarefa para', 'tarefa pro'];
    const isCriarTarefa = criarTarefaKeywords.some(keyword => mensagemLower.includes(keyword));

    if (isCriarTarefa && onCriarTarefa) {
      // Verifica se a mensagem menciona "Humberto"
      let usuarioCapitalizado = 'Humberto Borges Ribeiro'; // Padrão
      
      if (mensagemLower.includes('humberto')) {
        // Se mencionar Humberto, usa o nome completo
        usuarioCapitalizado = 'Humberto Borges Ribeiro';
      } else {
        // Caso contrário, tenta extrair outro nome
        const usuarioMatch = mensagemLower.match(/(?:para|pro)\s+([a-záéíóúâêôãõç\s]+?)(?:\s+nas|\s+em|$)/);
        if (usuarioMatch) {
          const usuario = usuarioMatch[1].trim();
          usuarioCapitalizado = usuario.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        }
      }

      // Simula resposta da IA
      setTimeout(() => {
        const assistantMessage = {
          role: 'assistant',
          content: `Perfeito! Vou criar a tarefa "Fazer memoriais" para ${usuarioCapitalizado} nas intimações que têm a triagem "Elaborar peça".\n\nAnalisando as intimações disponíveis...`,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);

        // Executa a callback após 2 segundos
        setTimeout(() => {
          if (onCriarTarefa) {
            onCriarTarefa(usuarioCapitalizado, 'Peça');
          }
          
          // Adiciona mensagem de confirmação
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Tarefas criadas com sucesso! Você pode visualizar as tarefas nos cards de intimações abaixo.',
          }]);
        }, 1000);
      }, 2000);
    } else {
      // Resposta padrão
      setTimeout(() => {
        const assistantMessage = {
          role: 'assistant',
          content: `Entendi que você quer criar uma tarefa relacionada a "${userMessage.content}". Deixe-me processar isso e gerar uma proposta para você.\n\nCom base nos dados que você forneceu, estou analisando os melhores parâmetros para esta tarefa...`,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    const newMessage = getInitialMessage(tool);
    setMessages([newMessage]);
  };

  const tools = [
    { value: 'criar-tarefa', label: 'Criar Tarefa', icon: IconCheck, color: '#228be6' },
    { value: 'criar-cota', label: 'Criar Cota', icon: IconClock, color: '#f0ad4e' },
    { value: 'registrar-audiencia', label: 'Registrar Audiência', icon: IconGavel, color: '#5cb85c' },
  ];

  // Se está minimizado, mostra apenas o botão flutuante
  if (opened && isMinimized) {
    return (
      <ActionIcon
        size="xl"
        radius="xl"
        color="blue"
        variant="filled"
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '80px',
          zIndex: 20000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <IconRobot size={24} />
      </ActionIcon>
    );
  }

  // Modal expandido
  return opened ? (
    <Paper
      shadow="xl"
      radius="md"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '420px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20000,
        border: '1px solid #e9ecef',
      }}
    >
      <Stack gap={0} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header compacto */}
        <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
          <Group gap="xs">
            <IconSparkles size={16} style={{ color: '#228be6' }} />
            <Text fw={600} size="sm">Assistente de IA</Text>
          </Group>
          <Group gap="xs">
            <ActionIcon 
              variant="subtle" 
              color="gray" 
              size="sm" 
              onClick={() => setIsMinimized(true)}
              title="Minimizar"
            >
              <IconMinus size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClose} title="Fechar">
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Lista de Mensagens */}
        <ScrollArea style={{ height: '280px' }} p="sm">
          <Stack gap="md">
            {messages.map((message, index) => (
              <Group
                key={index}
                align="flex-start"
                gap="xs"
                style={{
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {message.role === 'assistant' && (
                  <Box
                    p="xs"
                    radius="md"
                    style={{
                      backgroundColor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                    }}
                  >
                    <IconBrain size={16} style={{ color: '#228be6' }} />
                  </Box>
                )}
                
                <Paper
                  p="xs"
                  radius="md"
                  style={{
                    backgroundColor: message.role === 'user' ? '#e7f5ff' : '#f1f3f5',
                    maxWidth: '85%',
                    borderLeft: message.role === 'user' ? 'none' : '2px solid #228be6',
                  }}
                >
                  <Text size="xs" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {message.content}
                  </Text>
                </Paper>

                {message.role === 'user' && (
                  <Box
                    p="xs"
                    radius="md"
                    style={{
                      backgroundColor: '#228be6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                    }}
                  >
                    <IconRobot size={16} style={{ color: 'white' }} />
                  </Box>
                )}
              </Group>
            ))}

            {isLoading && (
              <Group align="flex-start" gap="xs">
                <Box
                  p="xs"
                  radius="md"
                  style={{
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '24px',
                  }}
                >
                  <IconBrain size={16} style={{ color: '#228be6' }} />
                </Box>
                <Paper
                  p="xs"
                  radius="md"
                  style={{
                    backgroundColor: '#f1f3f5',
                    borderLeft: '2px solid #228be6',
                  }}
                >
                  <Group gap="xs">
                    <Box style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#228be6', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <Text size="xs" c="dimmed">IA está pensando...</Text>
                  </Group>
                </Paper>
              </Group>
            )}

            <div ref={messageEndRef} />
          </Stack>
        </ScrollArea>

        {/* Ferramentas Disponíveis - Compacto */}
        <Box p="xs" style={{ borderTop: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
          <Group gap={4} justify="center">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Chip
                  key={tool.value}
                  checked={selectedTool === tool.value}
                  onChange={() => handleToolChange(tool.value)}
                  variant="light"
                  size="xs"
                  icon={<Icon size={12} />}
                  style={{
                    backgroundColor: selectedTool === tool.value ? `${tool.color}15` : 'transparent',
                    borderColor: selectedTool === tool.value ? tool.color : '#dee2e6',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  {tool.label}
                </Chip>
              );
            })}
          </Group>
        </Box>

        {/* Input de Mensagem - Compacto */}
        <Box p="xs" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e9ecef' }}>
          <Group gap="xs">
            <TextInput
              ref={inputRef}
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{ flex: 1 }}
              size="xs"
            />
            <ActionIcon
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              color="blue"
              variant="filled"
              size="md"
            >
              <IconSend size={16} />
            </ActionIcon>
          </Group>
        </Box>
      </Stack>
    </Paper>
  ) : null;
}

