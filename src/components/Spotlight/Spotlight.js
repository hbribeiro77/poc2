'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  TextInput,
  ScrollArea,
  Group,
  Text,
  ActionIcon,
  Paper,
  Divider,
  Box,
  Kbd,
} from '@mantine/core';
import { IconSearch, IconX, IconCommand, IconArrowRight } from '@tabler/icons-react';
import { useHotkeys } from '@mantine/hooks';
import Fuse from 'fuse.js';

/**
 * Componente Spotlight - Command Palette customizado
 * Compatível com Mantine v7
 */
export default function Spotlight({ opened, onClose, actions = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const filteredActionsRef = useRef([]);

  // Configuração do Fuse.js para busca fuzzy
  const fuse = new Fuse(actions, {
    keys: ['id', 'label', 'description', 'keywords'],
    threshold: 0.3,
    includeScore: true,
  });

  // Filtra as ações baseado na busca
  useEffect(() => {
    if (searchQuery.trim() === '') {
      filteredActionsRef.current = actions;
    } else {
      const results = fuse.search(searchQuery);
      filteredActionsRef.current = results.map(result => result.item);
    }
    setSelectedIndex(0); // Reset do índice selecionado ao buscar
  }, [searchQuery, actions]);

  // Foca no input quando o modal é aberto
  useEffect(() => {
    if (opened && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else if (!opened) {
      setSearchQuery(''); // Limpa a busca ao fechar
      setSelectedIndex(0); // Reset do índice
    }
  }, [opened]);

  // Navegação com teclado
  useHotkeys([
    ['arrowDown', () => {
      if (opened && filteredActionsRef.current.length > 0) {
        setSelectedIndex(prev => 
          prev < filteredActionsRef.current.length - 1 ? prev + 1 : 0
        );
      }
    }],
    ['arrowUp', () => {
      if (opened && filteredActionsRef.current.length > 0) {
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredActionsRef.current.length - 1
        );
      }
    }],
    ['Enter', () => {
      if (opened && filteredActionsRef.current[selectedIndex]) {
        handleActionClick(filteredActionsRef.current[selectedIndex]);
      }
    }],
    ['Escape', () => {
      if (opened) {
        onClose();
      }
    }],
  ]);

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    onClose();
  };

  const getActionIcon = (action) => {
    if (!action.icon) {
      // Ícone padrão baseado no tipo de ação
      if (action.type === 'navigation') {
        return <IconArrowRight size={18} />;
      }
      return null;
    }
    
    // Se o ícone é um componente React, renderiza-o
    const IconComponent = action.icon;
    return <IconComponent size={18} />;
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeButtonProps={{ display: 'none' }}
      withCloseButton={false}
      padding={0}
      radius="md"
      size="600px"
      centered
      styles={{
        body: { padding: 0 },
        content: { boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
        overlay: { zIndex: 10000 },
        inner: { zIndex: 10001 },
      }}
      zIndex={10000}
    >
      {/* Header do Spotlight */}
      <Paper p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
        <Group gap="sm">
          <IconSearch size={20} style={{ color: '#868e96' }} />
          <TextInput
            ref={searchInputRef}
            placeholder="Buscar ação ou navegar..."
            variant="unstyled"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            size="md"
          />
          <Group gap={4}>
            <Kbd>Ctrl</Kbd>
            <Text size="xs" c="dimmed">+</Text>
            <Kbd>Alt</Kbd>
            <Text size="xs" c="dimmed">+</Text>
            <Kbd>T</Kbd>
          </Group>
          <ActionIcon variant="subtle" onClick={onClose}>
            <IconX size={18} />
          </ActionIcon>
        </Group>
      </Paper>

      {/* Lista de Ações */}
      <ScrollArea style={{ maxHeight: '400px' }}>
        {filteredActionsRef.current.length === 0 ? (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Text c="dimmed" size="sm">
              Nenhuma ação encontrada
            </Text>
          </Box>
        ) : (
          <div>
            {filteredActionsRef.current.map((action, index) => (
              <Paper
                key={action.id}
                p="md"
                style={{
                  cursor: 'pointer',
                  backgroundColor: index === selectedIndex ? '#f1f3f5' : 'transparent',
                  transition: 'background-color 0.1s',
                  borderLeft: index === selectedIndex ? '3px solid #228be6' : '3px solid transparent',
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => handleActionClick(action)}
              >
                <Group gap="md" justify="space-between" wrap="nowrap">
                  <Group gap="md" style={{ flex: 1 }} wrap="nowrap">
                    {action.icon && (
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          height: 32,
                          borderRadius: '6px',
                          backgroundColor: action.color ? `${action.color}20` : '#f1f3f5',
                          color: action.color || '#495057',
                        }}
                      >
                        {getActionIcon(action)}
                      </Box>
                    )}
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} style={{ lineHeight: 1.3 }}>
                        {action.label}
                      </Text>
                      {action.description && (
                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.3 }} mt={4}>
                          {action.description}
                        </Text>
                      )}
                    </Box>
                  </Group>
                  {action.shortcut && (
                    <Group gap={4}>
                      {action.shortcut.split('+').map((key, i) => (
                        <span key={i}>
                          <Kbd>{key.trim()}</Kbd>
                          {i < action.shortcut.split('+').length - 1 && (
                            <Text size="xs" c="dimmed" mx={2}>+</Text>
                          )}
                        </span>
                      ))}
                    </Group>
                  )}
                </Group>
              </Paper>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <Divider />
      <Paper p="xs" style={{ borderTop: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
        <Group justify="space-between" gap="md">
          <Group gap="xs">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <Text size="xs" c="dimmed">Navegar</Text>
          </Group>
          <Group gap="xs">
            <Kbd>↵</Kbd>
            <Text size="xs" c="dimmed">Selecionar</Text>
          </Group>
          <Group gap="xs">
            <Kbd>ESC</Kbd>
            <Text size="xs" c="dimmed">Fechar</Text>
          </Group>
        </Group>
      </Paper>
    </Modal>
  );
}

