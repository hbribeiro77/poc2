'use client';

import { Badge, Box, Group, ScrollArea, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import {
  IconUsers,
  IconMessageCircle,
  IconFileDescription,
  IconBookmark,
  IconClipboardList,
  IconUserHeart,
} from '@tabler/icons-react';

/** Identificadores das abas/seções da página Minha Defensoria. */
export const CHAVES_SECOES_MINHA_DEFENSORIA = {
  EQUIPE: 'equipe',
  SMS: 'sms',
  SOLICITACOES_DOCUMENTO: 'solicitacoes-documento',
  PECAS_FAVORITAS: 'pecas-favoritas',
  PROMPTS_TRIAGEM: 'prompts-triagem',
  ASSISTIDOS_ATENDIDOS: 'assistidos-atendidos',
};

/** SPD: quadrado total **108×108 incluindo moldura** (`box-sizing: border-box` + moldura interna via `inset` shadow). */
const LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX = 108;

/** Converte #RRGGBB em rgba para sombra colorida no estado ativo. */
function hexCorIconeParaRgbComOpacidadeSomenteExportacaoVisual(hexComCerquilhaOuNao, alphaEntreZeroEUm) {
  const h = hexComCerquilhaOuNao.replace('#', '');
  if (h.length !== 6) return `rgba(0,0,0,${alphaEntreZeroEUm})`;
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alphaEntreZeroEUm})`;
}

const DEFINICOES_VISUAIS_CARTOES_SECOES_MINHA_DEFENSORIA = [
  {
    key: CHAVES_SECOES_MINHA_DEFENSORIA.EQUIPE,
    label: 'Equipe de trabalho',
    Icon: IconUsers,
    iconColor: '#228be6',
    badgeProp: 'equipeCount',
  },
  {
    key: CHAVES_SECOES_MINHA_DEFENSORIA.SMS,
    label: 'SMS recebidos',
    Icon: IconMessageCircle,
    iconColor: '#40c057',
    badgeProp: 'smsCount',
  },
  {
    key: CHAVES_SECOES_MINHA_DEFENSORIA.SOLICITACOES_DOCUMENTO,
    label: 'Solicitações de documento',
    Icon: IconFileDescription,
    iconColor: '#fd7e14',
    badgeProp: 'solicitacoesCount',
  },
  {
    key: CHAVES_SECOES_MINHA_DEFENSORIA.PECAS_FAVORITAS,
    label: 'Peças favoritas',
    Icon: IconBookmark,
    iconColor: '#15aabf',
    badgeProp: 'pecasCount',
  },
  {
    key: CHAVES_SECOES_MINHA_DEFENSORIA.PROMPTS_TRIAGEM,
    label: 'Prompts de triagem',
    Icon: IconClipboardList,
    iconColor: '#7950f2',
    badgeProp: 'promptsCount',
  },
  {
    key: CHAVES_SECOES_MINHA_DEFENSORIA.ASSISTIDOS_ATENDIDOS,
    label: 'Assistidos atendidos',
    Icon: IconUserHeart,
    iconColor: '#fa5252',
    badgeProp: 'assistidosCount',
  },
];

/**
 * Navegação em cartões 108×108 **já com moldura** (sem crescer por causa de `border`).
 * Inativo: moldura = `inset` box-shadow (1px). Selecionado: fundo **= cor do ícone daquele módulo**, ícone, texto e dígito do badge brancos.
 */
export default function MinhaDefensoriaNavegacaoSecoesEmCartoesComIconeEBadge({
  secaoAtivaChaveSlug,
  aoAlterarSecaoAtivaSomenteCliente,
  badgesNumerosPorPropriedadeNome,
  /** Quando `false`, exibe só o cartão “Equipe de trabalho” (ex.: usuário não integra a equipe desta defensoria). */
  exibirTodasSecoesMinhaDefensoria = true,
}) {
  const theme = useMantineTheme();

  const definicoesCartoesVisiveisSomenteDepoisFiltroPorVinculoUsuarioNaEquipe =
    exibirTodasSecoesMinhaDefensoria === true
      ? DEFINICOES_VISUAIS_CARTOES_SECOES_MINHA_DEFENSORIA
      : DEFINICOES_VISUAIS_CARTOES_SECOES_MINHA_DEFENSORIA.filter(
          (definicao) => definicao.key === CHAVES_SECOES_MINHA_DEFENSORIA.EQUIPE
        );

  return (
    <ScrollArea scrollbars="x" type="hover" mb="xl" offsetScrollbars scrollbarSize={8}>
      <Group gap="md" wrap="nowrap" pb="xs" pt={2} align="stretch" style={{ minWidth: 'min-content' }}>
        {definicoesCartoesVisiveisSomenteDepoisFiltroPorVinculoUsuarioNaEquipe.map(
          ({ key: chaveUnicaDaSecao, label, Icon: SvgIconePorSecaoMinhaDefensoria, iconColor, badgeProp }) => {
            const valorBadgeNumeroOuZero =
              typeof badgesNumerosPorPropriedadeNome?.[badgeProp] === 'number'
                ? badgesNumerosPorPropriedadeNome[badgeProp]
                : 0;
            const selecionado = secaoAtivaChaveSlug === chaveUnicaDaSecao;

            const corIconeNoCartao = selecionado ? '#ffffff' : iconColor;
            const corTextoRotulo = selecionado ? '#ffffff' : '#1e3a5f';

            return (
              <UnstyledButton
                key={chaveUnicaDaSecao}
                type="button"
                aria-current={selecionado ? 'page' : undefined}
                aria-label={`Abrir seção: ${label}`}
                onClick={() => aoAlterarSecaoAtivaSomenteCliente(chaveUnicaDaSecao)}
                style={{
                  position: 'relative',
                  flex: '0 0 auto',
                  width: LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX,
                  height: LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX,
                  minWidth: LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX,
                  minHeight: LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX,
                  maxWidth: LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX,
                  maxHeight: LADO_CARTAO_SECAO_MINHA_DEFENSORIA_PX,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: '10px 8px 8px 10px',
                  borderRadius: theme.radius.md,
                  border: 'none',
                  background: selecionado ? iconColor : theme.white,
                  boxShadow: selecionado
                    ? `0 3px 12px ${hexCorIconeParaRgbComOpacidadeSomenteExportacaoVisual(iconColor, 0.38)}`
                    : `0 2px 6px rgba(0, 0, 0, 0.07), inset 0 0 0 1px ${theme.colors.blue[2]}`,
                  transition:
                    'background-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
                }}
              >
                <Badge
                  size="sm"
                  variant="filled"
                  radius="sm"
                  styles={{
                    root: {
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      minWidth: 22,
                      height: 22,
                      padding: '0 6px',
                      ...(selecionado
                        ? {
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: 700,
                          }
                        : {
                            backgroundColor: '#e7f2ff',
                            color: '#1864ab',
                            border: '1px solid #c5daf7',
                          }),
                    },
                  }}
                >
                  {valorBadgeNumeroOuZero}
                </Badge>

                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 2,
                  }}
                >
                  <SvgIconePorSecaoMinhaDefensoria
                    size={28}
                    stroke={1.65}
                    color={corIconeNoCartao}
                    aria-hidden
                  />
                </Box>

                <Text
                  fz={10}
                  fw={700}
                  ta="left"
                  lh={1.2}
                  lineClamp={3}
                  c={corTextoRotulo}
                  style={{
                    marginTop: 'auto',
                    alignSelf: 'stretch',
                    wordBreak: 'break-word',
                  }}
                >
                  {label}
                </Text>
              </UnstyledButton>
            );
          }
        )}
      </Group>
    </ScrollArea>
  );
}
