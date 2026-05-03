import { describe, expect, it } from 'vitest';
import { darkenColor, getTextColorStyle, hexToRgb, rgbToHex } from './color';

const INVALID_HEX_VALUE = '#gggggg';
const PERCENT_ZERO = 0;
const PERCENT_FIFTY = 50;
const PERCENT_HUNDRED = 100;
const RGB_MAX_VALUE = 255;
const RGB_MIN_VALUE = 0;

describe('hexToRgb', () => {
  it('должна корректно преобразовать hex в RGB', () => {
    const result = hexToRgb('#ff0000');

    expect(result).toEqual({
      r: RGB_MAX_VALUE,
      g: RGB_MIN_VALUE,
      b: RGB_MIN_VALUE,
    });
  });

  it('должна корректно преобразовать hex без решетки', () => {
    const result = hexToRgb('00ff00');

    expect(result).toEqual({
      r: RGB_MIN_VALUE,
      g: RGB_MAX_VALUE,
      b: RGB_MIN_VALUE,
    });
  });

  it('должна вернуть null для невалидного hex', () => {
    const result = hexToRgb(INVALID_HEX_VALUE);

    expect(result).toBeNull();
  });

  it('должна вернуть null для пустой строки', () => {
    const result = hexToRgb('');

    expect(result).toBeNull();
  });

  it('должна вернуть null для 3-символьного формата #fff', () => {
    const result = hexToRgb('#fff');

    expect(result).toBeNull();
  });

  it('должна корректно обработать белый цвет', () => {
    const result = hexToRgb('#ffffff');

    expect(result).toEqual({
      r: RGB_MAX_VALUE,
      g: RGB_MAX_VALUE,
      b: RGB_MAX_VALUE,
    });
  });

  it('должна корректно обработать черный цвет', () => {
    const result = hexToRgb('#000000');

    expect(result).toEqual({
      r: RGB_MIN_VALUE,
      g: RGB_MIN_VALUE,
      b: RGB_MIN_VALUE,
    });
  });
});

describe('rgbToHex', () => {
  it('должна корректно преобразовать RGB в hex', () => {
    const result = rgbToHex(RGB_MAX_VALUE, RGB_MIN_VALUE, RGB_MIN_VALUE);

    expect(result).toBe('#ff0000');
  });

  it('должна корректно обработать значения с ведущими нулями', () => {
    const result = rgbToHex(RGB_MIN_VALUE, RGB_MIN_VALUE, RGB_MAX_VALUE);

    expect(result).toBe('#0000ff');
  });

  it('должна обрезать значения больше 255', () => {
    const overMaxValue = 300;
    const result = rgbToHex(overMaxValue, RGB_MIN_VALUE, RGB_MIN_VALUE);

    expect(result).toBe('#ff0000');
  });

  it('должна обрезать отрицательные значения', () => {
    const negativeValue = -10;
    const result = rgbToHex(negativeValue, RGB_MIN_VALUE, RGB_MIN_VALUE);

    expect(result).toBe('#000000');
  });

  it('должна округлять дробные значения', () => {
    const fractionalValue = 127.5;
    const result = rgbToHex(fractionalValue, RGB_MIN_VALUE, RGB_MIN_VALUE);

    expect(result).toBe('#800000');
  });
});

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
    const expectedRed = 18;
    const expectedGreen = 111;
    const expectedBlue = 29;

    expect(result).toBe(rgbToHex(expectedRed, expectedGreen, expectedBlue));
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
