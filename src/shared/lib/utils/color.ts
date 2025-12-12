import { type CSSProperties } from 'react';
import {
  EMPTY_STRING,
  HEX_RADIX,
  TEXT_COLOR_DARK,
  TEXT_COLOR_LIGHT,
  ZERO_CHAR,
} from '../constants';

const HEX_COLOR_PATTERN = /^[0-9A-Fa-f]{6}$/;
const MIN_RGB_VALUE = 0;
const MAX_RGB_VALUE = 255;
const SINGLE_HEX_DIGIT_LENGTH = 1;
const RGB_RED_START = 0;
const RGB_RED_END = 2;
const RGB_GREEN_START = 2;
const RGB_GREEN_END = 4;
const RGB_BLUE_START = 4;
const RGB_BLUE_END = 6;
const PERCENT_BASE = 100;
const HASH_CHAR = '#';

export const hexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  const cleanHex = hex.replace(HASH_CHAR, EMPTY_STRING);
  const isValidHex = HEX_COLOR_PATTERN.test(cleanHex);

  if (!isValidHex) {
    return null;
  }

  const r = parseInt(cleanHex.substring(RGB_RED_START, RGB_RED_END), HEX_RADIX);
  const g = parseInt(
    cleanHex.substring(RGB_GREEN_START, RGB_GREEN_END),
    HEX_RADIX,
  );
  const b = parseInt(
    cleanHex.substring(RGB_BLUE_START, RGB_BLUE_END),
    HEX_RADIX,
  );

  return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const convertToHex = (value: number) => {
    const clampedValue = Math.round(
      Math.max(MIN_RGB_VALUE, Math.min(MAX_RGB_VALUE, value)),
    );
    const hex = clampedValue.toString(HEX_RADIX);
    const needsPadding = hex.length === SINGLE_HEX_DIGIT_LENGTH;

    return needsPadding ? `${ZERO_CHAR}${hex}` : hex;
  };

  return `${HASH_CHAR}${convertToHex(r)}${convertToHex(g)}${convertToHex(b)}`;
};

export const darkenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  const isInvalidColor = !rgb;

  if (isInvalidColor) {
    return hex;
  }

  const factor = (PERCENT_BASE - percent) / PERCENT_BASE;

  const newR = Math.round(rgb.r * factor);
  const newG = Math.round(rgb.g * factor);
  const newB = Math.round(rgb.b * factor);

  return rgbToHex(newR, newG, newB);
};

export const getTextColorStyle = (isDarkText?: boolean): CSSProperties =>
  ({
    '--text-color': isDarkText ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT,
  }) as CSSProperties;
