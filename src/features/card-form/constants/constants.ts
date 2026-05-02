import type { IBankCard } from '@entities/bank-card';

export const ADDRESS_PATH_PREFIX = 'address.';

export const CARD_FORM_BLOCK = 'card-form';
export const CARD_FORM_GROUP_BLOCK = 'card-form-group';

export const CARD_FORM_TITLE = 'Добавление карты';
export const CARD_FORM_EDIT_TITLE = 'Редактирование карты';

export const SUBMIT_BUTTON_TEXT = 'Добавить карту';
export const SUBMIT_BUTTON_EDIT_TEXT = 'Сохранить изменения';
export const CANCEL_BUTTON_TEXT = 'Отмена';
export const DELETE_BUTTON_TEXT = 'Удалить карту';

export const DELETE_MODAL_TITLE = 'Удаление карты';
export const DELETE_MODAL_MESSAGE = 'Вы уверены, что хотите удалить эту карту?';
export const DELETE_CONFIRM_TEXT = 'Удалить';
export const DELETE_CANCEL_TEXT = 'Отмена';

export const EMPTY_CARD_FORM: Partial<IBankCard> = {
  pan: '',
  expires: '',
  name: '',
  cvv: '',
  pin: '',
  type: '',
  phrase: '',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    county: '',
    zip: '',
  },
};
