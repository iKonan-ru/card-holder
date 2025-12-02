import { EMPTY_STRING, SPACE_REMOVAL_PATTERN } from '@shared/lib';

const LUHN_BASE = 10;
const LUHN_MULTIPLIER = 2;
const LUHN_THRESHOLD = 9;

export const validateLuhn = (digits: string): boolean => {
  const cleanedDigits = digits.replace(SPACE_REMOVAL_PATTERN, EMPTY_STRING);
  let sum = 0;

  for (let index = 0; index < cleanedDigits.length; index++) {
    let cardNumber = parseInt(cleanedDigits[index], LUHN_BASE);

    const shouldDouble = (cleanedDigits.length - index) % 2 === 0;

    if (shouldDouble) {
      cardNumber = cardNumber * LUHN_MULTIPLIER;

      const isOverThreshold = cardNumber > LUHN_THRESHOLD;

      if (isOverThreshold) {
        cardNumber = cardNumber - LUHN_THRESHOLD;
      }
    }

    sum += cardNumber;
  }

  return sum % LUHN_BASE === 0;
};
