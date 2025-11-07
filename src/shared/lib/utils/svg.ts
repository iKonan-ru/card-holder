const HTML_COMMENT_PATTERN = /<!--[^]*?-->/g;
const LINE_BREAKS_PATTERN = /\n|\r/g;
const TAG_SPACING_PATTERN = />\s+</g;
const MULTIPLE_SPACES_PATTERN = /\s{2,}/g;
const EMPTY_STRING = '';
const SINGLE_SPACE = ' ';
const TAG_CLOSING = '><';
const DATA_URL_PREFIX = 'data:image/svg+xml;utf8,';

/**
 * Конвертирует SVG код в data URL для использования в атрибутах src
 * Минифицирует SVG перед конвертацией для уменьшения размера
 * @param svg - строка с SVG кодом
 * @returns минифицированный SVG в формате data URL
 */
export const svgToDataUrl = (svg: string): string => {
  const minified = svg
    .replace(HTML_COMMENT_PATTERN, EMPTY_STRING)
    .replace(LINE_BREAKS_PATTERN, EMPTY_STRING)
    .replace(TAG_SPACING_PATTERN, TAG_CLOSING)
    .replace(MULTIPLE_SPACES_PATTERN, SINGLE_SPACE)
    .trim();

  return DATA_URL_PREFIX + encodeURIComponent(minified);
};
