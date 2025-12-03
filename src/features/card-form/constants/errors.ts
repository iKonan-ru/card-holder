import {
  CVV_MAX_LENGTH,
  MAX_MONTH,
  MIN_MONTH,
  MIN_YEAR,
  PAN_LENGTH,
  PIN_MAX_LENGTH,
} from './validation';

export const ERROR_PAN_REQUIRED = 'Номер карты обязателен';
export const ERROR_PAN_INVALID_LENGTH = `Введите ${PAN_LENGTH} цифр`;
export const ERROR_PAN_INVALID = 'Неверный номер карты';

export const ERROR_EXPIRES_REQUIRED = 'Срок действия обязателен';
export const ERROR_EXPIRES_MONTH = `Месяц должен быть от ${MIN_MONTH} до ${MAX_MONTH}`;
export const ERROR_EXPIRES_YEAR = `Год должен быть больше 20${MIN_YEAR}`;

export const ERROR_NAME_REQUIRED = 'Имя обязательно';
export const ERROR_NAME_TOO_SHORT = 'Имя слишком короткое';

export const ERROR_CVV_REQUIRED = 'CVV обязателен';
export const ERROR_CVV_INVALID_LENGTH = `Введите ${CVV_MAX_LENGTH} цифры`;

export const ERROR_PIN_INVALID_LENGTH = `Введите ${PIN_MAX_LENGTH} цифры`;

export const ERROR_CARD_ALREADY_EXISTS = 'Такая карта уже существует';
