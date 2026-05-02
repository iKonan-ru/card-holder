export const PAN_LENGTH = 16;
export const PAN_FORMATTED_LENGTH = 19;
export const EXPIRES_LENGTH = 4;
export const EXPIRES_FORMATTED_LENGTH = 5;
export const CVV_MAX_LENGTH = 3;
export const PIN_MAX_LENGTH = 4;
export const MIN_NAME_LENGTH = 2;
export const MIN_YEAR = 22;
export const MIN_MONTH = 1;
export const MAX_MONTH = 12;

export const MONTH_START_INDEX = 0;
export const MONTH_END_INDEX = 2;

export const PAN_GROUP_SIZE = 4;
export const MONTH_SEPARATOR_LENGTH = 2;

export const MONTH_EXPIRES_SLICE_START = 0;
export const MONTH_EXPIRES_SLICE_END = 2;
export const YEAR_EXPIRES_SLICE_START = 2;
export const YEAR_EXPIRES_SLICE_END = 4;

export const LUHN_BASE = 10;
export const LUHN_MULTIPLIER = 2;
export const LUHN_THRESHOLD = 9;

export const MONTH_VALIDATION_PATTERN = /^(0[1-9]|1[0-2])$/;
export const NON_DIGIT_REMOVAL_PATTERN = /\D/g;
export const DIGITS_ONLY_PATTERN = /^\d+$/;
export const ALPHANUMERIC_PATTERN = /[^a-zA-Zа-яА-ЯёЁ0-9]/g;
export const LATIN_LETTERS_SPACES_PATTERN = /[^a-zA-Z\s]/g;
export const SPACES_PATTERN = /\s/g;
