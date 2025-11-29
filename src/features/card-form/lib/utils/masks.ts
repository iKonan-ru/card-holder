import {
  EMPTY_STRING,
  NON_DIGIT_PATTERN,
  SPACE_CHAR,
  SLASH_CHAR,
} from '@shared/lib';
import {
  PAN_GROUP_SIZE,
  MONTH_SEPARATOR_LENGTH,
  MONTH_EXPIRES_SLICE_START,
  MONTH_EXPIRES_SLICE_END,
  YEAR_EXPIRES_SLICE_START,
  YEAR_EXPIRES_SLICE_END,
  ALPHANUMERIC_PATTERN,
  LATIN_LETTERS_SPACES_PATTERN,
} from '../constants';

export const formatPan = (value: string): string => {
  const digitsOnly = filterDigitsOnly(value);
  const groups: string[] = [];

  for (let index = 0; index < digitsOnly.length; index += PAN_GROUP_SIZE) {
    groups.push(digitsOnly.slice(index, index + PAN_GROUP_SIZE));
  }

  return groups.join(SPACE_CHAR);
};

export const formatExpires = (value: string): string => {
  const digitsOnly = filterDigitsOnly(value);

  if (digitsOnly.length <= MONTH_SEPARATOR_LENGTH) {
    return digitsOnly;
  }

  const monthString = digitsOnly.slice(
    MONTH_EXPIRES_SLICE_START,
    MONTH_EXPIRES_SLICE_END
  );
  const yearString = digitsOnly.slice(
    YEAR_EXPIRES_SLICE_START,
    YEAR_EXPIRES_SLICE_END
  );

  return `${monthString}${SLASH_CHAR}${yearString}`;
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
