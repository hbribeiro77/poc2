'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Overlay, Paper, Portal, Button, Group, Text, Box, ActionIcon, Badge, Transition, useMantineTheme } from '@mantine/core';
import { IconArrowUpRight, IconMinus, IconArrowsDiagonal2, IconX, IconBrandWhatsapp, IconMaximize, IconMinimize as IconRestoreDown } from '@tabler/icons-react';
import DraggableElement from '../DraggableElement/DraggableElement';
import classes from './DraggableModal.module.css';

// Nosso novo componente de Modal Arrastável
// Implementação nativa de drag para compatibilidade total com React 19
export default function DraggableModal({ 
  opened, 
  onClose, 
  children, 
  title = "Janela Flutuante", // Nova prop para o título no modo minimizado
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onRestore,
  messageCount = 0,
  width = '32.81vw', // Largura final
  height = '93.97vh', // Altura final
  padding = 'md',
  withCloseButton = true,
  initialSize = { width: '30vw', height: '80vh' },
  initialPosition,
  maximizedStyles: maximizedStylesOverride,
  onToggleMaximize,
  initialAlignment = 'center',
  ...otherProps 
}) {
  const theme = useMantineTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width, height }); // 3. Usa os novos padrões no estado inicial
  const [isResizing, setIsResizing] = useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const modalRef = useRef(null);
  const prevIsResizing = useRef(false); // Ref para rastrear o estado anterior de isResizing
  const minimizedPosition = useRef(null);
  const hoverTimerRef = useRef(null);

  // Efeito para logar as dimensões ao final do redimensionamento
  useEffect(() => {
    // Se o estado anterior era 'redimensionando' e o atual não é mais
    if (prevIsResizing.current && !isResizing) {
      // Pega as dimensões finais em pixels
      const finalWidthPx = parseInt(dimensions.width, 10);
      const finalHeightPx = parseInt(dimensions.height, 10);

      // Converte para unidades de viewport (vw/vh)
      const widthInVw = (finalWidthPx / window.innerWidth) * 100;
      const heightInVh = (finalHeightPx / window.innerHeight) * 100;

      console.log(`-----------------------------------------------------`);
      console.log(`INFORMAÇÃO PARA AJUSTE DE TAMANHO PADRÃO`);
      console.log(`Para definir este tamanho como padrão, use os valores abaixo:`);
      console.log(`Largura: '${widthInVw.toFixed(2)}vw'`);
      console.log(`Altura: '${heightInVh.toFixed(2)}vh'`);
      console.log(`-----------------------------------------------------`);
    }
    // Atualiza o ref com o estado atual para a próxima renderização
    prevIsResizing.current = isResizing;
  }, [isResizing, dimensions]);

  // Efeito para resetar as dimensões quando o modal é reaberto
  useEffect(() => {
    if (opened) {
      setDimensions({ width, height });
    }
  }, [opened, width, height]);

  // Desativa o drag se estiver maximizado
  const handleMouseDown = useCallback((e) => {
    if (isMaximized || !e.target.closest('.drag-handle')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    // Previne seleção de texto durante o drag
    e.preventDefault();
  }, [position, isMaximized]);

  // Atualiza a posição durante o drag
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

  // Finaliza o drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Desativa o resize se estiver maximizado
  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized) return;
    setIsResizing(true);
  }, [isMaximized]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResizeMouseMove = useCallback((e) => {
    if (!isResizing || !modalRef.current) return;
    const newWidth = e.clientX - modalRef.current.getBoundingClientRect().left;
    const newHeight = e.clientY - modalRef.current.getBoundingClientRect().top;
    setDimensions({ width: `${newWidth}px`, height: `${newHeight}px` });
  }, [isResizing]);
  
  // Efeitos para os event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // Adiciona listeners para redimensionamento
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp, handleResizeMouseMove, handleResizeMouseUp]);

  const handleMinimize = () => {
    if (onMinimize) onMinimize();
  };

  const handleToggleMaximize = () => {
    if (onMaximize) onMaximize();
  };

  const handleRestore = () => {
    if (onRestore) onRestore();
  };

  const handleHeaderMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleMinimize();
  };

  const handleMinimizedBoxMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHoverExpanded(true);
    }, 600); // Atraso de 600ms para expandir
  };

  const handleMinimizedBoxMouseLeave = () => {
    clearTimeout(hoverTimerRef.current);
    setIsHoverExpanded(false);
  };

  // Renderiza o botão flutuante se estiver minimizado
  if (isMinimized) {
    const initialX = window.innerWidth - 280; // Largura aproximada do botão
    const initialY = window.innerHeight - 80; // Altura aproximada do botão

    minimizedPosition.current = { x: initialX, y: initialY };

    return (
      <Portal>
        <DraggableElement 
          initialPosition={minimizedPosition.current}
          onClick={handleRestore}
        >
          <Box 
            style={{ position: 'relative' }} 
            onMouseEnter={handleMinimizedBoxMouseEnter} 
            onMouseLeave={handleMinimizedBoxMouseLeave}
          >
            <Button
              className={messageCount > 0 ? classes.pulsingButton : ''}
              color="green"
              radius="xl"
              size="lg"
              style={{
                transition: 'width 0.3s ease, padding 0.3s ease',
                width: isHoverExpanded ? 'auto' : '58px',
                height: '58px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                padding: isHoverExpanded ? '0 1rem' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isHoverExpanded ? (
                <Group wrap="nowrap" gap="xs">
                  <IconBrandWhatsapp size={28} />
                  <Text span>{title}</Text>
                </Group>
              ) : (
                <IconBrandWhatsapp size={28} />
              )}
            </Button>
            {messageCount > 0 && (
              <Badge
                color="red"
                circle
                style={{ position: 'absolute', top: -5, right: -5, zIndex: 1 }}
              >
                {messageCount}
              </Badge>
            )}
          </Box>
        </DraggableElement>
      </Portal>
    );
  }

  // Estilos padrão para maximização, que podem ser sobrescritos
  const defaultMaximizedStyles = {
    width: '100vw',
    height: '100vh',
    maxHeight: 'none',
    top: 0,
    left: 0,
    transform: 'none',
    borderRadius: 0,
  };

  // Combina os estilos padrão com a sobrescrita, se houver
  const finalMaximizedStyles = isMaximized 
    ? { ...defaultMaximizedStyles, ...maximizedStylesOverride } 
    : {};

  return (
    <Transition mounted={opened} transition="pop" duration={250} timingFunction="ease">
      {(styles) => (
        <Portal>
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 201, 
            pointerEvents: 'none', 
            display: 'flex', 
            alignItems: isMaximized ? 'flex-start' : 'center', 
            justifyContent: isMaximized ? 'flex-start' : (initialAlignment === 'right' ? 'flex-end' : 'center')
          }}>
            <Paper
              ref={modalRef}
              shadow="xl"
              radius="md"
              onMouseDown={handleMouseDown}
              style={{
                ...styles,
                width: dimensions.width,
                height: dimensions.height,
                maxWidth: '95vw',
                maxHeight: '95vh',
                minWidth: '300px', // Limites para não encolher demais
                minHeight: '200px',
                overflow: 'hidden', // Esconde o overflow para a alça funcionar bem
                pointerEvents: 'auto',
                cursor: isDragging ? 'grabbing' : 'default',
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging || isResizing ? 'none' : 'transform 0.2s ease',
                position: 'relative', // Necessário para a alça de redimensionamento
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                ...finalMaximizedStyles,
                marginRight: initialAlignment === 'right' ? '2rem' : 0,
              }}
              p={0}
              {...otherProps}
            >
              {/* CABEÇALHO GENÉRICO DO MODAL */}
              <Box
                className="drag-handle"
                style={{
                  backgroundColor: theme.colors.dark[7],
                  color: theme.white,
                  borderTopLeftRadius: 'var(--mantine-radius-md)',
                  borderTopRightRadius: 'var(--mantine-radius-md)',
                  cursor: isDragging ? 'grabbing' : 'move',
                  padding: 'var(--mantine-spacing-sm) var(--mantine-spacing-md)',
                }}
              >
                <Group justify="space-between" align="center">
                  <Text fw={700}>{title}</Text>
                  <Group gap="xs">
                    <ActionIcon variant="transparent" onClick={handleMinimize} aria-label="Minimizar">
                      <IconMinus size={20} color={theme.white} />
                    </ActionIcon>
                    <ActionIcon variant="transparent" onClick={handleToggleMaximize} aria-label="Maximizar/Restaurar">
                      {isMaximized ? <IconRestoreDown size={20} color={theme.white} /> : <IconMaximize size={20} color={theme.white} />}
                    </ActionIcon>
                    <ActionIcon variant="transparent" onClick={onClose} aria-label="Fechar">
                      <IconX size={20} color={theme.white} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>

              {/* CONTEÚDO DO MODAL (CHILDREN) */}
              <Box style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                {typeof children === 'function' ? children({ minimize: handleMinimize, isMaximized: isMaximized, toggleMaximize: handleToggleMaximize }) : children}
              </Box>
              
              {/* Oculta a alça de redimensionamento quando maximizado */}
              {!isMaximized && (
                <div
                  onMouseDown={handleResizeMouseDown}
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: '20px',
                    height: '20px',
                    cursor: 'se-resize',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-gray-5)',
                  }}
                >
                  <IconArrowsDiagonal2 size={16} stroke={1.5} />
                </div>
              )}
            </Paper>
          </div>
        </Portal>
      )}
    </Transition>
  );
} 