import {
  ERROR_FAILED_TO_LOAD_CARDS,
  ERROR_FAILED_TO_ADD_CARD,
  ERROR_FAILED_TO_UPDATE_CARD,
  ERROR_FAILED_TO_DELETE_CARD,
  ERROR_FAILED_TO_REORDER_CARDS,
  ERROR_FAILED_TO_GET_CARDS,
  ERROR_FAILED_TO_GET_CARD,
  ERROR_FAILED_TO_CLEAR_CARDS,
  ERROR_FAILED_TO_UPDATE_CARDS_ORDER,
  ERROR_FAILED_TO_COPY,
} from '@shared/lib/constants/errors';

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_FAILED_TO_LOAD_CARDS]: 'Не удалось загрузить карты',
  [ERROR_FAILED_TO_ADD_CARD]: 'Не удалось добавить карту',
  [ERROR_FAILED_TO_UPDATE_CARD]: 'Не удалось обновить карту',
  [ERROR_FAILED_TO_DELETE_CARD]: 'Не удалось удалить карту',
  [ERROR_FAILED_TO_REORDER_CARDS]: 'Не удалось изменить порядок карт',
  [ERROR_FAILED_TO_GET_CARDS]: 'Не удалось получить карты',
  [ERROR_FAILED_TO_GET_CARD]: 'Не удалось получить карту',
  [ERROR_FAILED_TO_CLEAR_CARDS]: 'Не удалось очистить карты',
  [ERROR_FAILED_TO_UPDATE_CARDS_ORDER]: 'Не удалось обновить порядок карт',
  [ERROR_FAILED_TO_COPY]: 'Не удалось скопировать',
};

export const DEFAULT_ERROR_MESSAGE = 'Произошла непредвиденная ошибка';
