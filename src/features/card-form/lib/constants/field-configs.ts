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
  PAN_LABEL,
  EXPIRES_FORMATTED_LENGTH,
  EXPIRES_LENGTH,
  EXPIRES_LABEL,
  CVV_MAX_LENGTH,
  CVV_LABEL,
  PIN_MAX_LENGTH,
  PIN_LABEL,
  PHRASE_LABEL,
  NAME_LABEL,
  TYPE_LABEL,
} from './constants';

interface IFieldConfig {
  name: string;
  label: string;
  maxLength?: number;
  required?: boolean;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  formatter?: (value: string) => string;
  validator?: (value: string) => string | undefined;
  instantValidateLength?: number;
}

export const PAN_FIELD_CONFIG: IFieldConfig = {
  name: 'pan',
  label: PAN_LABEL,
  maxLength: PAN_FORMATTED_LENGTH,
  required: true,
  inputMode: 'numeric',
  formatter: (value: string) => formatPan(filterDigitsOnly(value)),
  validator: validatePan,
  instantValidateLength: PAN_LENGTH,
};

export const EXPIRES_FIELD_CONFIG: IFieldConfig = {
  name: 'expires',
  label: EXPIRES_LABEL,
  maxLength: EXPIRES_FORMATTED_LENGTH,
  required: true,
  inputMode: 'numeric',
  formatter: (value: string) => formatExpires(filterDigitsOnly(value)),
  validator: validateExpires,
  instantValidateLength: EXPIRES_LENGTH,
};

export const CVV_FIELD_CONFIG: IFieldConfig = {
  name: 'cvv',
  label: CVV_LABEL,
  maxLength: CVV_MAX_LENGTH,
  required: true,
  inputMode: 'numeric',
  formatter: filterDigitsOnly,
  validator: validateCvv,
  instantValidateLength: CVV_MAX_LENGTH,
};

export const PIN_FIELD_CONFIG: IFieldConfig = {
  name: 'pin',
  label: PIN_LABEL,
  maxLength: PIN_MAX_LENGTH,
  required: false,
  inputMode: 'numeric',
  formatter: filterDigitsOnly,
  validator: validatePin,
  instantValidateLength: PIN_MAX_LENGTH,
};

export const PHRASE_FIELD_CONFIG: IFieldConfig = {
  name: 'phrase',
  label: PHRASE_LABEL,
  required: false,
  formatter: filterAlphanumeric,
};

export const NAME_FIELD_CONFIG: IFieldConfig = {
  name: 'name',
  label: NAME_LABEL,
  required: true,
  formatter: formatName,
  validator: validateName,
};

export const TYPE_FIELD_CONFIG: IFieldConfig = {
  name: 'type',
  label: TYPE_LABEL,
  required: false,
};
