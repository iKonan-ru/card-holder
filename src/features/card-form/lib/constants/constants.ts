export const CARD_FORM_BLOCK = 'card-form';

export const CARD_FORM_TITLE_ID = 'card-form-title';

export const CARD_FORM_TITLE = 'Добавление карты';
export const CARD_FORM_EDIT_TITLE = 'Редактирование карты';

export const PAN_LENGTH = 16;
export const PAN_FORMATTED_LENGTH = 19;
export const EXPIRES_LENGTH = 4;
export const EXPIRES_FORMATTED_LENGTH = 5;
export const CVV_MAX_LENGTH = 3;
export const PIN_MAX_LENGTH = 4;
export const MIN_NAME_LENGTH = 2;
export const MIN_YEAR = 22;
export const MAX_MONTH = 12;

export const MONTH_VALIDATION_PATTERN = /^(0[1-9]|1[0-2])$/;
export const NON_DIGIT_REMOVAL_PATTERN = /\D/g;

export const PAN_LABEL = 'Номер карты';
export const NAME_LABEL = 'Имя владельца';
export const EXPIRES_LABEL = 'Срок действия';
export const CVV_LABEL = 'CVV';
export const PIN_LABEL = 'PIN';
export const TYPE_LABEL = 'Тип карты';
export const PHRASE_LABEL = 'Кодовая фраза';

export const SUBMIT_BUTTON_TEXT = 'Добавить карту';
export const SUBMIT_BUTTON_EDIT_TEXT = 'Сохранить изменения';
export const CANCEL_BUTTON_TEXT = 'Отмена';
export const DELETE_BUTTON_TEXT = 'Удалить карту';

export const DELETE_MODAL_TITLE = 'Удаление карты';
export const DELETE_MODAL_MESSAGE = 'Вы уверены, что хотите удалить эту карту?';
export const DELETE_CONFIRM_TEXT = 'Удалить';
export const DELETE_CANCEL_TEXT = 'Отмена';

export const ERROR_CARD_ALREADY_EXISTS = 'Такая карта уже существует';

export const ERROR_PAN_REQUIRED = 'Номер карты обязателен';
export const ERROR_PAN_INVALID_LENGTH = `Введите ${PAN_LENGTH} цифр`;
export const ERROR_PAN_INVALID = 'Неверный номер карты';

export const ERROR_EXPIRES_REQUIRED = 'Срок действия обязателен';
export const ERROR_EXPIRES_MONTH = `Месяц должен быть от 1 до ${MAX_MONTH}`;
export const ERROR_EXPIRES_YEAR = `Год должен быть больше 20${MIN_YEAR}`;

export const ERROR_NAME_REQUIRED = 'Имя обязательно';
export const ERROR_NAME_TOO_SHORT = 'Имя слишком короткое';

export const ERROR_CVV_REQUIRED = 'CVV обязателен';
export const ERROR_CVV_INVALID_LENGTH = `Введите ${CVV_MAX_LENGTH} цифры`;

export const ERROR_PIN_INVALID_LENGTH = `Введите ${PIN_MAX_LENGTH} цифры`;

export const EMPTY_CARD_FORM = {
  pan: '',
  expires: '',
  name: '',
  cvv: '',
  pin: '',
  type: '',
  phrase: '',
};

export const FIELD_NAME_PAN = 'pan';
export const FIELD_NAME_EXPIRES = 'expires';
export const FIELD_NAME_CVV = 'cvv';
export const FIELD_NAME_PIN = 'pin';
export const FIELD_NAME_PHRASE = 'phrase';
export const FIELD_NAME_NAME = 'name';
export const FIELD_NAME_TYPE = 'type';

export const FIELD_REQUIRED_TRUE = true;
export const FIELD_REQUIRED_FALSE = false;
