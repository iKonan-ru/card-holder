import { describe, expect, it } from 'vitest';
import { darkenColor, getTextColorStyle } from './color';

const INVALID_HEX_VALUE = '#gggggg';
const PERCENT_ZERO = 0;
const PERCENT_FIFTY = 50;
const PERCENT_HUNDRED = 100;

describe('darkenColor', () => {
  it('должна затемнить цвет на заданный процент', () => {
    const result = darkenColor('#ffffff', PERCENT_FIFTY);

    expect(result).toBe('#808080');
  });

  it('должна вернуть черный цвет при затемнении на 100%', () => {
    const result = darkenColor('#ffffff', PERCENT_HUNDRED);

    expect(result).toBe('#000000');
  });

  it('должна вернуть исходный цвет при затемнении на 0%', () => {
    const originalColor = '#ff0000';
    const result = darkenColor(originalColor, PERCENT_ZERO);

    expect(result).toBe(originalColor);
  });

  it('должна вернуть исходный цвет для невалидного hex', () => {
    const invalidHex = INVALID_HEX_VALUE;
    const result = darkenColor(invalidHex, PERCENT_FIFTY);

    expect(result).toBe(invalidHex);
  });

  it('должна возвращать #000000 при проценте > 100', () => {
    const result = darkenColor('#ffffff', 110);

    expect(result).toBe('#000000');
  });

  it('должна осветлять цвет при отрицательном проценте', () => {
    const result = darkenColor('#808080', -100);

    expect(result).toBe('#ffffff');
  });

  it('должна корректно затемнить цвет на 30%', () => {
    const percentThirty = 30;
    const result = darkenColor('#1a9f29', percentThirty);

    expect(result).toBe('#126f1d');
  });
});

describe('getTextColorStyle', () => {
  it('должна возвращать стиль с темным текстом когда isDarkText true', () => {
    const result = getTextColorStyle(true);

    expect(result).toHaveProperty('--text-color');
  });

  it('должна возвращать стиль со светлым текстом когда isDarkText false', () => {
    const result = getTextColorStyle(false);

    expect(result).toHaveProperty('--text-color');
  });

  it('должна возвращать стиль со светлым текстом когда isDarkText undefined', () => {
    const result = getTextColorStyle(undefined);

    expect(result).toHaveProperty('--text-color');
  });
});
