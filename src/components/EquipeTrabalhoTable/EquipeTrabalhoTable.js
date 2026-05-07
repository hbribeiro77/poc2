"use client";

import React from 'react';
import {
  Table,
  Badge,
  ActionIcon,
  Group,
  Tooltip,
  useMantineTheme,
  Pagination,
  Select,
  Flex,
  Text
} from '@mantine/core';
import { IconX, IconPlaylistAdd, IconUserOff, IconInfoCircle } from '@tabler/icons-react';

// Definição dos tooltips para cada função
const funcoesTooltips = {
  "Gerente de Defensoria": "Pode adicionar/remover usuários, adicionar/remover suas funções e gerenciar a defensoria.",
  "Revisor de Atendimento": "Pode revisar os atendimentos registrados.",
  "Revisor de Peça": "Pode revisar as peças processuais elaboradas.",
  "Administrador de agenda": "Pode configurar e gerenciar a agenda de atendimentos da defensoria."
};

const MOTIVO_CHAVE_PARA_TEXTO_LEGIVEL_TOOLTIP_BADGE_INDISPONIBILIDADE = {
  ferias: 'férias',
  folga: 'folga',
  licenca: 'licença',
  afastamento: 'afastamento',
  outro: null,
};

function parseDataDdMmYyyyStringParaDateMeiaNoiteLocal(textoDdMmYyyy) {
  if (!textoDdMmYyyy || typeof textoDdMmYyyy !== 'string') return null;
  const partes = textoDdMmYyyy.trim().split('/');
  if (partes.length !== 3) return null;
  const dd = parseInt(partes[0], 10);
  const mm = parseInt(partes[1], 10);
  const yyyy = parseInt(partes[2], 10);
  if (!yyyy || !mm || !dd) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

/** `true` se a data de hoje (local) está entre início e fim inclusive — caso contrário a badge não aparece. */
function hojeCaiNoIntervaloInclusiveDdMmYyyyStrings(dataInicioStr, dataFimStr) {
  const inicio = parseDataDdMmYyyyStringParaDateMeiaNoiteLocal(dataInicioStr);
  const fim = parseDataDdMmYyyyStringParaDateMeiaNoiteLocal(dataFimStr);
  if (!inicio || !fim) return false;
  if (fim.getTime() < inicio.getTime()) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return hoje.getTime() >= inicio.getTime() && hoje.getTime() <= fim.getTime();
}

/**
 * Badge laranja: prioriza registro salvo pelo gerente na modal; senão JSON de demonstração.
 * Em ambos os casos só exibe se **hoje** ∈ [início, fim] do período informado.
 */
export function resolveBadgeIndisponibilidadeMembroEquipeParaColunaNome(member) {
  const reg = member?.registroDisponibilidadeGerenciadaNaModal;
  if (reg != null && typeof reg === 'object') {
    if (reg.indisponivel === true && reg.dataInicioDdMmYyyy && reg.dataFimDdMmYyyy && reg.motivoChave) {
      if (!hojeCaiNoIntervaloInclusiveDdMmYyyyStrings(reg.dataInicioDdMmYyyy, reg.dataFimDdMmYyyy)) {
        return null;
      }
      const textoMotivo =
        reg.motivoChave === 'outro'
          ? (reg.textoMotivoQuandoOutroOpcional || 'outro').trim()
          : MOTIVO_CHAVE_PARA_TEXTO_LEGIVEL_TOOLTIP_BADGE_INDISPONIBILIDADE[reg.motivoChave] || reg.motivoChave;
      return {
        label: 'Indisponível',
        tooltipMotivoCompleto: `motivo: ${textoMotivo}, de ${reg.dataInicioDdMmYyyy} a ${reg.dataFimDdMmYyyy}`,
      };
    }
    return null;
  }
  const demo = member?.badgeIndisponibilidadeDemonstracaoUi;
  if (demo?.label && demo.dataInicioDdMmYyyy && demo.dataFimDdMmYyyy) {
    if (!hojeCaiNoIntervaloInclusiveDdMmYyyyStrings(demo.dataInicioDdMmYyyy, demo.dataFimDdMmYyyy)) {
      return null;
    }
    return {
      label: demo.label,
      tooltipMotivoCompleto: demo.tooltipMotivoCompleto || '',
    };
  }
  return null;
}

export default function EquipeTrabalhoTable({
  teamMembers = [],
  onRemoveFuncao,
  onAddFuncao,
  onRemoveUsuario,
  acoesHabilitadas = true,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  onShowUserInfo,
}) {
  const theme = useMantineTheme();

  const paginatedMembers = teamMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (!teamMembers || teamMembers.length === 0) {
    return <p>Nenhum membro na equipe para exibir.</p>;
  }

  const rows = paginatedMembers.map((member) => {
    const badgeResolvidoParaLinhaMembroEquipe = resolveBadgeIndisponibilidadeMembroEquipeParaColunaNome(member);
    return (
    <Table.Tr key={member.id}>
      <Table.Td>
        <Group gap={8} wrap="nowrap" align="center">
          <span>
            {member.nome} ({member.matricula})
          </span>
          {badgeResolvidoParaLinhaMembroEquipe?.label ? (
            <Tooltip
              label={badgeResolvidoParaLinhaMembroEquipe.tooltipMotivoCompleto || ''}
              withArrow
              position="top"
              multiline
              w={280}
            >
              <Badge color="orange" variant="light" size="sm" style={{ cursor: 'help' }}>
                {badgeResolvidoParaLinhaMembroEquipe.label}
              </Badge>
            </Tooltip>
          ) : null}
        </Group>
      </Table.Td>
      <Table.Td>{member.cargo}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          {member.funcoes.map((funcao, index) => (
            <Tooltip
              key={`${member.id}-funcao-${index}-${funcao.nome}`}
              label={funcoesTooltips[funcao.nome] || funcao.nome}
              withArrow
              position="top"
              offset={5}
            >
              <Badge
                variant="light"
                color={funcao.nome === "Gerente de Defensoria" && !funcao.removivel ? "pink" : "blue"}
                rightSection={
                  funcao.removivel && acoesHabilitadas ? (
                    <ActionIcon
                      size="xs"
                      color="blue"
                      radius="xl"
                      variant="transparent"
                      onClick={() => onRemoveFuncao(member.id, funcao.nome)}
                    >
                      <IconX style={{ width: '70%', height: '70%' }} />
                    </ActionIcon>
                  ) : null
                }
              >
                {funcao.nome}
              </Badge>
            </Tooltip>
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-start">
          <Tooltip label="Ver Informações do Usuário" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onShowUserInfo(member.id)}
            >
              <IconInfoCircle size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Função e disponibilidade do integrante" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onAddFuncao(member.id)}
              disabled={!acoesHabilitadas}
            >
              <IconPlaylistAdd size={18} />
            </ActionIcon>
          </Tooltip>
          {member.cargo !== 'Defensor(a) Público(a)' && (
            <Tooltip label="Remover Usuário" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => onRemoveUsuario(member.id)}
                disabled={!acoesHabilitadas}
              >
                <IconUserOff size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
    );
  });

  return (
    <>
      <Table
        highlightOnHover
        withTableBorder
        withRowBorders
        striped={true}
        withColumnBorders={false}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ backgroundColor: '#dee2e6', color: '#495057' }}>Nome (Matrícula)</Table.Th>
            <Table.Th style={{ backgroundColor: '#dee2e6', color: '#495057' }}>Cargo</Table.Th>
            <Table.Th style={{ backgroundColor: '#dee2e6', color: '#495057' }}>Funções</Table.Th>
            <Table.Th style={{ backgroundColor: '#dee2e6', color: '#495057' }}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {totalPages > 0 && (
        <Flex justify="space-between" align="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            withEdges
          />
          <Group>
            <Text size="sm">Itens por página:</Text>
            <Select
              style={{ width: 70 }}
              value={String(itemsPerPage)}
              onChange={(value) => onItemsPerPageChange(Number(value))}
              data={['5', '10', '20']}
              disabled={totalItems === 0}
            />
          </Group>
        </Flex>
      )}
    </>
  );
} 