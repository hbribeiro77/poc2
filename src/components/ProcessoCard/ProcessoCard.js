'use client';

import React from 'react';
import { 
  Paper, Group, Text, ActionIcon, Stack, Badge, Box, Checkbox, Menu
} from '@mantine/core';
import { 
  IconHourglass, IconSearch, IconSparkles, IconPlus, IconClock, 
  IconRefresh as IconRefreshCycle, IconArrowsMaximize, IconX, 
  IconPlayerPlay, IconBrain, IconDotsVertical, IconFileText
} from '@tabler/icons-react';

export default function ProcessoCard({ processo, isSelected = false, onToggleSelect, triagemResultado = null, triagemManualResultado = null, onTriagemManual = null, tarefas = [] }) {
  // Função para mapear cores das categorias
  const getCategoriaColor = (categoria) => {
    const colorMap = {
      'Justiça Gratuita - Requerida': 'blue',
      'Criminal': 'red',
      'Família': 'pink',
      'Cível': 'green',
      'Trabalhista': 'orange',
      'Previdenciário': 'cyan',
      'Tributário': 'violet'
    };
    return colorMap[categoria] || 'gray';
  };

  // Função para mapear cores dos resultados da triagem
  const getTriagemColor = (resultado) => {
    const colorMap = {
      'Renunciar ao prazo': '#da90aa',
      'Elaborar peça': '#f0ad4e'
    };
    return colorMap[resultado] || 'gray';
  };

  // Função para mapear cores da triagem manual
  const getTriagemManualColor = (resultado) => {
    const colorMap = {
      'Elaborar peça': '#f0ad4e',
      'Contatar assistido': '#5cb85c',
      'Renunciar ao prazo': '#da90aa',
      'Ocultar': '#888888'
    };
    return colorMap[resultado] || 'gray';
  };

  // Opções de triagem manual
  const opcoesTriagemManual = [
    { id: 'elaborar', label: 'Elaborar peça', color: '#f0ad4e' },
    { id: 'contatar', label: 'Contatar assistido', color: '#5cb85c' },
    { id: 'renunciar', label: 'Renunciar ao prazo', color: '#da90aa' },
    { id: 'ocultar', label: 'Ocultar', color: '#888888' }
  ];

  const handleTriagemManual = (opcao) => {
    if (onTriagemManual) {
      onTriagemManual(processo.id, opcao);
    }
  };

  return (
    <Paper
      p="md"
      radius="md"
      shadow="xs"
      style={{
        borderLeft: `4px solid ${processo.corBorda === 'red' ? '#e74c3c' : '#3498db'}`,
        backgroundColor: 'white',
        position: 'relative'
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Box style={{ flex: 1, marginRight: '16px' }}>
          {/* Cabeçalho do Card */}
          <Group mb="sm">
            <Checkbox 
              size="sm" 
              checked={isSelected}
              onChange={() => onToggleSelect && onToggleSelect(processo.id)}
            />
            <IconHourglass size={16} color="#e74c3c" />
            <Badge 
              color={getCategoriaColor(processo.categoria)} 
              variant="light" 
              size="sm"
              style={{ fontWeight: 600 }}
            >
              {processo.categoria}
            </Badge>
          </Group>

          {/* Número do Processo */}
          <Group mb="sm">
            <Text fw={500} size="sm">
              {processo.processo}
            </Text>
            <ActionIcon variant="light" size="sm">
              <IconSearch size={14} />
            </ActionIcon>
          </Group>

          {/* Detalhes do Processo - Layout em linha */}
          <Box>
            {/* Linha 1: Órgão julgador e Classe */}
            <Group mb="xs" gap="lg">
              <Text size="sm" c="dimmed">
                Órgão julgador: <Text component="span" c="dark">{processo.orgaoJulgador}</Text>
              </Text>
              <Text size="sm" c="dimmed">
                Classe: <Text component="span" c="dark">{processo.classe}</Text>
              </Text>
            </Group>
            
            {/* Linha 2: Disponibilização e Intimado */}
            <Group mb="xs" gap="lg">
              <Text size="sm" c="dimmed">
                Disponibilização: <Text component="span" c="dark">{processo.disponibilizacao}</Text>
              </Text>
              <Text size="sm" c="dimmed">
                Intimado: <Text component="span" c="dark">{processo.intimado}</Text>
              </Text>
            </Group>
            
            {/* Linha 3: Status e Prazo */}
            <Group gap="lg">
              <Group gap="xs">
                <Text size="sm" c="dimmed">Status:</Text>
                <Badge color="orange" variant="light" size="sm">{processo.status}</Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Prazo: <Text component="span" c="red" fw={500}>{processo.prazo}</Text>
              </Text>
            </Group>

            {/* Seção de Tarefas */}
            {tarefas && tarefas.length > 0 && (
              <Box mt="md" style={{ borderTop: '1px solid #e9ecef', paddingTop: '12px' }}>
                <Text size="sm" fw={500} mb="xs">Tarefas:</Text>
                <Stack gap="xs">
                  {tarefas.map((tarefa, index) => {
                    // Separa o texto da tag "Peça"
                    const parts = tarefa.descricao.split(/(Peça)/);
                    return (
                      <Group key={index} gap="xs" wrap="nowrap">
                        <IconClock size={16} color="#666" />
                        <Group gap={4} wrap="nowrap">
                          {parts.map((part, partIndex) => {
                            if (part === 'Peça') {
                              return (
                                <Badge 
                                  key={partIndex}
                                  variant="light" 
                                  size="sm" 
                                  style={{ 
                                    backgroundColor: '#f0ad4e', 
                                    color: '#000',
                                    padding: '0 6px'
                                  }}
                                >
                                  Peça
                                </Badge>
                              );
                            }
                            return (
                              <Text 
                                key={partIndex} 
                                size="sm" 
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                {part}
                              </Text>
                            );
                          })}
                        </Group>
                      </Group>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Botão de Triagem Manual - Canto superior direito */}
        <Box 
          style={{ 
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10
          }}
        >
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon 
                variant="subtle" 
                size="sm" 
                color="gray"
                style={{ 
                  opacity: 0.6,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.6'}
              >
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label size="xs" c="dimmed">
                Triagem Manual
              </Menu.Label>
              <Menu.Divider />
              
              {opcoesTriagemManual.map((opcao) => (
                <Menu.Item 
                  key={opcao.id}
                  onClick={() => handleTriagemManual(opcao.label)}
                  style={{ 
                    color: opcao.color,
                    fontWeight: 500
                  }}
                >
                  {opcao.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Box>

        {/* Resultado da Triagem por IA */}
        {triagemResultado && (
          <Box 
            style={{ 
              position: 'absolute',
              top: '50%',
              right: '12px',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          >
            <Badge 
              variant="filled" 
              size="sm"
              style={{ 
                fontWeight: 600,
                backgroundColor: getTriagemColor(triagemResultado),
                color: 'white'
              }}
              leftSection={<IconBrain size={12} />}
            >
              {triagemResultado}
            </Badge>
          </Box>
        )}

        {/* Resultado da Triagem Manual */}
        {triagemManualResultado && (
          <Box 
            style={{ 
              position: 'absolute',
              top: '60%',
              right: '12px',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          >
            <Badge 
              color={getTriagemManualColor(triagemManualResultado)} 
              variant="filled" 
              size="sm"
              style={{ 
                fontWeight: 600,
                backgroundColor: getTriagemManualColor(triagemManualResultado),
                color: 'white'
              }}
            >
              {triagemManualResultado}
            </Badge>
          </Box>
        )}

        {/* Botões de Ação */}
        <Group gap="xs" wrap="nowrap" style={{ flexDirection: 'row', flexShrink: 0 }}>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconSparkles size={14} />
          </ActionIcon>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconPlus size={14} />
          </ActionIcon>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconClock size={14} />
          </ActionIcon>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconRefreshCycle size={14} />
          </ActionIcon>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconArrowsMaximize size={14} />
          </ActionIcon>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconX size={14} />
          </ActionIcon>
          <ActionIcon variant="light" size="sm" color="gray">
            <IconPlayerPlay size={14} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}
