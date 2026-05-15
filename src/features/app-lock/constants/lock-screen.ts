import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@features/card-export-import';

export const LOCK_SCREEN_BLOCK = 'lock-screen';

export const LOCK_SCREEN_LABEL_PASSWORD = 'Мастер-пароль';
export const LOCK_SCREEN_LABEL_CONFIRM = 'Подтвердите пароль';

export const LOCK_SCREEN_BUTTON_UNLOCK = 'Войти';
export const LOCK_SCREEN_BUTTON_CREATE = 'Создать пароль';

export const LOCK_SCREEN_ERROR_WRONG_PASSWORD = 'Неверный пароль';
export const LOCK_SCREEN_ERROR_TOO_SHORT = `Минимум ${MIN_PASSWORD_LENGTH} символов`;
export const LOCK_SCREEN_ERROR_TOO_LONG = `Максимум ${MAX_PASSWORD_LENGTH} символов`;
export const LOCK_SCREEN_ERROR_MISMATCH = 'Пароли не совпадают';
export const LOCK_SCREEN_ERROR_TOO_SIMPLE =
  'Пароль должен содержать хотя бы одну цифру';

/** Проверяет наличие хотя бы одной цифры в пароле */
export const PASSWORD_DIGIT_PATTERN = /\d/;

export const LOCK_SCREEN_TITLE_UNLOCK = 'Введите мастер-пароль';
export const LOCK_SCREEN_TITLE_CREATE = 'Создайте мастер-пароль';
export const LOCK_SCREEN_SUBTITLE_CREATE =
  'Этот пароль защищает ваши карты.\nЗапомните его - восстановление невозможно.';
