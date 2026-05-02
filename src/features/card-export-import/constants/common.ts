export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const PLACEHOLDER_IMPORTED = '{imported}';
export const PLACEHOLDER_REPLACED = '{replaced}';

export const IMPORT_SUCCESS_MESSAGE_TEMPLATE =
  'Импортировано: {imported} новых, {replaced} заменено';
export const SUCCESS_MODAL_TITLE_IMPORT = 'Импорт завершен';

export const FALLBACK_ERROR_EXPORT = 'Не удалось экспортировать карты';
export const FALLBACK_ERROR_IMPORT = 'Не удалось импортировать карты';

export const ERROR_PASSWORD_TOO_SHORT = `Введите минимум ${MIN_PASSWORD_LENGTH} символов`;
export const ERROR_PASSWORD_TOO_LONG = `Максимальная длина пароля — ${MAX_PASSWORD_LENGTH} символов`;
export const ERROR_PASSWORD_MISMATCH = 'Пароли не совпадают';

export const ERROR_CORRUPTED_FILE = 'Файл поврежден';
export const ERROR_UNSUPPORTED_VERSION = 'Неподдерживаемая версия формата';
