'use client';

import { createRef, forwardRef, Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { usePathname } from 'next/navigation';
import Draggable from 'react-draggable';
import { notifications } from '@mantine/notifications';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  Paper,
  Popover,
  Stack,
  Text,
  Textarea,
  Tooltip,
  UnstyledButton,
  Slider,
  Switch,
} from '@mantine/core';
import {
  IconNotes,
  IconPlus,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconChevronUp,
  IconGripVertical,
  IconLayoutSidebarRightCollapse,
  IconBlur,
  IconPalette,
  IconMarkdown,
  IconCopy,
  IconFileDownload,
  IconChevronDown,
  IconPhoto,
} from '@tabler/icons-react';
import {
  capturaElementoDomParaDataUrlJpegRedimensionadoExportMarkdownModoReuniaoFacilitador,
  escapaTextoParaCelulaTabelaMarkdownExportFacilitadorModoReuniao,
  montaHtmlCelulaTabelaImagensClipboardPostItMarkdownExportFacilitadorModoReuniao,
  montaMarcacaoMarkdownColunaCorComCirculoSolidoVisualizadoFacilitadorModoReuniao,
} from '../../utils/captura-elemento-dom-para-data-url-jpeg-export-markdown-modo-reuniao-facilitador';

const STORAGE_KEY = 'facilitador_modo_reuniao_post_its_por_rota';

/** Tamanho da fonte do texto nos post-its (px), preferência global no navegador. */
const STORAGE_KEY_FACILITADOR_POST_IT_FONT_SIZE_PX_GLOBAL = 'facilitador_modo_reuniao_post_it_font_size_px';

/** Preferência chip minimizado translúcido (só aplica ao minimizado; expandido fica opaco). Por rota. */
const STORAGE_KEY_NOTAS_TRANSLUCIDAS_POR_ROTA =
  'facilitador_modo_reuniao_notas_translucidas_preferencia_por_rota_json';

/** Chave antiga (mantém leitura pontual para não perder preferência já salva). */
const STORAGE_KEY_NOTAS_TRANSLUCIDAS_POR_ROTA_ANTIGA =
  'facilitador_modo_reuniao_notas_sem_transparencia_visual_persistida_por_rota_json';

/** Minimizar todas as notas da página só durante o screenshot da export Markdown “esta página”. */
const STORAGE_KEY_MINIMIZAR_NOTAS_ANTES_SCREENSHOT_EXPORT_MARKDOWN_MODO_REUNIAO =
  'facilitador_modo_reuniao_minimizar_notas_antes_screenshot_export_md';

/** Opacidade dos post-its quando translúcidos (enxergar a PoC por baixo). */
const OPACIDADE_POST_IT_MODO_TRANSLUCIDO = 0.5;
const NOTE_COLORS = ['#fff3bf', '#d3f9d8', '#c5f6fa', '#ffd8a8', '#e5dbff', '#ffc9c9'];
const NOTE_DEFAULT_WIDTH = 260;
const NOTE_DEFAULT_HEIGHT = 200;
const NOTE_MIN_WIDTH = 180;
const NOTE_MIN_HEIGHT = 120;
const NOTE_ICON_CHIP_SIDE = 50;
const NOTE_FONT_SIZE_DEFAULT_PX = 13;
const NOTE_FONT_SIZE_MIN_PX = 10;
const NOTE_FONT_SIZE_MAX_PX = 24;

/** Evita estourar localStorage com muitos prints por nota. */
const MAX_IMAGENS_CLIPBOARD_PRINT_SCREEN_POR_NOTA_POST_IT_FACILITADOR = 6;
/** Redimensiona JPEG colado para largura máxima (mantém proporção). */
const LARGURA_MAXIMA_PIXELS_REDIM_CLIPBOARD_PRINT_POST_IT = 900;

function limitaTamanhoFontePostItPxUsuarioAoIntervaloPermitidoParaSliderIntegrador(valorOuNan) {
  const n = typeof valorOuNan === 'number' ? valorOuNan : parseInt(String(valorOuNan), 10);
  if (Number.isNaN(n)) return NOTE_FONT_SIZE_DEFAULT_PX;
  return Math.min(NOTE_FONT_SIZE_MAX_PX, Math.max(NOTE_FONT_SIZE_MIN_PX, Math.round(n)));
}

/** Container fixo do FAB + painel “Modo de Reunião”; dropdowns portais precisam ficar acima disso. */
const Z_INDEX_FACILITADOR_CONTAINER_OVERLAY_CAMADA_FIXA_COM_PAINEL_E_FAB = 30000;
/** Menu / Popover renderizados em portal devem empilhar acima do overlay (senão ficam “atrás” do painel). */
const Z_INDEX_FACILITADOR_ELEMENTOS_PORTAIS_MENU_POPOVER_SUBMENU_ACIMA_DO_OVERLAY =
  Z_INDEX_FACILITADOR_CONTAINER_OVERLAY_CAMADA_FIXA_COM_PAINEL_E_FAB + 1000;
/** Acima de menus/popovers do facilitador: preview de print colado em tamanho ampliado. */
const Z_INDEX_FACILITADOR_MODAL_VISUALIZACAO_AMPLIADA_IMAGEM_CLIPBOARD_PRINT_POST_IT_ACIMA_DE_TUDO =
  Z_INDEX_FACILITADOR_ELEMENTOS_PORTAIS_MENU_POPOVER_SUBMENU_ACIMA_DO_OVERLAY + 2000;

function pickNote(note) {
  const rawColor = typeof note.color === 'string' ? note.color.trim() : '';
  const color = /^#[0-9A-Fa-f]{6}$/.test(rawColor) ? rawColor : NOTE_COLORS[0];
  const imagensClipboardPostItFacilitadorPrintScreen =
    Array.isArray(note.imagensClipboardPostItFacilitadorPrintScreen) &&
    note.imagensClipboardPostItFacilitadorPrintScreen.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.dataUrl === 'string' &&
        item.dataUrl.startsWith('data:image/')
    )
      ? note.imagensClipboardPostItFacilitadorPrintScreen
      : [];
  return {
    ...note,
    color,
    imagensClipboardPostItFacilitadorPrintScreen,
    width: typeof note.width === 'number' ? note.width : NOTE_DEFAULT_WIDTH,
    height: typeof note.height === 'number' ? note.height : NOTE_DEFAULT_HEIGHT,
    minimized: typeof note.minimized === 'boolean' ? note.minimized : false,
  };
}

/**
 * Screenshot da área da PoC para export “esta página”; opcionalmente minimiza post-its antes e restaura depois.
 */
