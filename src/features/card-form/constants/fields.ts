import type { IFieldConfig } from '@features/card-form';
import {
  validateCvv,
  validateExpires,
  validateName,
  validatePan,
  validatePin,
} from '../utils/field-validators';
import {
  filterDigitsOnly,
  filterNoSpaces,
  formatExpires,
  formatName,
  formatPan,
} from '../utils/masks';
import {
  CVV_MAX_LENGTH,
  EXPIRES_FORMATTED_LENGTH,
  EXPIRES_LENGTH,
  PAN_FORMATTED_LENGTH,
  PAN_LENGTH,
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
  formatter: filterNoSpaces,
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

export const FIELD_NAME_TYPE_ID = 'typeId';
export const TYPE_ID_LABEL = 'Тип карты';

export const FIELD_NAME_OWNER_ID = 'ownerId';
export const OWNER_ID_LABEL = 'Владелец';

export const ADDRESS_GROUP_LEGEND = 'Платёжный адрес';

export const FIELD_NAME_ADDRESS_LINE1 = 'address.line1';
export const ADDRESS_LINE1_LABEL = 'Адрес 1';
export const ADDRESS_LINE1_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_ADDRESS_LINE1,
  label: ADDRESS_LINE1_LABEL,
  required: false,
  autoComplete: 'address-line1',
};

export const FIELD_NAME_ADDRESS_LINE2 = 'address.line2';
export const ADDRESS_LINE2_LABEL = 'Адрес 2';
export const ADDRESS_LINE2_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_ADDRESS_LINE2,
  label: ADDRESS_LINE2_LABEL,
  required: false,
  autoComplete: 'address-line2',
};

export const FIELD_NAME_ADDRESS_CITY = 'address.city';
export const ADDRESS_CITY_LABEL = 'Город';
export const ADDRESS_CITY_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_ADDRESS_CITY,
  label: ADDRESS_CITY_LABEL,
  required: false,
  autoComplete: 'address-level2',
};

export const FIELD_NAME_ADDRESS_STATE = 'address.state';
export const ADDRESS_STATE_LABEL = 'Штат / область';
export const ADDRESS_STATE_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_ADDRESS_STATE,
  label: ADDRESS_STATE_LABEL,
  required: false,
  autoComplete: 'address-level1',
};

export const FIELD_NAME_ADDRESS_COUNTY = 'address.county';
export const ADDRESS_COUNTY_LABEL = 'Страна';
export const ADDRESS_COUNTY_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_ADDRESS_COUNTY,
  label: ADDRESS_COUNTY_LABEL,
  required: false,
};

export const FIELD_NAME_ADDRESS_ZIP = 'address.zip';
export const ADDRESS_ZIP_LABEL = 'Почтовый индекс';
export const ADDRESS_ZIP_FIELD_CONFIG: IFieldConfig = {
  name: FIELD_NAME_ADDRESS_ZIP,
  label: ADDRESS_ZIP_LABEL,
  required: false,
  inputMode: 'numeric',
  autoComplete: 'postal-code',
  formatter: filterDigitsOnly,
};
