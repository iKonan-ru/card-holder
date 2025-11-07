import { describe, it, expect } from 'vitest';
import {
  getPaymentSystem,
  getBankByCardNumber,
  maskPan,
  maskValue,
  formatExpiryDate,
} from './card';

const VISA_PAN = '4377723769243191';
const MASTERCARD_PAN = '5559494202595236';
const MIR_PAN = '2200150236441892';
const UZCARD_PAN = '8600123456789012';
const HUMO_PAN = '9860123456789012';
const JCB_PAN = '3530111333300000';
const UNKNOWN_PAN = '1234567890123456';

const SBERBANK_BIN = '220220';
const ALFABANK_BIN = '220015';
const TBANK_BIN = '437772';
const UNKNOWN_BIN = '999999';

const SHORT_PAN = '12345';
const EMPTY_STRING = '';

describe('getPaymentSystem', () => {
  it('должна вернуть visa для карты начинающейся с 4', () => {
    const result = getPaymentSystem(VISA_PAN);

    expect(result).toBe('visa');
  });

  it('должна вернуть mastercard для карты начинающейся с 5', () => {
    const result = getPaymentSystem(MASTERCARD_PAN);

    expect(result).toBe('mastercard');
  });

  it('должна вернуть mir для карты начинающейся с 2', () => {
    const result = getPaymentSystem(MIR_PAN);

    expect(result).toBe('mir');
  });

  it('должна вернуть uzcard для карты начинающейся с 8', () => {
    const result = getPaymentSystem(UZCARD_PAN);

    expect(result).toBe('uzcard');
  });

  it('должна вернуть humo для карты начинающейся с 9', () => {
    const result = getPaymentSystem(HUMO_PAN);

    expect(result).toBe('humo');
  });

  it('должна вернуть jcb для карты начинающейся с 35', () => {
    const result = getPaymentSystem(JCB_PAN);

    expect(result).toBe('jcb');
  });

  it('должна вернуть null для неизвестной платежной системы', () => {
    const result = getPaymentSystem(UNKNOWN_PAN);

    expect(result).toBeNull();
  });

  it('должна вернуть null для пустой строки', () => {
    const result = getPaymentSystem(EMPTY_STRING);

    expect(result).toBeNull();
  });
});

describe('getBankByCardNumber', () => {
  it('должна вернуть sberbank для карты Сбербанка', () => {
    const sberbankPan = `${SBERBANK_BIN}1234567890`;
    const result = getBankByCardNumber(sberbankPan);

    expect(result).toBe('sberbank');
  });

  it('должна вернуть alfabank для карты Альфа-Банка', () => {
    const alfabankPan = `${ALFABANK_BIN}1234567890`;
    const result = getBankByCardNumber(alfabankPan);

    expect(result).toBe('alfabank');
  });

  it('должна вернуть tbank для карты Т-Банка', () => {
    const tbankPan = `${TBANK_BIN}1234567890`;
    const result = getBankByCardNumber(tbankPan);

    expect(result).toBe('tbank');
  });

  it('должна вернуть null для неизвестного банка', () => {
    const unknownPan = `${UNKNOWN_BIN}1234567890`;
    const result = getBankByCardNumber(unknownPan);

    expect(result).toBeNull();
  });

  it('должна вернуть null для короткого номера карты', () => {
    const result = getBankByCardNumber(SHORT_PAN);

    expect(result).toBeNull();
  });

  it('должна вернуть null для пустой строки', () => {
    const result = getBankByCardNumber(EMPTY_STRING);

    expect(result).toBeNull();
  });
});

describe('maskPan', () => {
  const fullPan = '5559494202595236';
  const expectedMaskedPan = '5559 49•• •••• 5236';
  const expectedFullPan = '5559 4942 0259 5236';

  it('должна замаскировать номер карты по умолчанию', () => {
    const result = maskPan(fullPan);

    expect(result).toBe(expectedMaskedPan);
  });

  it('должна замаскировать номер карты с showValue = false', () => {
    const showValue = false;
    const result = maskPan(fullPan, showValue);

    expect(result).toBe(expectedMaskedPan);
  });

  it('должна показать полный номер карты с showValue = true', () => {
    const showValue = true;
    const result = maskPan(fullPan, showValue);

    expect(result).toBe(expectedFullPan);
  });
});

describe('maskValue', () => {
  const testValue = 'test123';
  const testValueLength = 7;

  it('должна замаскировать значение по умолчанию', () => {
    const result = maskValue(testValue);

    expect(result).toBe('•'.repeat(testValueLength));
  });

  it('должна замаскировать значение с showValue = false', () => {
    const showValue = false;
    const result = maskValue(testValue, showValue);

    expect(result).toBe('•'.repeat(testValueLength));
  });

  it('должна показать полное значение с showValue = true', () => {
    const showValue = true;
    const result = maskValue(testValue, showValue);

    expect(result).toBe(testValue);
  });

  it('должна вернуть пустую строку для пустого значения', () => {
    const result = maskValue(EMPTY_STRING);

    expect(result).toBe(EMPTY_STRING);
  });
});

describe('formatExpiryDate', () => {
  it('должна форматировать дату истечения', () => {
    const date = '0726';
    const expectedFormat = '07/26';
    const result = formatExpiryDate(date);

    expect(result).toBe(expectedFormat);
  });

  it('должна корректно обработать нули в начале', () => {
    const date = '0125';
    const expectedFormat = '01/25';
    const result = formatExpiryDate(date);

    expect(result).toBe(expectedFormat);
  });

  it('должна корректно обработать дату с декабрем', () => {
    const date = '1230';
    const expectedFormat = '12/30';
    const result = formatExpiryDate(date);

    expect(result).toBe(expectedFormat);
  });
});
