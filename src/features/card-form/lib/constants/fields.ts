import type { IFieldConfig } from '@features/card-form';
import {
  formatPan,
  formatExpires,
  formatName,
  filterDigitsOnly,
  filterAlphanumeric,
} from '../utils/masks';
import {
  validatePan,
  validateExpires,
  validateName,
  validateCvv,
  validatePin,
} from '../utils/field-validators';
import {
  PAN_FORMATTED_LENGTH,
  PAN_LENGTH,
  EXPIRES_FORMATTED_LENGTH,
  EXPIRES_LENGTH,
  CVV_MAX_LENGTH,
  PIN_MAX_LENGTH,
} from './validation';

export const FIELD_NAME_PAN = 'pan';
export const PAN_LABEL = 'Номер карты';
export const PAN_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_PAN,
  label: PAN_LABEL,
  maxLength: PAN_FORMATTED_LENGTH,
  required: true,
  inputMode: 'numeric',
  autoComplete: 'cc-number',
  formatter: formatPan,
  validator: validatePan,
  instantValidateLength: PAN_LENGTH,
};

export const FIELD_NAME_EXPIRES = 'expires';
export const EXPIRES_LABEL = 'Срок действия';
export const EXPIRES_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_EXPIRES,
  label: EXPIRES_LABEL,
  maxLength: EXPIRES_FORMATTED_LENGTH,
  required: true,
  inputMode: 'numeric',
  autoComplete: 'cc-exp',
  formatter: formatExpires,
  validator: validateExpires,
  instantValidateLength: EXPIRES_LENGTH,
};

export const FIELD_NAME_CVV = 'cvv';
export const CVV_LABEL = 'CVV';
export const CVV_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_CVV,
  label: CVV_LABEL,
  maxLength: CVV_MAX_LENGTH,
  required: true,
  inputMode: 'numeric',
  autoComplete: 'cc-csc',
  formatter: filterDigitsOnly,
  validator: validateCvv,
  instantValidateLength: CVV_MAX_LENGTH,
};

export const FIELD_NAME_PIN = 'pin';
export const PIN_LABEL = 'PIN';
export const PIN_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_PIN,
  label: PIN_LABEL,
  maxLength: PIN_MAX_LENGTH,
  required: false,
  inputMode: 'numeric',
  formatter: filterDigitsOnly,
  validator: validatePin,
  instantValidateLength: PIN_MAX_LENGTH,
};

export const FIELD_NAME_PHRASE = 'phrase';
export const PHRASE_LABEL = 'Кодовая фраза';
export const PHRASE_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_PHRASE,
  label: PHRASE_LABEL,
  required: false,
  formatter: filterAlphanumeric,
};

export const FIELD_NAME_NAME = 'name';
export const NAME_LABEL = 'Имя владельца';
export const NAME_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_NAME,
  label: NAME_LABEL,
  required: true,
  autoComplete: 'cc-name',
  formatter: formatName,
  validator: validateName,
};

export const FIELD_NAME_TYPE = 'type';
export const TYPE_LABEL = 'Тип карты';
export const TYPE_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_TYPE,
  label: TYPE_LABEL,
  required: false,
  inputMode: 'text',
};
