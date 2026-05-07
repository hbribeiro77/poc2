/**
 * Captura um elemento do DOM (ex.: #facilitador-scroll-root) para data URL JPEG,
 * usado na exportação Markdown do modo reunião (html2canvas, carregamento dinâmico).
 */
export async function capturaElementoDomParaDataUrlJpegRedimensionadoExportMarkdownModoReuniaoFacilitador(
  selectorCssElementoRaiz,
  opcoesSomenteExportPoC = {}
) {
  const {
    larguraMaximaPixelsCanvasSomenteExport = 1280,
    qualidadeJpegEntreZeroEUm = 0.82,
  } = opcoesSomenteExportPoC;

  if (typeof document === 'undefined') return null;
  const elementoAlvo = document.querySelector(selectorCssElementoRaiz);
  if (!elementoAlvo) return null;

  try {
    const html2canvas = (await import('html2canvas')).default;
    const larguraAlvo = Math.max(elementoAlvo.scrollWidth, 1);
    const escala = Math.min(1, larguraMaximaPixelsCanvasSomenteExport / larguraAlvo);
    const canvas = await html2canvas(elementoAlvo, {
      scale: escala,
      useCORS: true,
      allowTaint: false,
      logging: false,
    });
    return canvas.toDataURL('image/jpeg', qualidadeJpegEntreZeroEUm);
  } catch {
    return null;
  }
}

const HEX_FALLBACK_COR_POST_IT_EXPORT_MARKDOWN = '#fff3bf';

/**
 * Célula da coluna Cor: círculo HTML preenchido + código hex (renderizadores tipo GitLab aceitam HTML inline na tabela).
 */
export function montaMarcacaoMarkdownColunaCorComCirculoSolidoVisualizadoFacilitadorModoReuniao(hexCorDoPostIt) {
  const hex =
    typeof hexCorDoPostIt === 'string' && /^#[0-9A-Fa-f]{6}$/.test(hexCorDoPostIt.trim())
      ? hexCorDoPostIt.trim()
      : HEX_FALLBACK_COR_POST_IT_EXPORT_MARKDOWN;
  const circuloHtml =
    '<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:' +
    hex +
    ';border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-right:6px" title="' +
    hex +
    '" aria-hidden="true"></span>';
  return `${circuloHtml}\`${hex}\``;
}

const LARGURA_MINIATURA_PIXELS_HTML_EXPORT_MARKDOWN_PRINT_COLADO_POST_IT = 160;

function escapaDataUrlParaAtributosHtmlExportMarkdownModoReuniaoFacilitador(urlDataImagem) {
  return String(urlDataImagem).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * Miniatura HTML embutida no .md: link abre a mesma data URL em nova aba (navegador / GitLab costumam aceitar).
 * @param larguraMiniaturaPixelsOpcional quando omitido, usa ~160px; na tabela costuma-se ~120px.
 */
export function montaHtmlMiniaturaImagemDataUrlComLinkAbrirNovaAbaMarkdownExportFacilitadorModoReuniao(
  dataUrlImagemClipboardPostIt,
  numeroNotaOrdemNaRotaBaseUm,
  indicePrintDentroDaNotaBaseUm,
  larguraMiniaturaPixelsOpcional
) {
  if (
    typeof dataUrlImagemClipboardPostIt !== 'string' ||
    !dataUrlImagemClipboardPostIt.startsWith('data:image/')
  ) {
    return '';
  }
  const altTextoSeguro = `Nota ${numeroNotaOrdemNaRotaBaseUm} — print ${indicePrintDentroDaNotaBaseUm}`;
  const urlSegura = escapaDataUrlParaAtributosHtmlExportMarkdownModoReuniaoFacilitador(dataUrlImagemClipboardPostIt);
  const altSeguro = escapaDataUrlParaAtributosHtmlExportMarkdownModoReuniaoFacilitador(altTextoSeguro);
  const w =
    typeof larguraMiniaturaPixelsOpcional === 'number' && larguraMiniaturaPixelsOpcional > 0
      ? Math.round(larguraMiniaturaPixelsOpcional)
      : LARGURA_MINIATURA_PIXELS_HTML_EXPORT_MARKDOWN_PRINT_COLADO_POST_IT;
  return `<a href="${urlSegura}" target="_blank" rel="noopener noreferrer"><img src="${urlSegura}" alt="${altSeguro}" width="${w}" style="max-width:100%;height:auto;border-radius:6px;border:1px solid rgba(0,0,0,0.12)" /></a>`;
}

const LARGURA_MINIATURA_TABELA_PIXELS_PRINT_COLADO_POST_IT = 120;

/**
 * Conteúdo da última coluna da tabela de export: miniaturas lado a lado ou traço se vazio.
 */
export function montaHtmlCelulaTabelaImagensClipboardPostItMarkdownExportFacilitadorModoReuniao(
  listaImagensClipboardPostItFacilitador,
  numeroNotaOrdemNaRotaBaseUm
) {
  if (!Array.isArray(listaImagensClipboardPostItFacilitador) || listaImagensClipboardPostItFacilitador.length === 0) {
    return '—';
  }
  const miniaturasHtml = listaImagensClipboardPostItFacilitador
    .map((itemImagem, indiceZero) =>
      montaHtmlMiniaturaImagemDataUrlComLinkAbrirNovaAbaMarkdownExportFacilitadorModoReuniao(
        itemImagem?.dataUrl,
        numeroNotaOrdemNaRotaBaseUm,
        indiceZero + 1,
        LARGURA_MINIATURA_TABELA_PIXELS_PRINT_COLADO_POST_IT
      )
    )
    .filter(Boolean);
  if (miniaturasHtml.length === 0) {
    return '—';
  }
  return miniaturasHtml.join(' ');
}

/** Normaliza texto para uma linha em célula GFM (pipes escapados). */
export function escapaTextoParaCelulaTabelaMarkdownExportFacilitadorModoReuniao(textoBruto) {
  let s = String(textoBruto ?? '');
  s = s
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  s = s.replace(/\|/g, '\\|');
  if (s.length > 3500) {
    return `${s.slice(0, 3497)}…`;
  }
  return s;
}
