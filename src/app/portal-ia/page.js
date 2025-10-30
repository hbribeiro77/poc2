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
  IconChevronsLeft, IconChevronsRight, IconRobot, IconEye, IconCalendar
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import NovaRegraModal from '../../components/NovaRegraModal/NovaRegraModal';
import regrasData from '../../data/regras-ia-data.json';

export default function PortalIAPage() {

  // Estados do componente
  const [activeTab, setActiveTab] = useState('minhas-regras');
  const [filterType, setFilterType] = useState('triagem');
  const [createRuleModalOpen, setCreateRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rulesData, setRulesData] = useState(regrasData);

  // Reset página quando filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  // Função para abrir modal de edição
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setCreateRuleModalOpen(true);
  };

  // Função para adicionar nova regra
  const handleAddRule = (newRuleData) => {
    const newRule = {
      id: Math.max(...rulesData.map(r => r.id)) + 1, // Gerar novo ID
      tipo: newRuleData.tipo === 'triagem' ? 'TRIAGEM DE INTIMAÇÃO' : 'GERAÇÃO DE PETIÇÃO',
      descricao: newRuleData.descricao || '-',
      regra: newRuleData.regra,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      criadoHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      atualizadoEm: new Date().toLocaleDateString('pt-BR'),
      atualizadoHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      compartilhado: 'NÃO',
      status: newRuleData.ativa ? 'ATIVA' : 'INATIVA',
      likes: 0,
      ferramentas: newRuleData.ferramentas || { criarTarefa: false, criarCota: false, criarAudiencia: false },
      configTarefa: newRuleData.configTarefa || null,
      configCota: newRuleData.configCota || null
    };
    
    setRulesData(prev => [...prev, newRule]);
    setCreateRuleModalOpen(false);
  };

  // Função para atualizar regra existente
  const handleUpdateRule = (updatedRuleData) => {
    setRulesData(prev => prev.map(rule => 
      rule.id === editingRule.id 
        ? {
            ...rule,
            tipo: updatedRuleData.tipo === 'triagem' ? 'TRIAGEM DE INTIMAÇÃO' : 'GERAÇÃO DE PETIÇÃO',
            descricao: updatedRuleData.descricao || '-',
            regra: updatedRuleData.regra,
            status: updatedRuleData.ativa ? 'ATIVA' : 'INATIVA',
            atualizadoEm: new Date().toLocaleDateString('pt-BR'),
            atualizadoHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            ferramentas: updatedRuleData.ferramentas || { criarTarefa: false, criarCota: false, criarAudiencia: false },
            configTarefa: updatedRuleData.configTarefa || null,
            configCota: updatedRuleData.configCota || null
          }
        : rule
    ));
    setEditingRule(null);
    setCreateRuleModalOpen(false);
  };

  // Função para fechar modal
  const handleCloseModal = () => {
    setCreateRuleModalOpen(false);
    setEditingRule(null);
  };

  // Filtrar dados baseado no tipo selecionado
  const filteredData = rulesData.filter(rule => {
    if (filterType === 'triagem') {
      return rule.tipo === 'TRIAGEM DE INTIMAÇÃO';
    } else if (filterType === 'geracao') {
      return rule.tipo === 'GERAÇÃO DE PETIÇÃO';
    }
    return true;
  });

  // Calcular paginação
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const renderTable = () => (
    <Table>
      <Table.Thead>
        <Table.Tr style={{ backgroundColor: '#dee2e6' }}>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Descrição</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Regra</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Criado em</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Atualizado em</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Compartilhado</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Usa Ferramenta</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Status</Table.Th>
          <Table.Th style={{ fontWeight: '600', color: '#333' }}>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {paginatedData.map((rule) => (
          <Table.Tr key={rule.id} style={{ backgroundColor: 'white' }}>
            <Table.Td>
              <Text size="sm" c="dimmed">{rule.descricao}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" lineClamp={2} style={{ maxWidth: '300px' }}>
                {rule.regra}
              </Text>
            </Table.Td>
            <Table.Td>
              <Stack gap={0}>
                <Text size="sm">{rule.criadoEm}</Text>
                <Text size="xs" c="dimmed">{rule.criadoHora}</Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Stack gap={0}>
                <Text size="sm">{rule.atualizadoEm}</Text>
                <Text size="xs" c="dimmed">{rule.atualizadoHora}</Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="blue">{rule.compartilhado}</Text>
            </Table.Td>
            <Table.Td>
              {(() => {
                if (!rule.ferramentas) return <Text size="sm" c="dimmed">Não</Text>;
                
                const ferramentasAtivas = [];
                if (rule.ferramentas.criarTarefa) ferramentasAtivas.push('Tarefa');
                if (rule.ferramentas.criarCota) ferramentasAtivas.push('Cota');
                if (rule.ferramentas.criarAudiencia) ferramentasAtivas.push('Audiência');
                
                if (ferramentasAtivas.length === 0) {
                  return <Text size="sm" c="dimmed">Não</Text>;
                }
                
                return (
                  <Stack gap={2}>
                    {ferramentasAtivas.map((ferramenta, index) => (
                      <Badge 
                        key={index}
                        color="blue" 
                        variant="light" 
                        size="xs"
                        style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      >
                        {ferramenta}
                      </Badge>
                    ))}
                  </Stack>
                );
              })()}
            </Table.Td>
            <Table.Td>
              <Badge 
                color="green" 
                variant="filled" 
                size="sm"
                style={{ backgroundColor: '#28a745', color: 'white' }}
              >
                {rule.status}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Group gap={4}>
                  <IconHeart size={16} color="#dc3545" />
                  <Text size="sm">{rule.likes}</Text>
                </Group>
                <Badge 
                  color="orange" 
                  variant="filled" 
                  size="xs"
                  style={{ backgroundColor: '#fd7e14', color: 'white' }}
                >
                  <Group gap={4}>
                    <IconScissors size={12} />
                    <Text size="xs">Ocultar</Text>
                  </Group>
                </Badge>
                <ActionIcon 
                  variant="subtle" 
                  color="blue" 
                  size="sm"
                  onClick={() => handleEditRule(rule)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" size="sm">
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
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
            <IconSparkles size={24} color="#1b7847" />
            <Title order={1} style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              Portal de Inteligência Artificial
            </Title>
          </Group>

          {/* Navigation Buttons */}
          <Grid mb="lg">
            <Grid.Col span={8}>
              <Group gap="md">
                <Button
                  variant={activeTab === 'minhas-regras' ? 'filled' : 'outline'}
                  color={activeTab === 'minhas-regras' ? 'green' : 'gray'}
                  leftSection={<IconSparkles size={24} />}
                  onClick={() => setActiveTab('minhas-regras')}
                  style={{
                    height: '60px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    transition: '0.4s',
                    backgroundColor: activeTab === 'minhas-regras' ? '#1b7847' : 'white',
                    color: activeTab === 'minhas-regras' ? 'white' : '#1b7847',
                    borderColor: activeTab === 'minhas-regras' ? '#1b7847' : '#e5e7eb',
                    fontWeight: '500',
                    fontSize: '16px',
                    flex: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Minhas Regras
                </Button>
                <Button
                  variant={activeTab === 'explore-regras' ? 'filled' : 'outline'}
                  color={activeTab === 'explore-regras' ? 'green' : 'gray'}
                  leftSection={<IconGlobe size={24} />}
                  onClick={() => setActiveTab('explore-regras')}
                  style={{
                    height: '60px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    transition: '0.4s',
                    backgroundColor: activeTab === 'explore-regras' ? '#1b7847' : 'white',
                    color: activeTab === 'explore-regras' ? 'white' : '#1b7847',
                    borderColor: activeTab === 'explore-regras' ? '#1b7847' : '#e5e7eb',
                    fontWeight: '500',
                    fontSize: '16px',
                    flex: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Explore Regras
                </Button>
                <Button
                  variant={activeTab === 'ranking' ? 'filled' : 'outline'}
                  color={activeTab === 'ranking' ? 'green' : 'gray'}
                  leftSection={<IconTrophy size={24} />}
                  onClick={() => setActiveTab('ranking')}
                  style={{
                    height: '60px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    transition: '0.4s',
                    backgroundColor: activeTab === 'ranking' ? '#1b7847' : 'white',
                    color: activeTab === 'ranking' ? 'white' : '#1b7847',
                    borderColor: activeTab === 'ranking' ? '#1b7847' : '#e5e7eb',
                    fontWeight: '500',
                    fontSize: '16px',
                    flex: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Ranking
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
                  Automatizações
                </Button>
              </Group>
            </Grid.Col>
          </Grid>

          {/* Content Area */}
          {activeTab === 'minhas-regras' && (
            <Paper withBorder radius="md" p="lg" style={{ backgroundColor: '#f8f9fa' }}>
              {/* Section Header */}
              <Group justify="space-between" mb="md" p="md" style={{ backgroundColor: '#f1f3f5', borderRadius: '8px' }}>
                <Group>
                  <IconSparkles size={20} color="#1b7847" />
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
                    Minhas Regras
                  </Text>
                </Group>
              </Group>

              {/* Tabs */}
              <Group justify="space-between" mb="md">
                <Group>
                  <Button
                    variant={filterType === 'triagem' ? 'filled' : 'outline'}
                    onClick={() => setFilterType('triagem')}
                    style={{
                      backgroundColor: filterType === 'triagem' ? '#1b7847' : 'white',
                      borderColor: '#1b7847',
                      color: filterType === 'triagem' ? 'white' : '#1b7847',
                      fontWeight: '500'
                    }}
                  >
                    Triagem de intimação
                  </Button>
                  <Button
                    variant={filterType === 'geracao' ? 'filled' : 'outline'}
                    onClick={() => setFilterType('geracao')}
                    style={{
                      backgroundColor: filterType === 'geracao' ? '#1b7847' : 'white',
                      borderColor: '#1b7847',
                      color: filterType === 'geracao' ? 'white' : '#1b7847',
                      fontWeight: '500'
                    }}
                  >
                    Geração de petição
                  </Button>
                </Group>
                <Button 
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setCreateRuleModalOpen(true)}
                  style={{
                    backgroundColor: '#1b7847',
                    border: 'none',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  Criar Regra
                </Button>
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
                  total={totalPages}
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

          {activeTab === 'explore-regras' && (
            <Paper withBorder radius="md" p="lg" style={{ backgroundColor: 'white' }}>
              <Title order={3} mb="md">Explore Regras</Title>
              <Text c="dimmed">Conteúdo da aba Explore Regras em desenvolvimento...</Text>
            </Paper>
          )}

          {activeTab === 'ranking' && (
            <Paper withBorder radius="md" p="lg" style={{ backgroundColor: 'white' }}>
              <Title order={3} mb="md">Ranking</Title>
              <Text c="dimmed">Conteúdo da aba Ranking em desenvolvimento...</Text>
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
                    data={[
                      { value: 'hoje', label: 'Hoje' },
                      { value: 'semana', label: 'Esta Semana' },
                      { value: 'mes', label: 'Este Mês' },
                      { value: 'personalizado', label: 'Personalizado' }
                    ]}
                    defaultValue="hoje"
                    style={{ width: '150px' }}
                  />
                  <Select
                    placeholder="Tipo de Atividade"
                    data={[
                      { value: 'todas', label: 'Todas' },
                      { value: 'tarefa', label: 'Criar Tarefa' },
                      { value: 'cota', label: 'Criar Cota' },
                      { value: 'audiencia', label: 'Criar Audiência' }
                    ]}
                    defaultValue="todas"
                    style={{ width: '180px' }}
                  />
                </Group>
              </Group>

              {/* Tabela de Atividades */}
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
                  <Table.Tr>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text size="sm">15/01/2024</Text>
                        <Text size="xs" c="dimmed">14:30:25</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light" size="sm">
                        Criar Tarefa
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        Criada a tarefa <strong>Elaborar peça de memoriais</strong> e entregue para <strong>HUMBERTO BORGES RIBEIRO</strong>
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="light" color="blue" size="sm">
                        <IconEye size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                  
                  <Table.Tr>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text size="sm">15/01/2024</Text>
                        <Text size="xs" c="dimmed">14:25:10</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="orange" variant="light" size="sm">
                        Criar Cota
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        Criada cota para o processo <strong>50012345678901234001</strong>
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="light" color="blue" size="sm">
                        <IconEye size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                  
                  <Table.Tr>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text size="sm">15/01/2024</Text>
                        <Text size="xs" c="dimmed">14:20:45</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="purple" variant="light" size="sm">
                        Criar Audiência
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        Criada audiência para processo <strong>1234567-89.2024.5.02.0001</strong> para <strong>15/11/2025</strong>
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="light" color="blue" size="sm">
                        <IconEye size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                  
                  <Table.Tr>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text size="sm">15/01/2024</Text>
                        <Text size="xs" c="dimmed">14:15:30</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light" size="sm">
                        Criar Tarefa
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        Criada a tarefa <strong>Analisar documentos</strong> e entregue para <strong>JOÃO PEDRO OLIVEIRA</strong>
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="light" color="blue" size="sm">
                        <IconEye size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              {/* Pagination */}
              <Group justify="space-between" mt="md">
                <Pagination
                  value={1}
                  onChange={() => {}}
                  total={1}
                  size="sm"
                  withEdges
                  nextIcon={IconChevronRight}
                  previousIcon={IconChevronLeft}
                  firstIcon={IconChevronsLeft}
                  lastIcon={IconChevronsRight}
                />
                <Select
                  value="10"
                  onChange={() => {}}
                  data={[
                    { value: '5', label: '5 por página' },
                    { value: '10', label: '10 por página' },
                    { value: '20', label: '20 por página' },
                    { value: '50', label: '50 por página' }
                  ]}
                  style={{ width: '130px' }}
                />
              </Group>
            </Paper>
          )}
        </Box>
      </Flex>

      {/* Create/Edit Rule Modal */}
      <NovaRegraModal
        opened={createRuleModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingRule ? handleUpdateRule : handleAddRule}
        editingRule={editingRule}
      />

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

