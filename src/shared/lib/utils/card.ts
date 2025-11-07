import { BANKS_BINS } from '@shared/data/banks-bins';
import type { PaymentSystem, IPaymentSystemRule } from './types';

const FIRST_DIGIT_INDEX = 0;
const FIRST_TWO_DIGITS_LENGTH = 2;
const MIN_CARD_PREFIX_LENGTH = 6;

const VISA_PREFIX = '4';
const MASTERCARD_PREFIXES = ['5', '6'];
const MIR_PREFIX = '2';
const UZCARD_PREFIX = '8';
const HUMO_PREFIX = '9';
const JCB_PREFIX = '35';

const PAYMENT_SYSTEM_RULES: IPaymentSystemRule[] = [
  {
    system: 'visa',
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === VISA_PREFIX,
  },
  {
    system: 'mastercard',
    checkPrefix: (pan: string) =>
      MASTERCARD_PREFIXES.includes(pan[FIRST_DIGIT_INDEX]),
  },
  {
    system: 'mir',
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === MIR_PREFIX,
  },
  {
    system: 'uzcard',
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === UZCARD_PREFIX,
  },
  {
    system: 'humo',
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === HUMO_PREFIX,
  },
  {
    system: 'jcb',
    checkPrefix: (pan: string) => {
      const hasSufficientLength = pan.length >= FIRST_TWO_DIGITS_LENGTH;
      const firstTwoDigits = pan.substring(
        FIRST_DIGIT_INDEX,
        FIRST_TWO_DIGITS_LENGTH
      );

      return hasSufficientLength && firstTwoDigits === JCB_PREFIX;
    },
  },
];

const PAN_MASK_PATTERN = /(\d{4})(\d{2})(\d{2})(\d{4})(\d{4})/;
const PAN_VISIBLE_FORMAT = '$1 $2$3 $4 $5';
const PAN_MASKED_FORMAT = '$1 $2•• •••• $5';
const EXPIRES_FORMAT_PATTERN = /(\d{2})(\d{2})/;
const EXPIRES_FORMAT_REPLACEMENT = '$1/$2';
const MASK_CHAR = '•';

/**
 * Определяет платежную систему по номеру карты
 * @param pan - номер карты (PAN)
 * @returns тип платежной системы или null, если не удалось определить
 */
export function getPaymentSystem(pan: string): PaymentSystem | null {
  if (!pan) {
    return null;
  }

  const matchedRule = PAYMENT_SYSTEM_RULES.find((rule) =>
    rule.checkPrefix(pan)
  );

  return matchedRule ? matchedRule.system : null;
}

/**
 * Определяет банк по номеру карты используя BIN (первые 6 цифр)
 * @param cardNumber - номер карты
 * @returns идентификатор банка или null, если банк не определен
 */
export function getBankByCardNumber(cardNumber: string): string | null {
  const isCardNumberTooShort =
    !cardNumber || cardNumber.length < MIN_CARD_PREFIX_LENGTH;

  if (isCardNumberTooShort) {
    return null;
  }

  const prefix = cardNumber.substring(
    FIRST_DIGIT_INDEX,
    MIN_CARD_PREFIX_LENGTH
  );

  for (const [bankId, prefixes] of Object.entries(BANKS_BINS)) {
    const isBankMatch = Array.isArray(prefixes) && prefixes.includes(prefix);

    if (isBankMatch) {
      return bankId;
    }
  }

  return null;
}

/**
 * Маскирует номер карты, скрывая средние цифры
 * @param number - номер карты
 * @param showValue - флаг отображения полного номера
 * @returns замаскированный или полный номер карты
 */
export const maskPan = (number: string, showValue = false) => {
  const format = showValue ? PAN_VISIBLE_FORMAT : PAN_MASKED_FORMAT;

  return number.replace(PAN_MASK_PATTERN, format);
};

/**
 * Маскирует значение, заменяя все символы на точки
 * @param value - значение для маскирования
 * @param showValue - флаг отображения полного значения
 * @returns замаскированное или полное значение
 */
export const maskValue = (value: string, showValue = false) => {
  return showValue ? value : MASK_CHAR.repeat(value.length);
};

/**
 * Форматирует дату истечения срока действия карты в формат MM/YY
 * @param date - дата в формате MMYY
 * @returns отформатированная дата в формате MM/YY
 */
export const formatExpiryDate = (date: string) => {
  return date.replace(EXPIRES_FORMAT_PATTERN, EXPIRES_FORMAT_REPLACEMENT);
};
