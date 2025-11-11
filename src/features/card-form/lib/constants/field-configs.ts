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
  FIELD_NAME_PAN,
  FIELD_NAME_EXPIRES,
  FIELD_NAME_CVV,
  FIELD_NAME_PIN,
  FIELD_NAME_PHRASE,
  FIELD_NAME_NAME,
  FIELD_NAME_TYPE,
  FIELD_REQUIRED_TRUE,
  FIELD_REQUIRED_FALSE,
} from './constants';
import { INPUT_MODE_NUMERIC, INPUT_MODE_TEXT } from '@shared/lib';

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
  name: FIELD_NAME_PAN,
  label: PAN_LABEL,
  maxLength: PAN_FORMATTED_LENGTH,
  required: FIELD_REQUIRED_TRUE,
  inputMode: INPUT_MODE_NUMERIC,
  formatter: (value: string) => formatPan(filterDigitsOnly(value)),
  validator: validatePan,
  instantValidateLength: PAN_LENGTH,
};

export const EXPIRES_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_EXPIRES,
  label: EXPIRES_LABEL,
  maxLength: EXPIRES_FORMATTED_LENGTH,
  required: FIELD_REQUIRED_TRUE,
  inputMode: INPUT_MODE_NUMERIC,
  formatter: (value: string) => formatExpires(filterDigitsOnly(value)),
  validator: validateExpires,
  instantValidateLength: EXPIRES_LENGTH,
};

export const CVV_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_CVV,
  label: CVV_LABEL,
  maxLength: CVV_MAX_LENGTH,
  required: FIELD_REQUIRED_TRUE,
  inputMode: INPUT_MODE_NUMERIC,
  formatter: filterDigitsOnly,
  validator: validateCvv,
  instantValidateLength: CVV_MAX_LENGTH,
};

export const PIN_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_PIN,
  label: PIN_LABEL,
  maxLength: PIN_MAX_LENGTH,
  required: FIELD_REQUIRED_FALSE,
  inputMode: INPUT_MODE_NUMERIC,
  formatter: filterDigitsOnly,
  validator: validatePin,
  instantValidateLength: PIN_MAX_LENGTH,
};

export const PHRASE_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_PHRASE,
  label: PHRASE_LABEL,
  required: FIELD_REQUIRED_FALSE,
  formatter: filterAlphanumeric,
};

export const NAME_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_NAME,
  label: NAME_LABEL,
  required: FIELD_REQUIRED_TRUE,
  formatter: formatName,
  validator: validateName,
};

export const TYPE_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_TYPE,
  label: TYPE_LABEL,
  required: FIELD_REQUIRED_FALSE,
  inputMode: INPUT_MODE_TEXT,
};
