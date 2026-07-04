import type { IBankCard } from '@entities/bank-card';

export const ERROR_FAILED_TO_LOAD_CARDS = 'Не удалось загрузить карты';
export const ERROR_FAILED_TO_REORDER_CARDS = 'Не удалось изменить порядок карт';

export const DEFAULT_CARD_ORDER = 0;

export const INITIAL_CARDS: IBankCard[] = [];
export const INITIAL_FLIPPED_PAN = null;
export const INITIAL_IS_LOADING = false;
export const INITIAL_IS_REORDER_MODE = false;
