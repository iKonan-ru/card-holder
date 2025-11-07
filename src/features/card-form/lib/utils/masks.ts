import { EMPTY_STRING } from '@shared/lib';

const SPACE_CHAR = ' ';
const SLASH_CHAR = '/';
const PAN_GROUP_SIZE = 4;
const MONTH_SEPARATOR_LENGTH = 2;
const MONTH_EXPIRES_SLICE_START = 0;
const MONTH_EXPIRES_SLICE_END = 2;
const YEAR_EXPIRES_SLICE_START = 2;
const YEAR_EXPIRES_SLICE_END = 4;

const NON_DIGIT_PATTERN = /\D/g;
const ALPHANUMERIC_PATTERN = /[^a-zA-Zа-яА-ЯёЁ0-9]/g;
const LATIN_LETTERS_SPACES_PATTERN = /[^a-zA-Z\s]/g;

export const formatPan = (value: string): string => {
  const digitsOnly = value.replace(NON_DIGIT_PATTERN, EMPTY_STRING);
  const groups: string[] = [];

  for (let index = 0; index < digitsOnly.length; index += PAN_GROUP_SIZE) {
    groups.push(digitsOnly.slice(index, index + PAN_GROUP_SIZE));
  }

  return groups.join(SPACE_CHAR);
};

export const formatExpires = (value: string): string => {
  const digitsOnly = value.replace(NON_DIGIT_PATTERN, EMPTY_STRING);

  if (digitsOnly.length <= MONTH_SEPARATOR_LENGTH) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(MONTH_EXPIRES_SLICE_START, MONTH_EXPIRES_SLICE_END)}${SLASH_CHAR}${digitsOnly.slice(YEAR_EXPIRES_SLICE_START, YEAR_EXPIRES_SLICE_END)}`;
};

export const unformatValue = (value: string): string => {
  return value.replace(NON_DIGIT_PATTERN, EMPTY_STRING);
};

export const filterDigitsOnly = (value: string): string => {
  return value.replace(NON_DIGIT_PATTERN, EMPTY_STRING);
};

export const filterAlphanumeric = (value: string): string => {
  return value.replace(ALPHANUMERIC_PATTERN, EMPTY_STRING);
};

export const formatName = (value: string): string => {
  const latinLettersAndSpaces = value.replace(
    LATIN_LETTERS_SPACES_PATTERN,
    EMPTY_STRING
  );

  return latinLettersAndSpaces.toUpperCase();
};
