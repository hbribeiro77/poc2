'use client';

import { 
  Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Button, 
  Badge, Table, ActionIcon, Select, Pagination, Stack,
  Paper, ScrollArea, Tooltip, Menu, Grid
} from '@mantine/core';
import Link from 'next/link';
import { 
  IconSparkles, IconGlobe, IconTrophy, IconPlus, IconHeart, 
  IconScissors, IconEdit, IconTrash, IconChevronLeft, IconChevronRight,
  IconChevronsLeft, IconChevronsRight, IconRobot, IconEye, IconCalendar,
  IconHistory, IconClock
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

export default function HistoricoAtividadesPage() {

  // Estados do componente
  const [activeTab, setActiveTab] = useState('historico-atividades');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [periodoFilter, setPeriodoFilter] = useState('hoje');
  const [tipoAtividadeFilter, setTipoAtividadeFilter] = useState('todas');

  const historicoData = [
    {
      id: 1,
      data: '15/01/2024',
      hora: '14:30:25',
      atividade: 'Criar Tarefa',
      detalhes: 'Criada a tarefa Elaborar peça de memoriais e entregue para HUMBERTO BORGES RIBEIRO',
      tipo: 'tarefa'
    },
    {
      id: 2,
      data: '15/01/2024',
      hora: '14:25:10',
      atividade: 'Criar Cota',
      detalhes: 'Criada cota para o processo 50012345678901234001',
      tipo: 'cota'
    },
    {
      id: 3,
      data: '15/01/2024',
      hora: '14:20:45',
      atividade: 'Criar Audiência',
      detalhes: 'Criada audiência para processo 1234567-89.2024.5.02.0001 para 15/11/2025',
      tipo: 'audiencia'
    },
    {
      id: 4,
      data: '15/01/2024',
      hora: '14:15:30',
      atividade: 'Criar Tarefa',
      detalhes: 'Criada a tarefa Analisar documentos e entregue para JOÃO PEDRO OLIVEIRA',
      tipo: 'tarefa'
    },
    {
      id: 5,
      data: '15/01/2024',
      hora: '14:10:15',
      atividade: 'Criar Cota',
      detalhes: 'Criada cota para o processo 50012345678901234002',
      tipo: 'cota'
    }
  ];

  const atividadesAutomatizadasData = [
    {
      id: 1,
      data: '15/01/2024',
      hora: '14:30:25',
      atividade: 'Criar Tarefa',
      detalhes: 'Criada a tarefa <strong>Elaborar peça de memoriais</strong> e entregue para <strong>HUMBERTO BORGES RIBEIRO</strong>',
      tipo: 'tarefa'
    },
    {
      id: 2,
      data: '15/01/2024',
      hora: '14:25:10',
      atividade: 'Criar Cota',
      detalhes: 'Criada cota para o processo <strong>50012345678901234001</strong>',
      tipo: 'cota'
    },
    {
      id: 3,
      data: '15/01/2024',
      hora: '14:20:45',
      atividade: 'Criar Audiência',
      detalhes: 'Criada audiência para processo <strong>1234567-89.2024.5.02.0001</strong> para <strong>15/11/2025</strong>',
      tipo: 'audiencia'
    },
    {
      id: 4,
      data: '15/01/2024',
      hora: '14:15:30',
      atividade: 'Criar Tarefa',
      detalhes: 'Criada a tarefa <strong>Analisar documentos</strong> e entregue para <strong>JOÃO PEDRO OLIVEIRA</strong>',
      tipo: 'tarefa'
    }
  ];

  const currentData = activeTab === 'historico-atividades' ? historicoData : atividadesAutomatizadasData;

  const getBadgeColor = (tipo) => {
    const colorMap = {
      'tarefa': 'blue',
      'cota': 'orange',
      'audiencia': 'purple'
    };
    return colorMap[tipo] || 'gray';
  };

  const renderTable = () => (
    <Table>
      <Table.Thead>
        <Table.Tr style={{ backgroundColor: '#dee2e6' }}>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Data/Hora</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Atividade</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Detalhes</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {currentData.map((item) => (
          <Table.Tr key={item.id}>
            <Table.Td>
              <Stack gap={0}>
                <Text size="sm">{item.data}</Text>
                <Text size="xs" c="dimmed">{item.hora}</Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Badge color={getBadgeColor(item.tipo)} variant="light" size="sm">
                {item.atividade}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm">
                {item.detalhes.includes('<strong>') ? (
                  <span dangerouslySetInnerHTML={{ __html: item.detalhes.replace(/<strong>/g, '<strong>').replace(/<\/strong>/g, '</strong>') }} />
                ) : (
                  item.detalhes
                )}
              </Text>
            </Table.Td>
            <Table.Td>
              <ActionIcon variant="light" color="blue" size="sm">
                <IconEye size={14} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  return (
    <>
      <Flex gap={0} pb="xl">
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <a href="/area-de-trabalho" style={{ textDecoration: 'none' }}>
            <Image
              src="/menuia.png"
              alt="Menu Lateral"
              height="70%"
              fit="contain"
              style={{ cursor: 'pointer' }}
            />
          </a>
        </Box>

        <Box style={{ flex: 1, padding: '24px', backgroundColor: '#f8f9fa' }}>
          {/* Header */}
          <Group align="center" mb="lg">
            <IconHistory size={24} color="#1b7847" />
            <Title order={1} style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              Histórico de Atividades
            </Title>
          </Group>

          {/* Navigation Buttons */}
          <Grid mb="lg">
            <Grid.Col span={8}>
              <Group gap="md">
                <Button
                  variant={activeTab === 'historico-atividades' ? 'filled' : 'outline'}
                  color={activeTab === 'historico-atividades' ? 'green' : 'gray'}
                  leftSection={<IconClock size={24} />}
                  onClick={() => setActiveTab('historico-atividades')}
                  style={{
                    height: '60px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    transition: '0.4s',
                    backgroundColor: activeTab === 'historico-atividades' ? '#1b7847' : 'white',
                    color: activeTab === 'historico-atividades' ? 'white' : '#1b7847',
                    borderColor: activeTab === 'historico-atividades' ? '#1b7847' : '#e5e7eb',
                    fontWeight: '500',
                    fontSize: '16px',
                    flex: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Histórico de Atividades
                </Button>
                <Button
                  variant={activeTab === 'atividades-automatizadas' ? 'filled' : 'outline'}
                  color={activeTab === 'atividades-automatizadas' ? 'green' : 'gray'}
                  leftSection={<IconRobot size={24} />}
                  onClick={() => setActiveTab('atividades-automatizadas')}
                  style={{
                    height: '60px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    transition: '0.4s',
                    backgroundColor: activeTab === 'atividades-automatizadas' ? '#1b7847' : 'white',
                    color: activeTab === 'atividades-automatizadas' ? 'white' : '#1b7847',
                    borderColor: activeTab === 'atividades-automatizadas' ? '#1b7847' : '#e5e7eb',
                    fontWeight: '500',
                    fontSize: '16px',
                    flex: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Atividades Automatizadas
                </Button>
              </Group>
            </Grid.Col>
          </Grid>

          {/* Content Area */}
          {activeTab === 'historico-atividades' && (
            <Paper withBorder radius="md" p="lg" style={{ backgroundColor: '#f8f9fa' }}>
              {/* Section Header */}
              <Group justify="space-between" mb="md" p="md" style={{ backgroundColor: '#f1f3f5', borderRadius: '8px' }}>
                <Group>
                  <IconClock size={20} color="#1b7847" />
                  <Text 
                    style={{
                      color: '#126A3D',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                      fontSize: '18px',
                      lineHeight: '27.9px',
                      fontWeight: '600',
                      fontStyle: 'normal',
                      margin: '0px',
                      padding: '0px',
                      textAlign: 'start',
                      textTransform: 'none',
                      textDecoration: 'none',
                      letterSpacing: 'normal',
                      wordSpacing: '0px',
                      verticalAlign: 'baseline'
                    }}
                  >
                    Histórico de Atividades
                  </Text>
                </Group>
              </Group>

              {/* Imagem do histórico de atividades */}
              <Paper withBorder radius="md" p="md" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  src="/historico-atividades.png"
                  alt="Histórico de Atividades"
                  fit="contain"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Paper>
            </Paper>
          )}

          {activeTab === 'atividades-automatizadas' && (
            <Paper withBorder radius="md" p="lg" style={{ backgroundColor: '#f8f9fa' }}>
              {/* Section Header */}
              <Group justify="space-between" mb="md" p="md" style={{ backgroundColor: '#f1f3f5', borderRadius: '8px' }}>
                <Group>
                  <IconRobot size={20} color="#1b7847" />
                  <Text 
                    style={{
                      color: '#126A3D',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                      fontSize: '18px',
                      lineHeight: '27.9px',
                      fontWeight: '600',
                      fontStyle: 'normal',
                      margin: '0px',
                      padding: '0px',
                      textAlign: 'start',
                      textTransform: 'none',
                      textDecoration: 'none',
                      letterSpacing: 'normal',
                      wordSpacing: '0px',
                      verticalAlign: 'baseline'
                    }}
                  >
                    Atividades Automatizadas
                  </Text>
                </Group>
              </Group>

              {/* Filtros */}
              <Group justify="space-between" mb="md">
                <Group gap="md">
                  <Select
                    placeholder="Período"
                    value={periodoFilter}
                    onChange={setPeriodoFilter}
                    data={[
                      { value: 'hoje', label: 'Hoje' },
                      { value: 'semana', label: 'Esta Semana' },
                      { value: 'mes', label: 'Este Mês' },
                      { value: 'personalizado', label: 'Personalizado' }
                    ]}
                    style={{ width: '150px' }}
                  />
                  <Select
                    placeholder="Tipo de Atividade"
                    value={tipoAtividadeFilter}
                    onChange={setTipoAtividadeFilter}
                    data={[
                      { value: 'todas', label: 'Todas' },
                      { value: 'tarefa', label: 'Criar Tarefa' },
                      { value: 'cota', label: 'Criar Cota' },
                      { value: 'audiencia', label: 'Criar Audiência' }
                    ]}
                    style={{ width: '180px' }}
                  />
                </Group>
              </Group>

              {/* Table */}
              <Paper withBorder radius="md" p="md" style={{ backgroundColor: 'white' }}>
                <ScrollArea>
                  {renderTable()}
                </ScrollArea>
              </Paper>

              {/* Pagination */}
              <Group justify="space-between" mt="md">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={1}
                  size="sm"
                  withEdges
                  nextIcon={IconChevronRight}
                  previousIcon={IconChevronLeft}
                  firstIcon={IconChevronsLeft}
                  lastIcon={IconChevronsRight}
                />
                <Select
                  value={itemsPerPage.toString()}
                  onChange={(value) => setItemsPerPage(Number(value))}
                  data={['10', '25', '50', '100']}
                  style={{ width: 80 }}
                />
              </Group>
            </Paper>
          )}
        </Box>
      </Flex>

      {/* Link discreto para voltar ao Hub */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>
    </>
  );
}
