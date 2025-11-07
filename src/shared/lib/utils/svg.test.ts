import { describe, it, expect } from 'vitest';
import { svgToDataUrl } from './svg';

const SIMPLE_SVG = '<svg><circle cx="50" cy="50" r="40"/></svg>';
const SVG_WITH_WHITESPACE = `<svg>
  <circle 
    cx="50" 
    cy="50" 
    r="40"
  />
</svg>`;
const SVG_WITH_COMMENTS =
  '<!-- Comment --><svg><circle cx="50" cy="50" r="40"/></svg>';
const SVG_WITH_MULTIPLE_SPACES =
  '<svg>  <circle    cx="50"    cy="50"    r="40"  />  </svg>';
const EMPTY_SVG = '<svg></svg>';
const DATA_URL_PREFIX = 'data:image/svg+xml;utf8,';

describe('svgToDataUrl', () => {
  it('должна конвертировать простой SVG в data URL', () => {
    const result = svgToDataUrl(SIMPLE_SVG);

    expect(result).toContain(DATA_URL_PREFIX);
    expect(result).toContain('svg');
  });

  it('должна удалять переносы строк и лишние пробелы', () => {
    const result = svgToDataUrl(SVG_WITH_WHITESPACE);

    expect(result).not.toContain('\n');
    expect(result).not.toContain('\r');
    expect(result).toContain(DATA_URL_PREFIX);
  });

  it('должна удалять комментарии', () => {
    const result = svgToDataUrl(SVG_WITH_COMMENTS);

    expect(result).not.toContain('Comment');
    expect(result).toContain(DATA_URL_PREFIX);
  });

  it('должна нормализовать множественные пробелы', () => {
    const result = svgToDataUrl(SVG_WITH_MULTIPLE_SPACES);

    expect(result).not.toContain('  ');
    expect(result).toContain(DATA_URL_PREFIX);
  });

  it('должна обрабатывать пустой SVG', () => {
    const result = svgToDataUrl(EMPTY_SVG);

    expect(result).toBe(`${DATA_URL_PREFIX}${encodeURIComponent(EMPTY_SVG)}`);
  });

  it('должна кодировать специальные символы', () => {
    const svgWithSpecialChars = '<svg><text>Test & "quotes"</text></svg>';
    const result = svgToDataUrl(svgWithSpecialChars);

    expect(result).toContain(DATA_URL_PREFIX);
    expect(result).toContain(encodeURIComponent('&'));
    expect(result).toContain(encodeURIComponent('"'));
  });

  it('должна убирать пробелы между тегами', () => {
    const svgWithSpacesBetweenTags = '<svg> <circle/> <rect/> </svg>';
    const result = svgToDataUrl(svgWithSpacesBetweenTags);

    expect(result).not.toContain(encodeURIComponent('> <'));
    expect(result).toContain(DATA_URL_PREFIX);
  });

  it('должна возвращать корректный data URL для сложного SVG', () => {
    const complexSvg = `
      <!-- SVG Icon -->
      <svg  width="100"  height="100"  >
        <circle  cx="50"  cy="50"  r="40"  />
        <rect  x="20"  y="20"  width="60"  height="60"  />
      </svg>
    `;
    const result = svgToDataUrl(complexSvg);

    expect(result).toContain(DATA_URL_PREFIX);
    expect(result).not.toContain('SVG Icon');
    expect(result).not.toContain('\n');
    expect(result).toContain('circle');
    expect(result).toContain('rect');
  });
});