async function capturaScreenshotExportMarkdownEstaPaginaComRestauracaoMinimizadoSeOpcaoAtivaFacilitador({
  notesByRoute,
  setNotesByRoute,
  pathname,
  scrollRootSelector,
  minimizarNotasAntesDoScreenshotExportMarkdown,
}) {
  const listaNotasRotaAtual = notesByRoute[pathname] || [];
  if (listaNotasRotaAtual.length === 0) {
    return null;
  }

  if (!minimizarNotasAntesDoScreenshotExportMarkdown) {
    return capturaElementoDomParaDataUrlJpegRedimensionadoExportMarkdownModoReuniaoFacilitador(
      scrollRootSelector
    );
  }

  const snapshotEstadoMinimizadoPorIdNotaParaRestaurarAposScreenshotExportMarkdown = Object.fromEntries(
    listaNotasRotaAtual.map((notaPersistida) => [notaPersistida.id, pickNote(notaPersistida).minimized])
  );

  let dataUrlJpegScreenshotExportMarkdownOuNull = null;

  try {
    flushSync(() => {
      setNotesByRoute((mapaNotasPorRotaAnterior) => ({
        ...mapaNotasPorRotaAnterior,
        [pathname]: (mapaNotasPorRotaAnterior[pathname] || []).map((notaPersistidaNoEstado) => ({
          ...notaPersistidaNoEstado,
          minimized: true,
        })),
      }));
    });

    await new Promise((resolverAposDoisFramesParaLayoutMinimizado) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolverAposDoisFramesParaLayoutMinimizado());
      });
    });
    await new Promise((r) => setTimeout(r, 120));

    dataUrlJpegScreenshotExportMarkdownOuNull =
      await capturaElementoDomParaDataUrlJpegRedimensionadoExportMarkdownModoReuniaoFacilitador(
        scrollRootSelector
      );
  } finally {
    flushSync(() => {
      setNotesByRoute((mapaNotasPorRotaAnterior) => ({
        ...mapaNotasPorRotaAnterior,
        [pathname]: (mapaNotasPorRotaAnterior[pathname] || []).map((notaPersistidaNoEstado) => ({
          ...notaPersistidaNoEstado,
          minimized:
            snapshotEstadoMinimizadoPorIdNotaParaRestaurarAposScreenshotExportMarkdown[
              notaPersistidaNoEstado.id
            ] ?? false,
        })),
      }));
    });
  }

  return dataUrlJpegScreenshotExportMarkdownOuNull;
}

/**
 * Cola print (PNG/JPEG do clipboard) → JPEG redimensionado em data URL (PoC, persiste no JSON da nota).
 */
function converteBlobImagemClipboardParaDataUrlJpegRedimensionado(blobEntradaImagem, larguraMaximaPx) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || typeof Image === 'undefined') {
      reject(new Error('sem-dom'));
      return;
    }
    const objetoUrlTemporarioParaCanvas = URL.createObjectURL(blobEntradaImagem);
    const elementoImg = new Image();
    elementoImg.onload = () => {
      try {
        let { width: wNativa, height: hNativa } = elementoImg;
        let w = wNativa;
        let h = hNativa;
        if (w > larguraMaximaPx) {
          h = Math.round((hNativa * larguraMaximaPx) / wNativa);
          w = larguraMaximaPx;
        }
        const canvasDoRedimensionamentoClipboard = document.createElement('canvas');
        canvasDoRedimensionamentoClipboard.width = w;
        canvasDoRedimensionamentoClipboard.height = h;
        const contexto2d = canvasDoRedimensionamentoClipboard.getContext('2d');
        if (!contexto2d) {
          URL.revokeObjectURL(objetoUrlTemporarioParaCanvas);
          reject(new Error('sem-2d'));
          return;
        }
        contexto2d.drawImage(elementoImg, 0, 0, w, h);
        URL.revokeObjectURL(objetoUrlTemporarioParaCanvas);
        resolve(canvasDoRedimensionamentoClipboard.toDataURL('image/jpeg', 0.82));
      } catch (err) {
        URL.revokeObjectURL(objetoUrlTemporarioParaCanvas);
        reject(err);
      }
    };
    elementoImg.onerror = () => {
      URL.revokeObjectURL(objetoUrlTemporarioParaCanvas);
      reject(new Error('img-load'));
    };
    elementoImg.src = objetoUrlTemporarioParaCanvas;
  });
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}

/** DD-MM-YYYY às HH:mm no fuso local do navegador (cabeçalho do export Markdown). */
function formataDataHoraLocalBrasileiraParaCabecalhoExportMarkdownModoReuniao(referenciaDate = new Date()) {
  const d = referenciaDate;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  const hora = String(d.getHours()).padStart(2, '0');
  const minuto = String(d.getMinutes()).padStart(2, '0');
  return `${dia}-${mes}-${ano} às ${hora}:${minuto}`;
}

/**
 * Markdown humano-legível para colar em issues (GitLab), e-mail ou Confluence.
 * @param pathnameFiltroOuNullParaTodasRotas Quando definido (string da rota), só exporta essa entrada do mapa.
 * @param opcoesMarkdownExportOpcional.screenshotPaginaDataUrlImagemOuNull Só na exportação “esta página”: JPEG em data URL embutido após o título da rota.
 * @param opcoesMarkdownExportOpcional.incluirMidiasEmbutidasNoMarkdown Se false (ex.: **Copiar**), omite screenshot e miniaturas na tabela; coluna “Prints” vira só a contagem.
 */
function montaMarkdownExportacaoNotasFacilitadorModoReuniao(
  notesByRouteMap,
  pathnameFiltroOuNullParaTodasRotas,
  opcoesMarkdownExportOpcional = {}
) {
  const {
    screenshotPaginaDataUrlImagemOuNull = null,
    incluirMidiasEmbutidasNoMarkdown = true,
  } = opcoesMarkdownExportOpcional;

  const instanteGeracaoCabecalhoMarkdownExport = new Date();
  const linhas = [
    '# Notas da reunião',
    '',
    `Gerado em ${formataDataHoraLocalBrasileiraParaCabecalhoExportMarkdownModoReuniao(instanteGeracaoCabecalhoMarkdownExport)}`,
    '',
  ];

  let totalNotas = 0;
  const paresRotaLista =
    pathnameFiltroOuNullParaTodasRotas != null
      ? [[pathnameFiltroOuNullParaTodasRotas, notesByRouteMap[pathnameFiltroOuNullParaTodasRotas] || []]]
      : [...Object.entries(notesByRouteMap)].sort(([a], [b]) => a.localeCompare(b, 'pt-BR'));

  for (const [rotaSlug, listaDeNotasParaEstaRotaSomenteMarkdown] of paresRotaLista) {
    if (!Array.isArray(listaDeNotasParaEstaRotaSomenteMarkdown) || listaDeNotasParaEstaRotaSomenteMarkdown.length === 0) {
      continue;
    }

    linhas.push(`## \`${rotaSlug}\``);
    linhas.push('');

    const deveInserirScreenshotNesteBlocoRota =
      incluirMidiasEmbutidasNoMarkdown &&
      Boolean(screenshotPaginaDataUrlImagemOuNull) &&
      pathnameFiltroOuNullParaTodasRotas != null &&
      pathnameFiltroOuNullParaTodasRotas === rotaSlug;

    if (deveInserirScreenshotNesteBlocoRota) {
      linhas.push('### Screenshot da página');
      linhas.push('');
      linhas.push(
        `![Screenshot da área da PoC ao exportar — ${rotaSlug}](${screenshotPaginaDataUrlImagemOuNull})`
      );
      linhas.push('');
    } else if (
      incluirMidiasEmbutidasNoMarkdown &&
      pathnameFiltroOuNullParaTodasRotas != null &&
      pathnameFiltroOuNullParaTodasRotas === rotaSlug
    ) {
      linhas.push(
        '_Screenshot da página indisponível neste export (falha na captura ou elemento não encontrado)._'
      );
      linhas.push('');
    }

    linhas.push('### Notas');
    linhas.push('');
    linhas.push('| Nota | Cor | Texto | Prints colados |');
    linhas.push('| ---: | :--- | :--- | :--- |');

    listaDeNotasParaEstaRotaSomenteMarkdown.forEach((notaBrutaDoStorage, indiceNotaBaseUm) => {
      totalNotas += 1;
      const n = pickNote(notaBrutaDoStorage);
      const textoUmaLinha = escapaTextoParaCelulaTabelaMarkdownExportFacilitadorModoReuniao(n.text);
      const textoCelula = textoUmaLinha.length > 0 ? textoUmaLinha : '_(vazio)_';
      const celulaCorComCirculoSolidoMarkdown =
        montaMarcacaoMarkdownColunaCorComCirculoSolidoVisualizadoFacilitadorModoReuniao(n.color);
      const qtdImagensClipboardSomenteNumeradorExportMarkdown =
        Array.isArray(n.imagensClipboardPostItFacilitadorPrintScreen) &&
        n.imagensClipboardPostItFacilitadorPrintScreen.length > 0
          ? n.imagensClipboardPostItFacilitadorPrintScreen.length
          : 0;
      const celulaPrintsColadosTabelaMarkdown =
        incluirMidiasEmbutidasNoMarkdown
          ? montaHtmlCelulaTabelaImagensClipboardPostItMarkdownExportFacilitadorModoReuniao(
              n.imagensClipboardPostItFacilitadorPrintScreen,
              indiceNotaBaseUm + 1
            )
          : qtdImagensClipboardSomenteNumeradorExportMarkdown > 0
            ? String(qtdImagensClipboardSomenteNumeradorExportMarkdown)
            : '—';
      linhas.push(
        `| ${indiceNotaBaseUm + 1} | ${celulaCorComCirculoSolidoMarkdown} | ${textoCelula} | ${celulaPrintsColadosTabelaMarkdown} |`
      );
    });

    linhas.push('');
  }

  if (totalNotas === 0) {
    linhas.push('_(Nenhuma nota para exportar neste escopo.)_');
    linhas.push('');
  }

  return { markdown: linhas.join('\n').trimEnd() + '\n', totalNotas };
}

