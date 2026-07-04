import type { IEntityFormModalTexts } from '../../entity-form-modal';

export const CARD_TYPE_FORM_NAME_FIELD_ID = 'card-type-form-name';
export const CARD_TYPE_FORM_NAME_FIELD_NAME = 'name';
export const CARD_TYPE_FORM_NAME_LABEL = 'Название';
export const CARD_TYPE_FORM_SUBMIT_LABEL_CREATE = 'Добавить';
export const CARD_TYPE_FORM_SUBMIT_LABEL_EDIT = 'Сохранить';
export const CARD_TYPE_FORM_DELETE_BUTTON_LABEL = 'Удалить тип';
export const CARD_TYPE_FORM_DELETE_MODAL_TITLE = 'Удаление типа карты';
export const CARD_TYPE_FORM_DELETE_MODAL_MESSAGE =
  'Вы уверены, что хотите удалить этот тип карты?';

export const CARD_TYPE_FORM_TEXTS: IEntityFormModalTexts = {
  fieldId: CARD_TYPE_FORM_NAME_FIELD_ID,
  fieldName: CARD_TYPE_FORM_NAME_FIELD_NAME,
  nameLabel: CARD_TYPE_FORM_NAME_LABEL,
  submitLabelCreate: CARD_TYPE_FORM_SUBMIT_LABEL_CREATE,
  submitLabelEdit: CARD_TYPE_FORM_SUBMIT_LABEL_EDIT,
  deleteButtonLabel: CARD_TYPE_FORM_DELETE_BUTTON_LABEL,
  deleteModalTitle: CARD_TYPE_FORM_DELETE_MODAL_TITLE,
  deleteModalMessage: CARD_TYPE_FORM_DELETE_MODAL_MESSAGE,
};
