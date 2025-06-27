'use client';

import React from 'react';
import { Paper, Group, Text, Checkbox, ActionIcon, Stack, Box, ThemeIcon, Tooltip, Badge } from '@mantine/core';
import { 
  IconPlus, 
  IconEye, 
  IconExternalLink, 
  IconMenu2, 
  IconCheck,
  IconSettings,
  IconDownload,
  IconFileText,
  IconFileWord,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';

export default function PecaParaAprovarCard({ peca }) {
  const { pasta, data, criadoPor, tipo, requerentes, tarefas, status, processo } = peca;

  const paperStyle = {
    borderLeft: `5px solid #E67E22`, // Cor laranja da imagem
    backgroundColor: '#FBFAF9' // Um branco levemente amarelado
  };

  const isRascunho = status === 'Rascunho';

  return (
    <Paper p="md" radius="sm" shadow="xs" withBorder style={paperStyle} mb="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        {/* Checkbox e Conteúdo Principal */}
        <Group align="flex-start" wrap="nowrap">
          <Checkbox size="sm" mt={4} />
          <Stack gap="xs">
            <Group>
              <Text>
                {isRascunho
                  ? (<><Text span fw={700}>Peça para aprovar: </Text><Text span>{pasta}</Text></>)
                  : (<><Text span fw={700}>Peça: </Text><Text span>Processo da peça: {processo} | {pasta}</Text></>)
                }
              </Text>
              {isRascunho ? (
                <Badge color="orange" variant="light">Rascunho</Badge>
              ) : (
                <Badge color="teal" variant="light">Aprovada</Badge>
              )}
            </Group>
            <Group gap="md">
              <Text size="sm"><Text span fw={500}>Data:</Text> {data}</Text>
              <Text size="sm"><Text span fw={500}>Criado por:</Text> {criadoPor}</Text>
              <Text size="sm"><Text span fw={500}>Tipo:</Text> {tipo}</Text>
            </Group>
            <Text size="sm"><Text span fw={500}>Requerentes:</Text> {requerentes}</Text>
            
            {isRascunho && tarefas && tarefas.length > 0 && (
              <Box mt="xs">
                <Text size="sm" fw={500}>Tarefas:</Text>
                <Stack gap={4} mt={4}>
                  {tarefas.map((tarefa) => (
                    <Group key={tarefa.id} gap="xs">
                      <ThemeIcon variant="subtle" color="green" size="sm">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="sm">
                        {tarefa.descricao} (concluída por {tarefa.concluidaPor})
                      </Text>
                      <IconMenu2 size={16} color="gray" />
                    </Group>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Group>

        {/* Ícones de Ação */}
        <Group gap="xs">
          <Tooltip label="Criar tarefa">
            <ActionIcon variant="subtle" color="gray">
              <IconPlus size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Configurar protocolo">
            <ActionIcon variant="subtle" color="gray">
              <IconSettings size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Visualizar detalhes">
            <ActionIcon variant="subtle" color="gray">
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download do arquivo">
            <ActionIcon variant="subtle" color="gray">
              <IconDownload size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Abrir peça com Libreoffice">
            <ActionIcon variant="subtle" color="gray">
              <IconFileText size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Abrir peça com o editor online">
            <ActionIcon variant="subtle" color="gray">
              <IconFileWord size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Editar propriedades">
            <ActionIcon variant="subtle" color="gray">
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Aprovar arquivo">
            <ActionIcon variant="subtle" color="gray">
              <IconCheck size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Excluir arquivo">
            <ActionIcon variant="subtle" color="gray">
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
} 