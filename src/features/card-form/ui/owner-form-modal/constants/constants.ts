import type { IEntityFormModalTexts } from '../../entity-form-modal';

export const OWNER_FORM_NAME_FIELD_ID = 'owner-form-name';
export const OWNER_FORM_NAME_FIELD_NAME = 'realName';
export const OWNER_FORM_NAME_LABEL = 'Имя владельца';
export const OWNER_FORM_SUBMIT_LABEL_CREATE = 'Добавить';
export const OWNER_FORM_SUBMIT_LABEL_EDIT = 'Сохранить';
export const OWNER_FORM_DELETE_BUTTON_LABEL = 'Удалить владельца';
export const OWNER_FORM_DELETE_MODAL_TITLE = 'Удаление владельца';
export const OWNER_FORM_DELETE_MODAL_MESSAGE =
  'Вы уверены, что хотите удалить этого владельца?';

export const OWNER_FORM_TEXTS: IEntityFormModalTexts = {
  fieldId: OWNER_FORM_NAME_FIELD_ID,
  fieldName: OWNER_FORM_NAME_FIELD_NAME,
  nameLabel: OWNER_FORM_NAME_LABEL,
  submitLabelCreate: OWNER_FORM_SUBMIT_LABEL_CREATE,
  submitLabelEdit: OWNER_FORM_SUBMIT_LABEL_EDIT,
  deleteButtonLabel: OWNER_FORM_DELETE_BUTTON_LABEL,
  deleteModalTitle: OWNER_FORM_DELETE_MODAL_TITLE,
  deleteModalMessage: OWNER_FORM_DELETE_MODAL_MESSAGE,
};
