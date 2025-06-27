'use client';

import React, { useState } from 'react';
import { Box, Title, Group, ThemeIcon, Table, Text, Stack, Badge, Button, Menu } from '@mantine/core';
import { IconLayoutDashboard, IconChevronRight, IconChevronDown, IconPointFilled, IconFilter } from '@tabler/icons-react';
import timelineData from '../../data/visao-geral-data.json';

const renderDescription = (item) => {
  const iconProps = { size: 16, style: { marginRight: '4px' } };
  let icon;

  const isPeca = item.tag_principal?.toLowerCase().includes('peça');
  const isDocumento = item.tipo === 'juntada';

  switch (item.tipo) {
    case 'elaborada':
    case 'atendimento':
      icon = <IconChevronDown {...iconProps} />;
      break;
    default:
      icon = <IconChevronRight {...iconProps} />;
      break;
  }

  return (
    <Group align="flex-start" wrap="nowrap">
      {icon}
      <Stack gap={4} align="flex-start">
        <Text size="sm">{item.descricao}</Text>
        {item.tarefa && (
            <Group gap="xs">
                <IconPointFilled size={12} style={{ marginLeft: '12px' }} />
                <Text size="xs" c="dimmed" td="underline">
                    Tarefa: {item.tarefa}
                </Text>
            </Group>
        )}
        <Group gap="xs" mt={4}>
            {item.tags && item.tags.map(tag => (
                <Badge key={tag} color={isDocumento ? '#993d99' : 'green'} variant="filled">{tag}</Badge>
            ))}
            {item.tag_principal && (
                <Badge color={isPeca ? '#e67e22' : 'green'} variant="filled">{item.tag_principal}</Badge>
            )}
        </Group>
      </Stack>
    </Group>
  );
};


export default function VisaoGeralTimeline() {
  const [activeFilter, setActiveFilter] = useState(null);

  const filteredData = activeFilter === 'tarefas'
    ? timelineData.filter(item => !!item.tarefa)
    : timelineData;

  const rows = filteredData.map((item) => (
    <Table.Tr key={item.evento}>
      <Table.Td>{item.evento}</Table.Td>
      <Table.Td>{item.data}</Table.Td>
      <Table.Td>{renderDescription(item)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box mt="xl">
      <Group justify="space-between" mb="lg">
        <Group>
          <ThemeIcon variant="light" size="xl" color="blue">
              <IconLayoutDashboard style={{ width: '70%', height: '70%' }} />
          </ThemeIcon>
          <Title order={3} c="blue.7">Visão Geral</Title>
          <Menu shadow="md" width={200}>
              <Menu.Target>
                  <Button size="xs" variant="outline" leftSection={<IconFilter size={14} />}>
                      {activeFilter ? 'Filtrando por tarefas' : 'Filtrar'}
                  </Button>
              </Menu.Target>
              <Menu.Dropdown>
                  <Menu.Label>Filtros de eventos</Menu.Label>
                  <Menu.Item
                      onClick={() => setActiveFilter(activeFilter === 'tarefas' ? null : 'tarefas')}
                  >
                      {activeFilter === 'tarefas' ? 'Limpar filtro' : 'Apenas com tarefas'}
                  </Menu.Item>
              </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Table withColumnBorders withRowBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={80}>Evento</Table.Th>
            <Table.Th w={120}>Data</Table.Th>
            <Table.Th>Descrição</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {rows.length > 0 ? rows : (
                <Table.Tr>
                    <Table.Td colSpan={3} align="center">
                        <Text p="md">Nenhum evento encontrado para o filtro aplicado.</Text>
                    </Table.Td>
                </Table.Tr>
            )}
        </Table.Tbody>
      </Table>
    </Box>
  );
} 