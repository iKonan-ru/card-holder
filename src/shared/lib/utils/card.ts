import { BANKS_BINS } from '@shared/data/banks-bins';
import type { PaymentSystem, IPaymentSystemRule } from './types';
import { INITIAL_NULL, INITIAL_FALSE, INITIAL_ZERO } from '../constants';

const FIRST_DIGIT_INDEX = INITIAL_ZERO;
const FIRST_TWO_DIGITS_LENGTH = 2;
const MIN_CARD_PREFIX_LENGTH = 6;

const VISA_PREFIX = '4';
const MASTERCARD_PREFIX_FIVE = '5';
const MASTERCARD_PREFIX_SIX = '6';
const MASTERCARD_PREFIXES = [MASTERCARD_PREFIX_FIVE, MASTERCARD_PREFIX_SIX];
const MIR_PREFIX = '2';
const UZCARD_PREFIX = '8';
const HUMO_PREFIX = '9';
const JCB_PREFIX = '35';

const PAYMENT_SYSTEM_VISA: PaymentSystem = 'visa';
const PAYMENT_SYSTEM_MASTERCARD: PaymentSystem = 'mastercard';
const PAYMENT_SYSTEM_MIR: PaymentSystem = 'mir';
const PAYMENT_SYSTEM_UZCARD: PaymentSystem = 'uzcard';
const PAYMENT_SYSTEM_HUMO: PaymentSystem = 'humo';
const PAYMENT_SYSTEM_JCB: PaymentSystem = 'jcb';

const PAYMENT_SYSTEM_RULES: IPaymentSystemRule[] = [
  {
    system: PAYMENT_SYSTEM_VISA,
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === VISA_PREFIX,
  },
  {
    system: PAYMENT_SYSTEM_MASTERCARD,
    checkPrefix: (pan: string) =>
      MASTERCARD_PREFIXES.includes(pan[FIRST_DIGIT_INDEX]),
  },
  {
    system: PAYMENT_SYSTEM_MIR,
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === MIR_PREFIX,
  },
  {
    system: PAYMENT_SYSTEM_UZCARD,
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === UZCARD_PREFIX,
  },
  {
    system: PAYMENT_SYSTEM_HUMO,
    checkPrefix: (pan: string) => pan[FIRST_DIGIT_INDEX] === HUMO_PREFIX,
  },
  {
    system: PAYMENT_SYSTEM_JCB,
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
const DEFAULT_SHOW_VALUE = INITIAL_FALSE;

export function getPaymentSystem(pan: string): PaymentSystem | null {
  if (!pan) {
    return INITIAL_NULL;
  }

  const matchedRule = PAYMENT_SYSTEM_RULES.find((rule) =>
    rule.checkPrefix(pan)
  );

  return matchedRule ? matchedRule.system : INITIAL_NULL;
}

export function getBankByCardNumber(cardNumber: string): string | null {
  const isCardNumberTooShort =
    !cardNumber || cardNumber.length < MIN_CARD_PREFIX_LENGTH;

  if (isCardNumberTooShort) {
    return INITIAL_NULL;
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

  return INITIAL_NULL;
}

export const maskPan = (number: string, showValue = DEFAULT_SHOW_VALUE) => {
  const format = showValue ? PAN_VISIBLE_FORMAT : PAN_MASKED_FORMAT;

  return number.replace(PAN_MASK_PATTERN, format);
};

export const maskValue = (value: string, showValue = DEFAULT_SHOW_VALUE) => {
  return showValue ? value : MASK_CHAR.repeat(value.length);
};

export const formatExpiryDate = (date: string) => {
  return date.replace(EXPIRES_FORMAT_PATTERN, EXPIRES_FORMAT_REPLACEMENT);
};
