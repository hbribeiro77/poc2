import React from 'react';
import {
  Paper,
  Group,
  Title,
  ScrollArea,
  Table,
  Badge,
  Text,
  ActionIcon,
  Tooltip,
  Button,
  Pagination,
  Select,
  ThemeIcon,
} from '@mantine/core';
import {
  IconPlus,
  IconInfoCircle,
  IconCheck,
  IconPencil,
  IconTrash,
  IconFileTypePdf,
  IconClipboardText,
  IconEye,
  IconMessageChatbot,
} from '@tabler/icons-react';

const AtendimentosTable = ({
  atendimentos = [],
  currentPage = 1,
  onPageChange,
  itemsPerPage = '5',
  onItemsPerPageChange,
  onNewAtendimento,
  onEdit,
  onDelete,
  onView,
}) => {
  const totalPages = Math.ceil(atendimentos.length / parseInt(itemsPerPage, 10));

  const paginatedAtendimentos = atendimentos.slice(
    (currentPage - 1) * parseInt(itemsPerPage, 10),
    currentPage * parseInt(itemsPerPage, 10)
  );

  const getSituacaoColor = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'rascunho':
        return 'orange';
      case 'aprovado':
      case 'finalizado':
        return 'green';
      case 'pendente':
        return 'blue';
      case 'rejeitado':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Paper p="md" mt="lg" shadow="sm" withBorder>
      {/* Cabeçalho com ícone de atendimento */}
      <Group mb="md" gap="xs">
        <ThemeIcon variant="light" size="xl" color="teal">
          <IconMessageChatbot style={{ width: '70%', height: '70%' }} />
        </ThemeIcon>
        <Title order={3} c="teal.7">Atendimentos</Title>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withColumnBorders verticalSpacing="xs" miw={1000}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Data</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th>Relato do assistido</Table.Th>
              <Table.Th>Providência</Table.Th>
              <Table.Th>Assistido</Table.Th>
              <Table.Th>Defensoria</Table.Th>
              <Table.Th style={{ textAlign: 'center', width: 200 }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedAtendimentos.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <Text size="sm">{item.data}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={getSituacaoColor(item.situacao)} 
                    variant="light"
                    size="sm"
                  >
                    {item.situacao}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" truncate="end" style={{ maxWidth: 200 }}>
                    {item.relato}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{item.providencia}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" truncate="end" style={{ maxWidth: 150 }}>
                    {item.assistido}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" truncate="end" style={{ maxWidth: 200 }}>
                    {item.defensoria}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} justify="center" wrap="nowrap">
                    <Tooltip label="Adicionar" withArrow>
                      <ActionIcon variant="subtle" color="green" size="sm">
                        <IconPlus size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Informações" withArrow>
                      <ActionIcon variant="subtle" color="blue" size="sm">
                        <IconInfoCircle size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Aprovar" withArrow>
                      <ActionIcon variant="subtle" color="green" size="sm">
                        <IconCheck size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Editar" withArrow>
                      <ActionIcon 
                        variant="subtle" 
                        color="blue" 
                        size="sm"
                        onClick={() => onEdit && onEdit(item)}
                      >
                        <IconPencil size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Excluir" withArrow>
                      <ActionIcon 
                        variant="subtle" 
                        color="red" 
                        size="sm"
                        onClick={() => onDelete && onDelete(item)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Gerar PDF" withArrow>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconFileTypePdf size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Visualizar" withArrow>
                      <ActionIcon 
                        variant="subtle" 
                        color="gray" 
                        size="sm"
                        onClick={() => onView && onView(item)}
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Relatório" withArrow>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconClipboardText size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {paginatedAtendimentos.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                  <Text c="dimmed" size="sm">Nenhum atendimento encontrado.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Botão Novo Atendimento */}
      <Group justify="flex-end" mt="md">
        <Button 
          color="green" 
          leftSection={<IconPlus size={16} />}
          onClick={onNewAtendimento}
        >
          Novo atendimento
        </Button>
      </Group>

      {/* Paginação */}
      {totalPages > 0 && (
        <Group justify="space-between" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
          />
          <Select
            style={{ width: '120px' }}
            value={itemsPerPage}
            onChange={(value) => {
              onItemsPerPageChange && onItemsPerPageChange(value || '5');
            }}
            data={['5', '10', '20', '50']}
          />
        </Group>
      )}
    </Paper>
  );
};

export default AtendimentosTable; 