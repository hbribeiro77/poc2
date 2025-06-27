import React from 'react';
import {
  Paper,
  Group,
  ThemeIcon,
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
} from '@mantine/core';
import {
  IconMessageDots,
  IconPlus,
  IconInfoCircle,
  IconCheck,
  IconPencil,
  IconTrash,
  IconFileTypePdf,
  IconChartLine,
  IconBrandWhatsapp,
  IconPhone,
  IconUsers,
  IconQuestionMark
} from '@tabler/icons-react';

const AtendimentosPastaTable = ({
  atendimentos,
  atendimentosActivePage,
  setAtendimentosActivePage,
  atendimentosItemsPerPage,
  setAtendimentosItemsPerPage,
  onNewWhatsapp,
  onEdit,
}) => {
  const totalAtendimentosPages = Math.ceil(atendimentos.length / parseInt(atendimentosItemsPerPage, 10));

  const paginatedAtendimentos = atendimentos.slice(
    (atendimentosActivePage - 1) * parseInt(atendimentosItemsPerPage, 10),
    atendimentosActivePage * parseInt(atendimentosItemsPerPage, 10)
  );

  const renderFormaAtendimentoIcon = (item) => {
    const forma = item.formaAtendimento || '';

    switch (forma.toLowerCase()) {
      case 'whatsapp':
        return (
          <Tooltip label="WhatsApp" withArrow>
            <ThemeIcon color="green" variant="light" size="lg">
              <IconBrandWhatsapp size={20} />
            </ThemeIcon>
          </Tooltip>
        );
      case 'telefone':
        return (
          <Tooltip label="Telefone" withArrow>
            <ThemeIcon color="orange" variant="light" size="lg">
              <IconPhone size={20} />
            </ThemeIcon>
          </Tooltip>
        );
      case 'presencial':
        return (
          <Tooltip label="Presencial" withArrow>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconUsers size={20} />
            </ThemeIcon>
          </Tooltip>
        );
      default:
        return (
            <Tooltip label="Forma não informada" withArrow>
              <ThemeIcon color="gray" variant="light" size="lg">
                <IconQuestionMark size={20} />
              </ThemeIcon>
            </Tooltip>
          );
    }
  };

  return (
    <Paper p="md" mt="lg" shadow="sm" withBorder>
      <Group mb="md">
        <ThemeIcon variant="light" size="xl" color="teal">
          <IconMessageDots style={{ width: '70%', height: '70%' }} />
        </ThemeIcon>
        <Title order={3} c="teal.7">Atendimentos na Pasta</Title>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withColumnBorders verticalSpacing="xs" miw={900}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 60, textAlign: 'center' }}>Forma</Table.Th>
              <Table.Th>Data</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th>Relato do assistido</Table.Th>
              <Table.Th>Providência</Table.Th>
              <Table.Th>Assistido</Table.Th>
              <Table.Th>Defensoria</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedAtendimentos.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td style={{ textAlign: 'center' }}>{renderFormaAtendimentoIcon(item)}</Table.Td>
                <Table.Td>{item.data}</Table.Td>
                <Table.Td>
                  <Badge color={item.situacao === 'Rascunho' ? 'orange' : 'teal'} variant="light">
                    {item.situacao === 'Rascunho' ? 'Rascunho' : 'Aprovado'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text truncate="end" style={{ maxWidth: 150 }}>
                    {item.relato}
                  </Text>
                </Table.Td>
                <Table.Td>{item.providencia}</Table.Td>
                <Table.Td>
                  <Text truncate="end" style={{ maxWidth: 150 }}>
                    {item.assistido}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text truncate="end" style={{ maxWidth: 150 }}>
                    {item.defensoria}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={0} justify="center" wrap="nowrap">
                    <Tooltip label="Adicionar Providência" withArrow>
                      <ActionIcon variant="subtle" color="gray">
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Detalhes do Atendimento" withArrow>
                      <ActionIcon variant="subtle" color="gray">
                        <IconInfoCircle size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Registrar Ciência" withArrow>
                      <ActionIcon variant="subtle" color="gray">
                        <IconCheck size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={!String(item.id).startsWith('atd-') ? "Apenas atendimentos criados nesta sessão podem ser editados" : "Editar Atendimento"} withArrow>
                      <ActionIcon 
                        variant="subtle" 
                        color="gray" 
                        onClick={() => onEdit(item)}
                        disabled={!String(item.id).startsWith('atd-')}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Excluir Atendimento" withArrow>
                      <ActionIcon variant="subtle" color="red">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Gerar PDF do Atendimento" withArrow>
                      <ActionIcon variant="subtle" color="gray">
                        <IconFileTypePdf size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Visualizar Histórico" withArrow>
                      <ActionIcon variant="subtle" color="gray">
                        <IconChartLine size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {paginatedAtendimentos.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={8} align="center">
                  Nenhum atendimento encontrado.
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Group justify="flex-end" mt="xl">
        {onNewWhatsapp && (
          <Button
            variant="filled"
            color="teal.8"
            leftSection={<IconBrandWhatsapp size={18} />}
            onClick={onNewWhatsapp}
          >
            WhatsApp
          </Button>
        )}
        <Button color="teal" leftSection={<IconPlus size={18} />}>
          Novo atendimento
        </Button>
      </Group>

      <Group justify="space-between" mt="md">
        <Pagination
          total={totalAtendimentosPages}
          value={atendimentosActivePage}
          onChange={setAtendimentosActivePage}
        />
        <Select
          style={{ width: '120px' }}
          value={atendimentosItemsPerPage}
          onChange={(value) => {
            setAtendimentosItemsPerPage(value || '5');
            setAtendimentosActivePage(1); // Reset page on item per page change
          }}
          data={['5', '10', '20']}
        />
      </Group>
    </Paper>
  );
};

export default AtendimentosPastaTable; 