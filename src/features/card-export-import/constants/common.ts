import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@shared/lib';

export const PLACEHOLDER_IMPORTED = '{imported}';
export const PLACEHOLDER_REPLACED = '{replaced}';

export const IMPORT_SUCCESS_MESSAGE_TEMPLATE =
  'Импортировано: {imported} новых, {replaced} заменено';
export const SUCCESS_MODAL_TITLE_IMPORT = 'Импорт завершен';

export const FALLBACK_ERROR_EXPORT = 'Не удалось экспортировать карты';
export const FALLBACK_ERROR_IMPORT = 'Не удалось импортировать карты';

export const ERROR_PASSWORD_TOO_SHORT = `Введите минимум ${MIN_PASSWORD_LENGTH} символов`;
export const ERROR_PASSWORD_TOO_LONG = `Максимальная длина пароля - ${MAX_PASSWORD_LENGTH} символов`;
export const ERROR_PASSWORD_MISMATCH = 'Пароли не совпадают';
export const ERROR_PASSWORD_TOO_SIMPLE =
  'Пароль должен содержать хотя бы одну цифру';

export const PASSWORD_DIGIT_PATTERN = /\d/;

export const ERROR_CORRUPTED_FILE = 'Файл поврежден';
export const ERROR_UNSUPPORTED_VERSION = 'Неподдерживаемая версия формата';