function disparaDownloadTextoComoArquivoMarkdownNoNavegador(conteudoMarkdownUtf8, nomeBasesemExtensao) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([conteudoMarkdownUtf8], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${nomeBasesemExtensao}.md`;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function montaNomeArquivoBasicoExportMarkdownModoReuniao(escopoPaginaAtualOuTodasAsRotas, pathnameAtualParaSlug) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  if (escopoPaginaAtualOuTodasAsRotas === 'todas') {
    return `notas-modo-reuniao_todas-rotas_${ts}`;
  }
  const slug =
    String(pathnameAtualParaSlug || '')
      .replace(/^\/+|\/+$/g, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '') || 'pagina-atual';
  return `notas-modo-reuniao_${slug}_${ts}`;
}

function createNote(pathname, posicaoInicialCartaoPostItOpcional) {
  const pos =
    posicaoInicialCartaoPostItOpcional &&
    typeof posicaoInicialCartaoPostItOpcional.x === 'number' &&
    typeof posicaoInicialCartaoPostItOpcional.y === 'number'
      ? {
          x: posicaoInicialCartaoPostItOpcional.x,
          y: posicaoInicialCartaoPostItOpcional.y,
        }
      : { x: 360, y: 120 };
  return {
    id: `nota-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    text: '',
    imagensClipboardPostItFacilitadorPrintScreen: [],
    color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    position: pos,
    route: pathname,
    width: NOTE_DEFAULT_WIDTH,
    height: NOTE_DEFAULT_HEIGHT,
    minimized: false,
  };
}

const MARGEM_VIEWPORT_PX_POSICAO_INICIAL_POST_IT_NOVO_FACILITADOR_MODO_REUNIAO = 16;

/**
 * Posição no layer dos post-its (coords relativas ao `#facilitador-scroll-root`) para o novo cartão aparecer na viewport.
 */
function calculaPosicaoInicialPostItDentroDaViewportParaCriacaoFacilitadorModoReuniao(
  selectorCssRaizScrollFacilitador,
  larguraCartaoPostItPx,
  alturaCartaoPostItPx
) {
  const m = MARGEM_VIEWPORT_PX_POSICAO_INICIAL_POST_IT_NOVO_FACILITADOR_MODO_REUNIAO;
  const fallback = { x: m, y: m };

  if (typeof document === 'undefined') return fallback;

  const elementoRaizScrollPoC = document.querySelector(selectorCssRaizScrollFacilitador);
  if (!elementoRaizScrollPoC) return fallback;

  const retanguloViewportRaizScroll = elementoRaizScrollPoC.getBoundingClientRect();
  const larguraJanela = window.innerWidth;
  const alturaJanela = window.innerHeight;
  const w = larguraCartaoPostItPx;
  const h = alturaCartaoPostItPx;

  let cantoSuperiorEsquerdoNotaEmCoordenadasViewportX = retanguloViewportRaizScroll.left + m;
  let cantoSuperiorEsquerdoNotaEmCoordenadasViewportY = retanguloViewportRaizScroll.top + m;

  const limiteDireitaX = Math.max(m, larguraJanela - w - m);
  const limiteBaixoY = Math.max(m, alturaJanela - h - m);

  cantoSuperiorEsquerdoNotaEmCoordenadasViewportX = Math.min(
    Math.max(cantoSuperiorEsquerdoNotaEmCoordenadasViewportX, m),
    limiteDireitaX
  );
  cantoSuperiorEsquerdoNotaEmCoordenadasViewportY = Math.min(
    Math.max(cantoSuperiorEsquerdoNotaEmCoordenadasViewportY, m),
    limiteBaixoY
  );

  const localX = cantoSuperiorEsquerdoNotaEmCoordenadasViewportX - retanguloViewportRaizScroll.left;
  const localY = cantoSuperiorEsquerdoNotaEmCoordenadasViewportY - retanguloViewportRaizScroll.top;

  return {
    x: Math.max(0, Math.round(localX)),
    y: Math.max(0, Math.round(localY)),
  };
}

function FacilitadorPostItAlcaRedimensionamentoCantoInferiorDireito({
  noteId,
  width,
  height,
  minimized,
  updateNote,
  onGestureStart,
  onGestureEnd,
}) {
  if (minimized) return null;

  return (
    <Box
      title="Arraste para redimensionar"
      aria-label="Arrastar canto inferior direito para redimensionar"
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.currentTarget;

        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          //
        }

        onGestureStart?.();

        const pId = e.pointerId;

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = width;
        const startH = height;

        let latestPointerEv = null;
        let rafScheduled = false;

        const clampSize = (w, h) => {
          const maxW =
            typeof window !== 'undefined' ? Math.max(NOTE_MIN_WIDTH, window.innerWidth - 24) : startW * 10;
          const maxH =
            typeof window !== 'undefined' ? Math.max(NOTE_MIN_HEIGHT, window.innerHeight * 0.92) : startH * 10;
          return {
            w: Math.min(maxW, Math.max(NOTE_MIN_WIDTH, w)),
            h: Math.min(maxH, Math.max(NOTE_MIN_HEIGHT, h)),
          };
        };

        const end = () => {
          window.removeEventListener('pointermove', move, true);
          window.removeEventListener('pointerup', end, true);
          window.removeEventListener('pointercancel', end, true);
          try {
            el.releasePointerCapture?.(pId);
          } catch {
            //
          }
          latestPointerEv = null;
          rafScheduled = false;
          onGestureEnd?.();
        };

        const flushFrame = () => {
          const evLatest = latestPointerEv;
          rafScheduled = false;
          if (!evLatest || evLatest.pointerId !== pId) return;

          const dw = evLatest.clientX - startX;
          const dh = evLatest.clientY - startY;
          const { w, h } = clampSize(startW + dw, startH + dh);

          updateNote(noteId, { width: Math.round(w), height: Math.round(h) });
        };

        const move = (ev) => {
          if (ev.pointerId !== pId) return;
          latestPointerEv = ev;
          if (rafScheduled) return;
          rafScheduled = true;
          requestAnimationFrame(flushFrame);
        };

        window.addEventListener('pointermove', move, true);
        window.addEventListener('pointerup', end, true);
        window.addEventListener('pointercancel', end, true);
      }}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 22,
        height: 22,
        cursor: 'nwse-resize',
        touchAction: 'none',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '2px 3px 3px 2px',
        background:
          'linear-gradient(315deg, rgba(255,255,255,0) 56%, rgba(0,0,0,0.18) 56%, rgba(0,0,0,0.18) 100%)',
      }}
    />
  );
}

const POST_IT_SIZE_TRANSITION_CSS =
  'width 220ms cubic-bezier(0.33, 1, 0.68, 1), height 220ms cubic-bezier(0.33, 1, 0.68, 1), border-radius 240ms cubic-bezier(0.33, 1, 0.68, 1)';

const POST_IT_TRANSITION_OPACITY_CSS_SEGMENTO_PARA_FEEDBACK_VISUAL = 'opacity 260ms cubic-bezier(0.33, 1, 0.68, 1)';

function montaListaDeTransitionsDoCartaoOuPostItDoFacilitadorReuniaoComPostItsQuandoSemiTransparent ({
  permiteTransicaoTamanhoOuLayoutDoCartao,
}) {
  const partes = [];
  if (permiteTransicaoTamanhoOuLayoutDoCartao !== false) {
    partes.push(POST_IT_SIZE_TRANSITION_CSS);
  }
  partes.push(POST_IT_TRANSITION_OPACITY_CSS_SEGMENTO_PARA_FEEDBACK_VISUAL);
  return partes.join(', ');
}

const FacilitadorPostItItem = forwardRef(function FacilitadorPostItItem(
  {
    note,
    updateNote,
    removeNote,
    suppressPaperSizeTransitionDuringResizeGrab,
    onResizeGripGestureStart,
    onResizeGripGestureEnd,
    notasTranslucidasOuPreferenciaSemiTransparenteDoUsuarioNestaPagina,
    tamanhoFonteTextoPostItEmPxDoUsuario = NOTE_FONT_SIZE_DEFAULT_PX,
    onAbrirModalVisualizacaoAmpliadaImagemClipboardPrint,
    /** Ordem 1…N na rota atual (mesmo índice da coluna “Nota” no Markdown exportado). */
    numeroNotaOrdemExibicaoChipMinimizadoBaseUm,
    ...draggableProps
  },
  forwardedRef
) {
  const [paletaCorDoPostItAberta, setPaletaCorDoPostItAberta] = useState(false);
  const n = pickNote(note);
  const minimized = n.minimized;

  const handlePastePrintClipboardNaAreaTextoPostIt = useCallback(
    async (event) => {
      const itens = event.clipboardData?.items;
      if (!itens?.length) return;
      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const arquivoOuBlob = item.getAsFile();
          if (!arquivoOuBlob) continue;
          const listaAtual = pickNote(note).imagensClipboardPostItFacilitadorPrintScreen;
          if (listaAtual.length >= MAX_IMAGENS_CLIPBOARD_PRINT_SCREEN_POR_NOTA_POST_IT_FACILITADOR) {
            notifications.show({
              title: 'Limite de imagens',
              message: `No máximo ${MAX_IMAGENS_CLIPBOARD_PRINT_SCREEN_POR_NOTA_POST_IT_FACILITADOR} prints por nota nesta PoC.`,
              color: 'yellow',
            });
            return;
          }
          try {
            const dataUrlRedimensionadoJpeg = await converteBlobImagemClipboardParaDataUrlJpegRedimensionado(
              arquivoOuBlob,
              LARGURA_MAXIMA_PIXELS_REDIM_CLIPBOARD_PRINT_POST_IT
            );
            updateNote(note.id, {
              imagensClipboardPostItFacilitadorPrintScreen: [
                ...listaAtual,
                {
                  id: `img-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                  dataUrl: dataUrlRedimensionadoJpeg,
                },
              ],
            });
            notifications.show({
              title: 'Print colado',
              message: 'Imagem adicionada à nota.',
              color: 'teal',
            });
          } catch {
            notifications.show({
              title: 'Não foi possível colar',
              message: 'Tente capturar de novo ou usar outro formato.',
              color: 'red',
            });
          }
          return;
        }
      }
    },
    [note, updateNote]
  );

  const textoNormalizado = String(note.text || '')
    .trim()
    .replace(/\s+/g, ' ');
  const tooltipCompletoMinimizado =
    textoNormalizado.length > 420
      ? `${textoNormalizado.slice(0, 420)}…`
      : textoNormalizado || '(vazio — clique para abrir e anotar)';

  const permiteTransicaoTamanho = suppressPaperSizeTransitionDuringResizeGrab !== true;
  const transicaoVisualDoCartao = montaListaDeTransitionsDoCartaoOuPostItDoFacilitadorReuniaoComPostItsQuandoSemiTransparent(
    {
      permiteTransicaoTamanhoOuLayoutDoCartao: permiteTransicaoTamanho,
    }
  );

  /** Translúcido só no chip minimizado; expandido fica sempre opaco. */
  const opacidadeDoCartao =
    minimized && notasTranslucidasOuPreferenciaSemiTransparenteDoUsuarioNestaPagina === true
      ? OPACIDADE_POST_IT_MODO_TRANSLUCIDO
      : 1;

  if (minimized) {
    return (
      <Paper
        ref={forwardedRef}
        {...draggableProps}
        withBorder
        shadow="lg"
        radius="lg"
        style={{
          ...draggableProps.style,
          position: 'absolute',
          width: NOTE_ICON_CHIP_SIDE,
          height: NOTE_ICON_CHIP_SIDE,
          minWidth: NOTE_ICON_CHIP_SIDE,
          minHeight: NOTE_ICON_CHIP_SIDE,
          maxWidth: NOTE_ICON_CHIP_SIDE,
          maxHeight: NOTE_ICON_CHIP_SIDE,
          boxSizing: 'border-box',
          pointerEvents: 'auto',
          backgroundColor: n.color,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          overflow: 'visible',
          borderRadius: '16px',
          opacity: opacidadeDoCartao,
          transition: transicaoVisualDoCartao,
        }}
      >
        <Box
          className="post-it-mini-drag-handle post-it-drag-com-firma-para-arrastar-globalmente"
          aria-label="Arrastar nota minimizada"
          style={{
            width: 13,
            flexShrink: 0,
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid rgba(0,0,0,0.12)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.04) 100%)',
          }}
        >
          <IconGripVertical size={14} color="rgba(0,0,0,0.45)" aria-hidden />
        </Box>

        <Tooltip
          label={tooltipCompletoMinimizado}
          position="bottom"
          withArrow
          multiline
          w={260}
          openDelay={200}
          withinPortal
        >
          <UnstyledButton
            type="button"
            aria-label={`Abrir post-it nota ${typeof numeroNotaOrdemExibicaoChipMinimizadoBaseUm === 'number' ? numeroNotaOrdemExibicaoChipMinimizadoBaseUm : '?'} minimizado${
              textoNormalizado.length > 0 ? ` (${textoNormalizado.slice(0, 40)}${textoNormalizado.length > 40 ? '…' : ''})` : ''
            }`}
            tabIndex={0}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              updateNote(note.id, { minimized: false });
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                borderRadius: 10,
              }}
            >
              {typeof numeroNotaOrdemExibicaoChipMinimizadoBaseUm === 'number' ? (
                <Text
                  fw={800}
                  size={numeroNotaOrdemExibicaoChipMinimizadoBaseUm >= 10 ? 11 : 13}
                  lh={1}
                  style={{
                    color: 'rgba(15, 23, 42, 0.92)',
                    textShadow: '0 0 3px rgba(255,255,255,0.75), 0 0 1px rgba(255,255,255,0.9)',
                    userSelect: 'none',
                  }}
                >
                  {numeroNotaOrdemExibicaoChipMinimizadoBaseUm}
                </Text>
              ) : (
                <IconNotes size={24} stroke={1.85} style={{ opacity: 0.88 }} />
              )}
            </Box>
          </UnstyledButton>
        </Tooltip>

        <ActionIcon
          variant="filled"
          color="red"
          size="xs"
          radius="xl"
          aria-label="Remover post-it"
          title="Remover"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            removeNote(note.id);
          }}
          style={{
            position: 'absolute',
            top: -7,
            right: -7,
            minWidth: 22,
            minHeight: 22,
            padding: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}
        >
          <IconTrash size={13} stroke={2} />
        </ActionIcon>
      </Paper>
    );
  }

  return (
    <Paper
      ref={forwardedRef}
      data-facilitador-post-it-expanded-note-id={note.id}
      {...draggableProps}
      withBorder
      shadow="lg"
      radius="md"
      style={{
        ...draggableProps.style,
        position: 'absolute',
        width: n.width,
        height: n.height,
        boxSizing: 'border-box',
        pointerEvents: 'auto',
        backgroundColor: n.color,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: NOTE_MIN_WIDTH,
        minHeight: NOTE_MIN_HEIGHT,
        maxHeight: '90vh',
        opacity: opacidadeDoCartao,
        transition: transicaoVisualDoCartao,
      }}
    >
      <FacilitadorPostItAlcaRedimensionamentoCantoInferiorDireito
        noteId={note.id}
        width={n.width}
        height={n.height}
        minimized={minimized}
        updateNote={updateNote}
        onGestureStart={onResizeGripGestureStart}
        onGestureEnd={onResizeGripGestureEnd}
      />

      <Box
        className="post-it-drag-com-firma-para-arrastar-globalmente"
        style={{
          cursor: 'move',
          padding: '8px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 8,
        }}
      >
        <Text size="xs" fw={700} lineClamp={1} style={{ flex: 1, minWidth: 0 }}>
          Post-it
        </Text>
        <Group gap={4} wrap="nowrap">
          <Popover
            opened={paletaCorDoPostItAberta}
            onClose={() => setPaletaCorDoPostItAberta(false)}
            position="bottom-end"
            withArrow
            shadow="md"
            withinPortal
            zIndex={Z_INDEX_FACILITADOR_ELEMENTOS_PORTAIS_MENU_POPOVER_SUBMENU_ACIMA_DO_OVERLAY}
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                title="Cor do post-it"
                aria-label="Abrir paleta de cores do post-it"
                aria-expanded={paletaCorDoPostItAberta}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setPaletaCorDoPostItAberta((aberto) => !aberto);
                }}
              >
                <IconPalette size={14} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p="xs" onPointerDown={(e) => e.stopPropagation()}>
              <Text size="xs" fw={600} mb={6}>
                Cor
              </Text>
              <Group gap={8}>
                {NOTE_COLORS.map((cor) => (
                  <UnstyledButton
                    key={cor}
                    type="button"
                    aria-label={`Cor ${cor}`}
                    title={cor}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNote(note.id, { color: cor });
                      setPaletaCorDoPostItAberta(false);
                    }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      flexShrink: 0,
                      backgroundColor: cor,
                      border:
                        n.color === cor ? '2px solid rgba(15,23,42,0.55)' : '1px solid rgba(0,0,0,0.14)',
                    }}
                  />
                ))}
              </Group>
            </Popover.Dropdown>
          </Popover>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            title="Minimizar como ícone na tela"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              updateNote(note.id, { minimized: true });
            }}
          >
            <IconChevronUp size={14} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            title="Remover post-it"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              removeNote(note.id);
            }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Box>

      <Box
        p="xs"
        pt={4}
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Textarea
          rows={8}
          placeholder="Texto… Cole print com Ctrl+V na área focada."
          value={note.text}
          onChange={(event) => updateNote(note.id, { text: event.currentTarget.value })}
          onPaste={handlePastePrintClipboardNaAreaTextoPostIt}
          styles={{
            root: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              minWidth: 0,
              width: '100%',
              alignSelf: 'stretch',
            },
            wrapper: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              minWidth: 0,
              width: '100%',
            },
            input: {
              width: '100%',
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              padding: 0,
              resize: 'none',
              fontSize: limitaTamanhoFontePostItPxUsuarioAoIntervaloPermitidoParaSliderIntegrador(
                tamanhoFonteTextoPostItEmPxDoUsuario
              ),
              flex: 1,
              overflowY: 'auto',
              boxSizing: 'border-box',
            },
          }}
        />

        {n.imagensClipboardPostItFacilitadorPrintScreen.length > 0 && (
          <Box mt={6} style={{ maxHeight: 200, overflowY: 'auto', flexShrink: 0 }}>
            <Group gap={4} align="center" mb={4}>
              <IconPhoto size={14} aria-hidden style={{ opacity: 0.65 }} />
              <Text size="xs" c="dimmed">
                Prints colados ({n.imagensClipboardPostItFacilitadorPrintScreen.length}/
                {MAX_IMAGENS_CLIPBOARD_PRINT_SCREEN_POR_NOTA_POST_IT_FACILITADOR})
              </Text>
            </Group>
            <Stack gap={8}>
              {n.imagensClipboardPostItFacilitadorPrintScreen.map((itemImagemClipboard) => (
                <Box
                  key={itemImagemClipboard.id}
                  style={{
                    position: 'relative',
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: 'rgba(255,255,255,0.5)',
                  }}
                >
                  <button
                    type="button"
                    className="facilitador-post-it-botao-ampliar-print"
                    title="Clique para ver em tamanho maior"
                    aria-label="Ampliar imagem colada"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAbrirModalVisualizacaoAmpliadaImagemClipboardPrint?.(itemImagemClipboard.dataUrl);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: 0,
                      margin: 0,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'zoom-in',
                      font: 'inherit',
                      textAlign: 'inherit',
                      color: 'inherit',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- data URL gerada no cliente */}
                    <img
                      src={itemImagemClipboard.dataUrl}
                      alt=""
                      style={{
                        display: 'block',
                        width: '100%',
                        maxHeight: 140,
                        objectFit: 'contain',
                        verticalAlign: 'top',
                        pointerEvents: 'none',
                      }}
                    />
                  </button>
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="xs"
                    radius="xl"
                    aria-label="Remover imagem colada"
                    title="Remover imagem"
                    style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNote(note.id, {
                        imagensClipboardPostItFacilitadorPrintScreen:
                          n.imagensClipboardPostItFacilitadorPrintScreen.filter(
                            (img) => img.id !== itemImagemClipboard.id
                          ),
                      });
                    }}
                  >
                    <IconTrash size={12} stroke={2} />
                  </ActionIcon>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Paper>
  );
});

export default function FacilitadorModoReuniaoComPostIts({ scrollRootSelector = '#facilitador-scroll-root' }) {
  const pathname = usePathname();
  const noteRefs = useRef({});
  const [idDoPostItCujaAlcaDeRedimensaoEstaAtivaOuNull, setIdPostItCujaAlcaRedimensaoEstaAtivaOuNull] =
    useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollRootEl, setScrollRootEl] = useState(null);
  /** Card "Modo de Reunião". Post-its podem ficar visíveis com o painel fechado. */
  const [painelModoReuniaoAberto, setPainelModoReuniaoAberto] = useState(false);
  const [notesVisible, setNotesVisible] = useState(true);
  const [notesByRoute, setNotesByRoute] = useState({});
  const [
    dadosQualRotasPossuiModoTranslucidadeAtivoParaPreferenciaUsuarioAoRecarregaPaginaOuNavegar,
    setPreferenciaTranslucidasPorSnapshotDeRota,
  ] = useState({});
  const [tamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador, setTamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador] =
    useState(NOTE_FONT_SIZE_DEFAULT_PX);
  /** Modal de preview fora do `<Draggable>` para clique na miniatura não ser interceptado. */
  const [visualizacaoAmpliadaPrintClipboardDataUrlOuNull, setVisualizacaoAmpliadaPrintClipboardDataUrlOuNull] =
    useState(null);
  const [
    minimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador,
    setMinimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador,
  ] = useState(false);

  useLayoutEffect(() => {
    const el =
      typeof document !== 'undefined' ? document.querySelector(scrollRootSelector) : null;
    setScrollRootEl(el);
  }, [scrollRootSelector, pathname]);

  useEffect(() => {
    setIsMounted(true);
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), {});
    setNotesByRoute(saved);
    const rawTranslucidoNovo = localStorage.getItem(STORAGE_KEY_NOTAS_TRANSLUCIDAS_POR_ROTA);
    let salvoTranslucido =
      rawTranslucidoNovo != null
        ? safeParse(rawTranslucidoNovo, {})
        : safeParse(localStorage.getItem(STORAGE_KEY_NOTAS_TRANSLUCIDAS_POR_ROTA_ANTIGA), {});
    if (typeof salvoTranslucido !== 'object' || salvoTranslucido === null) {
      salvoTranslucido = {};
    }
    setPreferenciaTranslucidasPorSnapshotDeRota(salvoTranslucido);

    const salvoFontePxGlobal = localStorage.getItem(STORAGE_KEY_FACILITADOR_POST_IT_FONT_SIZE_PX_GLOBAL);
    if (salvoFontePxGlobal != null) {
      setTamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador(
        limitaTamanhoFontePostItPxUsuarioAoIntervaloPermitidoParaSliderIntegrador(parseInt(salvoFontePxGlobal, 10))
      );
    }

    const salvoMinimizarAntesScreenshotExportMd = localStorage.getItem(
      STORAGE_KEY_MINIMIZAR_NOTAS_ANTES_SCREENSHOT_EXPORT_MARKDOWN_MODO_REUNIAO
    );
    if (salvoMinimizarAntesScreenshotExportMd === 'true') {
      setMinimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesByRoute));
  }, [isMounted, notesByRoute]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(
      STORAGE_KEY_NOTAS_TRANSLUCIDAS_POR_ROTA,
      JSON.stringify(dadosQualRotasPossuiModoTranslucidadeAtivoParaPreferenciaUsuarioAoRecarregaPaginaOuNavegar)
    );
  }, [isMounted, dadosQualRotasPossuiModoTranslucidadeAtivoParaPreferenciaUsuarioAoRecarregaPaginaOuNavegar]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(
      STORAGE_KEY_FACILITADOR_POST_IT_FONT_SIZE_PX_GLOBAL,
      String(tamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador)
    );
  }, [isMounted, tamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(
      STORAGE_KEY_MINIMIZAR_NOTAS_ANTES_SCREENSHOT_EXPORT_MARKDOWN_MODO_REUNIAO,
      minimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador ? 'true' : 'false'
    );
  }, [isMounted, minimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador]);

  const currentRouteNotes = useMemo(() => {
    return notesByRoute[pathname] || [];
  }, [notesByRoute, pathname]);

  const totalNotasSomandoTodasAsRotasPersistidas = useMemo(
    () =>
      Object.values(notesByRoute).reduce(
        (acc, listaDeUmaRota) => acc + (Array.isArray(listaDeUmaRota) ? listaDeUmaRota.length : 0),
        0
      ),
    [notesByRoute]
  );

  const copiarMarkdownDasNotasParaAreaDeTransferencia = useCallback(
    async (escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown) => {
      const filtroPathnameOuNull =
        escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown === 'esta' ? pathname : null;

      const totalNotasPreliminarSomenteContagem =
        filtroPathnameOuNull != null
          ? (notesByRoute[filtroPathnameOuNull] || []).length
          : Object.values(notesByRoute).reduce(
              (acc, listaDeUmaRota) => acc + (Array.isArray(listaDeUmaRota) ? listaDeUmaRota.length : 0),
              0
            );

      if (totalNotasPreliminarSomenteContagem === 0) {
        notifications.show({
          title: 'Nada para exportar',
          message:
            escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown === 'esta'
              ? 'Não há notas na página atual.'
              : 'Não há notas em nenhuma rota salva.',
          color: 'yellow',
        });
        return;
      }

      /** Cópia: sem `html2canvas` nem miniaturas — clipboard e editores agradecem. */
      const { markdown, totalNotas } = montaMarkdownExportacaoNotasFacilitadorModoReuniao(
        notesByRoute,
        filtroPathnameOuNull,
        {
          screenshotPaginaDataUrlImagemOuNull: null,
          incluirMidiasEmbutidasNoMarkdown: false,
        }
      );
      try {
        await navigator.clipboard.writeText(markdown);
        notifications.show({
          title: 'Markdown copiado (sem imagens embutidas)',
          message: `${totalNotas} nota(s). Texto leve para colar. Use “Baixar .md” se precisar de screenshot e prints na tabela.`,
          color: 'teal',
        });
      } catch {
        notifications.show({
          title: 'Não foi possível copiar',
          message:
            'Conteúdo pode ser grande (screenshot embutido). Tente “Baixar .md” ou export sem captura em outro navegador.',
          color: 'red',
        });
      }
    },
    [notesByRoute, pathname]
  );

  const baixarArquivoMarkdownDasNotasViaDownloadDoNavegador = useCallback(
    async (escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown) => {
      const filtroPathnameOuNull =
        escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown === 'esta' ? pathname : null;

      const totalNotasPreliminarSomenteContagem =
        filtroPathnameOuNull != null
          ? (notesByRoute[filtroPathnameOuNull] || []).length
          : Object.values(notesByRoute).reduce(
              (acc, listaDeUmaRota) => acc + (Array.isArray(listaDeUmaRota) ? listaDeUmaRota.length : 0),
              0
            );

      if (totalNotasPreliminarSomenteContagem === 0) {
        notifications.show({
          title: 'Nada para exportar',
          message:
            escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown === 'esta'
              ? 'Não há notas na página atual.'
              : 'Não há notas em nenhuma rota salva.',
          color: 'yellow',
        });
        return;
      }

      let screenshotPaginaDataUrlImagemOuNull = null;
      if (escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown === 'esta') {
        screenshotPaginaDataUrlImagemOuNull =
          await capturaScreenshotExportMarkdownEstaPaginaComRestauracaoMinimizadoSeOpcaoAtivaFacilitador({
            notesByRoute,
            setNotesByRoute,
            pathname,
            scrollRootSelector,
            minimizarNotasAntesDoScreenshotExportMarkdown:
              minimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador,
          });
      }

      const { markdown, totalNotas } = montaMarkdownExportacaoNotasFacilitadorModoReuniao(
        notesByRoute,
        filtroPathnameOuNull,
        { screenshotPaginaDataUrlImagemOuNull }
      );
      const nomeBaseArquivoDownloadSemExtensao = montaNomeArquivoBasicoExportMarkdownModoReuniao(
        escopoSomenteEstaPaginaOuTodasAsRotasSomenteExportMarkdown === 'esta' ? 'esta' : 'todas',
        pathname
      );
      disparaDownloadTextoComoArquivoMarkdownNoNavegador(markdown, nomeBaseArquivoDownloadSemExtensao);
      notifications.show({
        title: 'Download do .md',
        message: `Arquivo ${nomeBaseArquivoDownloadSemExtensao}.md (${totalNotas} nota(s)).`,
        color: 'teal',
      });
    },
    [
      notesByRoute,
      pathname,
      scrollRootSelector,
      setNotesByRoute,
      minimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador,
    ]
  );

  const translucidasNestaRotaOuFalseSeUsuarioNuncaAtivou = Boolean(
    dadosQualRotasPossuiModoTranslucidadeAtivoParaPreferenciaUsuarioAoRecarregaPaginaOuNavegar[pathname]
  );

  const addNote = useCallback(() => {
    const posicaoInicialVisivelViewportParaNovoPostItFacilitador =
      calculaPosicaoInicialPostItDentroDaViewportParaCriacaoFacilitadorModoReuniao(
        scrollRootSelector,
        NOTE_DEFAULT_WIDTH,
        NOTE_DEFAULT_HEIGHT
      );
    const novaNotaCriadaFacilitadorModoReuniao = createNote(
      pathname,
      posicaoInicialVisivelViewportParaNovoPostItFacilitador
    );
    setNotesByRoute((prev) => {
      const existing = prev[pathname] || [];
      return {
        ...prev,
        [pathname]: [...existing, novaNotaCriadaFacilitadorModoReuniao],
      };
    });
    setNotesVisible(true);

    const idNotaParaFocarTextareaAposRender = novaNotaCriadaFacilitadorModoReuniao.id;
    const focarTextareaDoPostItCriadoAposPaint = () => {
      const elementoRaizPostItExpandido = document.querySelector(
        `[data-facilitador-post-it-expanded-note-id="${idNotaParaFocarTextareaAposRender}"]`
      );
      elementoRaizPostItExpandido?.querySelector('textarea')?.focus();
    };
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          focarTextareaDoPostItCriadoAposPaint();
          window.setTimeout(focarTextareaDoPostItCriadoAposPaint, 50);
        });
      });
    });
  }, [pathname, scrollRootSelector]);

  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (event) => {
      if (!(event.ctrlKey && event.altKey)) return;
      if (event.repeat) return;

      /**
       * `event.code` (KeyM / KeyN): com Alt+Ctrl o `event.key` às vezes não é uma letra (Chrome/Windows, teclados ABNT).
       * Captura na fase *capture* reduz chance de outro listener consumir antes.
       */
      const codigoFisicoTeclaPressionada = event.code;

      if (codigoFisicoTeclaPressionada === 'KeyM') {
        event.preventDefault();
        event.stopPropagation();
        setPainelModoReuniaoAberto((prev) => !prev);
        return;
      }

      if (codigoFisicoTeclaPressionada === 'KeyN') {
        const alvo = event.target;
        const tag = typeof alvo?.tagName === 'string' ? alvo.tagName.toLowerCase() : '';
        const digitandoEmCampoDeTextoOuSimilar =
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          alvo?.isContentEditable === true ||
          alvo?.getAttribute?.('role') === 'textbox';
        if (digitandoEmCampoDeTextoOuSimilar) return;

        event.preventDefault();
        event.stopPropagation();
        addNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isMounted, addNote]);

  const updateNote = useCallback((noteId, partialData) => {
    setNotesByRoute((prev) => {
      const routeNotes = prev[pathname] || [];
      const updated = routeNotes.map((note) =>
        note.id === noteId ? { ...note, ...partialData } : note
      );
      return { ...prev, [pathname]: updated };
    });
  }, [pathname]);

  const removeNote = (noteId) => {
    delete noteRefs.current[noteId];
    setNotesByRoute((prev) => {
      const updated = (prev[pathname] || []).filter((note) => note.id !== noteId);
      return { ...prev, [pathname]: updated };
    });
  };

  const clearCurrentRouteNotes = () => {
    noteRefs.current = {};
    setNotesByRoute((prev) => ({ ...prev, [pathname]: [] }));
  };

  const temPostItsNaPaginaAtual = currentRouteNotes.length > 0;
  const shouldShowPostIts = !!scrollRootEl && notesVisible && temPostItsNaPaginaAtual;

  const opacidadeDoBotaoFlutuanteInferiorDireitoModoReuniao = painelModoReuniaoAberto
    ? 0.9
    : temPostItsNaPaginaAtual
      ? 0.32
      : 0.14;

  const postItsLayer = shouldShowPostIts
    ? createPortal(
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            minHeight: '100%',
            pointerEvents: 'none',
            zIndex: 2000,
          }}
        >
          {currentRouteNotes.map((note, indiceZeroNotaNaRotaAtual) => {
            if (!noteRefs.current[note.id]) {
              noteRefs.current[note.id] = createRef();
            }

            const noteRef = noteRefs.current[note.id];

            return (
              <Fragment key={note.id}>
                <Draggable
                  handle=".post-it-drag-com-firma-para-arrastar-globalmente"
                  cancel=".facilitador-post-it-botao-ampliar-print"
                  nodeRef={noteRef}
                  defaultPosition={note.position}
                  bounds="parent"
                  onStop={(_, data) => {
                    updateNote(note.id, { position: { x: data.x, y: data.y } });
                  }}
                >
                  <FacilitadorPostItItem
                    note={note}
                    ref={noteRef}
                    updateNote={updateNote}
                    removeNote={removeNote}
                    suppressPaperSizeTransitionDuringResizeGrab={
                      idDoPostItCujaAlcaDeRedimensaoEstaAtivaOuNull === note.id
                    }
                    onResizeGripGestureStart={() => setIdPostItCujaAlcaRedimensaoEstaAtivaOuNull(note.id)}
                    onResizeGripGestureEnd={() =>
                      setIdPostItCujaAlcaRedimensaoEstaAtivaOuNull((valorAtual) =>
                        valorAtual === note.id ? null : valorAtual
                      )
                    }
                    notasTranslucidasOuPreferenciaSemiTransparenteDoUsuarioNestaPagina={
                      translucidasNestaRotaOuFalseSeUsuarioNuncaAtivou
                    }
                    tamanhoFonteTextoPostItEmPxDoUsuario={tamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador}
                    onAbrirModalVisualizacaoAmpliadaImagemClipboardPrint={
                      setVisualizacaoAmpliadaPrintClipboardDataUrlOuNull
                    }
                    numeroNotaOrdemExibicaoChipMinimizadoBaseUm={indiceZeroNotaNaRotaAtual + 1}
                  />
                </Draggable>
              </Fragment>
            );
          })}
        </div>,
        scrollRootEl
      )
    : null;

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {postItsLayer}

      <Modal
        opened={visualizacaoAmpliadaPrintClipboardDataUrlOuNull != null}
        onClose={() => setVisualizacaoAmpliadaPrintClipboardDataUrlOuNull(null)}
        title="Visualizar print"
        centered
        zIndex={Z_INDEX_FACILITADOR_MODAL_VISUALIZACAO_AMPLIADA_IMAGEM_CLIPBOARD_PRINT_POST_IT_ACIMA_DE_TUDO}
        size="xl"
        overlayProps={{ opacity: 0.55, blur: 2 }}
        portalProps={
          typeof document !== 'undefined' ? { target: document.body } : undefined
        }
        styles={{
          content: { maxWidth: 'min(96vw, 1200px)' },
          body: { paddingTop: 'var(--mantine-spacing-sm)' },
        }}
      >
        {visualizacaoAmpliadaPrintClipboardDataUrlOuNull && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxHeight: 'min(86vh, calc(100dvh - 120px))',
              overflow: 'auto',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL gerada no cliente */}
            <img
              src={visualizacaoAmpliadaPrintClipboardDataUrlOuNull}
              alt="Print colado ampliado"
              style={{
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                maxHeight: 'min(86vh, calc(100dvh - 120px))',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
      </Modal>

      <Box
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: Z_INDEX_FACILITADOR_CONTAINER_OVERLAY_CAMADA_FIXA_COM_PAINEL_E_FAB,
          pointerEvents: 'none',
        }}
      >
        <ActionIcon
          variant="filled"
          radius="xl"
          size="md"
          title={
            painelModoReuniaoAberto
              ? 'Fechar painel do modo reunião (notas podem ficar na tela) — Ctrl + Alt + M'
              : 'Abrir painel do modo reunião — Ctrl + Alt + M'
          }
          onClick={() => setPainelModoReuniaoAberto((prev) => !prev)}
          style={{
            position: 'fixed',
            right: 10,
            bottom: 10,
            pointerEvents: 'auto',
            opacity: opacidadeDoBotaoFlutuanteInferiorDireitoModoReuniao,
            transition: 'opacity 0.2s ease',
            backgroundColor: '#4c6ef5',
          }}
        >
          <IconNotes size={14} />
        </ActionIcon>

        {painelModoReuniaoAberto && (
          <Paper
            withBorder
            shadow="md"
            p="sm"
            radius="md"
            style={{
              position: 'fixed',
              right: 12,
              bottom: 52,
              width: 320,
              pointerEvents: 'auto',
              background: '#ffffff',
            }}
          >
            <Stack gap="xs">
              <Group justify="space-between" align="center">
                <Text fw={700} size="sm">
                  Modo de Reunião
                </Text>
                <Badge color="indigo" variant="light" size="sm">
                  {currentRouteNotes.length} nota(s)
                </Badge>
              </Group>

              <Text size="xs" c="dimmed">
                Página atual: {pathname}. Atalhos: <strong>Ctrl+Alt+M</strong> abre/fecha este painel;{' '}
                <strong>Ctrl+Alt+N</strong> novo post-it (visível na tela, mesmo com rolagem). Arraste pela barra
                ou pela faixa fina no ícone minimizado.
              </Text>

              <Button
                size="xs"
                variant="light"
                color="gray"
                leftSection={<IconLayoutSidebarRightCollapse size={14} />}
                onClick={() => setPainelModoReuniaoAberto(false)}
              >
                Esconder só o menu (mantém os post-its)
              </Button>

              <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
                <Group gap={6} align="center" wrap="nowrap">
                  <IconBlur size={16} stroke={1.65} aria-hidden />
                  <Stack gap={0}>
                    <Text size="xs" fw={600} lh={1.3}>
                      Notas translúcidas
                    </Text>
                    <Text size="xs" c="dimmed" lh={1.35}>
                      Só nesta página e só no chip minimizado; ao expandir, a nota fica sólida.
                    </Text>
                  </Stack>
                </Group>
                <Switch
                  checked={translucidasNestaRotaOuFalseSeUsuarioNuncaAtivou}
                  onChange={(event) => {
                    // Não use event.currentTarget dentro do updater do setState: o evento pode ser
                    // reutilizado e currentTarget vira null antes do reducer rodar (React 19).
                    const proximoValorBooleanoChecked = event.currentTarget.checked;
                    setPreferenciaTranslucidasPorSnapshotDeRota((prev) => ({
                      ...prev,
                      [pathname]: proximoValorBooleanoChecked,
                    }));
                  }}
                  color="indigo"
                  size="sm"
                  aria-label="Translúcidas só quando a nota estiver minimizada (chip), nesta página"
                />
              </Group>

              <Stack gap={6}>
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Text size="xs" fw={600}>
                    Fonte do texto nas notas
                  </Text>
                  <Text size="xs" c="dimmed" ff="monospace">
                    {tamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador}px
                  </Text>
                </Group>
                <Slider
                  min={NOTE_FONT_SIZE_MIN_PX}
                  max={NOTE_FONT_SIZE_MAX_PX}
                  step={1}
                  value={tamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador}
                  onChange={(valorPxSliderPostIt) =>
                    setTamanhoFontePostItPxPreferenciaUsuarioGlobalNavegador(
                      limitaTamanhoFontePostItPxUsuarioAoIntervaloPermitidoParaSliderIntegrador(valorPxSliderPostIt)
                    )
                  }
                  color="indigo"
                  size="sm"
                  marks={[
                    { value: NOTE_FONT_SIZE_MIN_PX, label: `${NOTE_FONT_SIZE_MIN_PX}` },
                    { value: NOTE_FONT_SIZE_DEFAULT_PX, label: `${NOTE_FONT_SIZE_DEFAULT_PX}` },
                    { value: NOTE_FONT_SIZE_MAX_PX, label: `${NOTE_FONT_SIZE_MAX_PX}` },
                  ]}
                  aria-label="Tamanho da fonte do texto nos post-its expandidos"
                />
              </Stack>

              <Menu
                shadow="md"
                width={280}
                position="bottom-start"
                withinPortal
                zIndex={Z_INDEX_FACILITADOR_ELEMENTOS_PORTAIS_MENU_POPOVER_SUBMENU_ACIMA_DO_OVERLAY}
              >
                <Menu.Target>
                  <Button
                    fullWidth
                    size="xs"
                    variant="light"
                    color="gray"
                    leftSection={<IconMarkdown size={14} />}
                    rightSection={<IconChevronDown size={12} />}
                  >
                    Exportar Markdown
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Opcional (screenshot — só “esta página”)</Menu.Label>
                  <Menu.Item
                    component="div"
                    closeMenuOnClick={false}
                    p="xs"
                    style={{ cursor: 'default' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Group justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                      <Text size="xs" lh={1.35} style={{ flex: 1 }}>
                        Minimizar notas antes do screenshot ao exportar esta página
                      </Text>
                      <Switch
                        size="sm"
                        color="indigo"
                        checked={minimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador}
                        onChange={(event) => {
                          const checked = event.currentTarget.checked;
                          setMinimizarNotasAntesScreenshotExportMarkdownEstaPaginaSomentePreferenciaUsuarioNavegador(
                            checked
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Minimizar todas as notas antes do screenshot na exportação desta página"
                      />
                    </Group>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Copiar (texto leve, sem imagens embutidas)</Menu.Label>
                  <Menu.Item
                    disabled={currentRouteNotes.length === 0}
                    leftSection={<IconCopy size={14} />}
                    description="Recomendado p/ issues e e-mail. Screenshot e miniaturas: use Baixar."
                    onClick={() => void copiarMarkdownDasNotasParaAreaDeTransferencia('esta')}
                  >
                    Esta página ({currentRouteNotes.length}{' '}
                    {currentRouteNotes.length === 1 ? 'nota' : 'notas'})
                  </Menu.Item>
                  <Menu.Item
                    disabled={totalNotasSomandoTodasAsRotasPersistidas === 0}
                    leftSection={<IconCopy size={14} />}
                    description="Mesmo formato leve, sem base64 no clipboard."
                    onClick={() => void copiarMarkdownDasNotasParaAreaDeTransferencia('todas')}
                  >
                    Todas as rotas ({totalNotasSomandoTodasAsRotasPersistidas}{' '}
                    {totalNotasSomandoTodasAsRotasPersistidas === 1 ? 'nota' : 'notas'})
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Baixar .md (versão completa com imagens)</Menu.Label>
                  <Menu.Item
                    disabled={currentRouteNotes.length === 0}
                    leftSection={<IconFileDownload size={14} />}
                    onClick={() => void baixarArquivoMarkdownDasNotasViaDownloadDoNavegador('esta')}
                  >
                    Esta página
                  </Menu.Item>
                  <Menu.Item
                    disabled={totalNotasSomandoTodasAsRotasPersistidas === 0}
                    leftSection={<IconFileDownload size={14} />}
                    onClick={() => void baixarArquivoMarkdownDasNotasViaDownloadDoNavegador('todas')}
                  >
                    Todas as rotas
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <Group grow>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={addNote}
                  title="Novo post-it (Ctrl+Alt+N)"
                >
                  Novo Post-it
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={notesVisible ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                  onClick={() => setNotesVisible((prev) => !prev)}
                >
                  {notesVisible ? 'Ocultar' : 'Mostrar'}
                </Button>
              </Group>

              <Button
                size="xs"
                color="red"
                variant="light"
                leftSection={<IconTrash size={14} />}
                disabled={currentRouteNotes.length === 0}
                onClick={clearCurrentRouteNotes}
              >
                Limpar notas desta página
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
    </>
  );
}
