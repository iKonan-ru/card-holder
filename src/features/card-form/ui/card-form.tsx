import { type FC } from 'react';
import type { ICardFormProps } from './model';
import { bem, useClassName, useModal } from '@shared/lib';
import {
  ValidatedField,
  ConfirmModal,
  CardPreview,
  CONFIRM_MODAL_TITLE_ID,
  CONFIRM_MODAL_MESSAGE_ID,
} from '@shared/ui';
import { useCardForm } from '../lib/hooks';
import {
  CARD_FORM_BLOCK,
  CARD_FORM_TITLE,
  CARD_FORM_EDIT_TITLE,
  CARD_FORM_TITLE_ID,
  SUBMIT_BUTTON_TEXT,
  SUBMIT_BUTTON_EDIT_TEXT,
  DELETE_BUTTON_TEXT,
  CANCEL_BUTTON_TEXT,
  DELETE_MODAL_TITLE,
  DELETE_MODAL_MESSAGE,
  DELETE_CONFIRM_TEXT,
  DELETE_CANCEL_TEXT,
  PAN_FIELD_CONFIG,
  NAME_FIELD_CONFIG,
  EXPIRES_FIELD_CONFIG,
  CVV_FIELD_CONFIG,
  PIN_FIELD_CONFIG,
  TYPE_FIELD_CONFIG,
  PHRASE_FIELD_CONFIG,
} from '../lib';
import './card-form.less';

export const CardForm: FC<ICardFormProps> = ({
  initialCard,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    isEditMode,
    handleFieldChange,
    handleFieldValidation,
    handleSubmit,
    handleDelete,
    handleReset,
  } = useCardForm({ initialCard, onSuccess });

  const deleteModal = useModal();

  const handleCancelClick = () => {
    handleReset();

    if (onCancel) {
      onCancel();
    }
  };

  const handleDeleteClick = () => {
    deleteModal.open(
      <ConfirmModal
        title={DELETE_MODAL_TITLE}
        message={DELETE_MODAL_MESSAGE}
        confirmText={DELETE_CONFIRM_TEXT}
        cancelText={DELETE_CANCEL_TEXT}
        onConfirm={handleConfirmDelete}
        onCancel={deleteModal.close}
      />,
      () => {},
      CONFIRM_MODAL_TITLE_ID,
      CONFIRM_MODAL_MESSAGE_ID
    );
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    deleteModal.close();
  };

  const panFieldRightContent = <CardPreview pan={formData.pan || ''} />;

  const formTitle = isEditMode ? CARD_FORM_EDIT_TITLE : CARD_FORM_TITLE;
  const submitButtonText = isEditMode
    ? SUBMIT_BUTTON_EDIT_TEXT
    : SUBMIT_BUTTON_TEXT;

  const className = useClassName({
    blockName: CARD_FORM_BLOCK,
  });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
      aria-labelledby={CARD_FORM_TITLE_ID}
      aria-busy={isSubmitting}
    >
      <h3
        id={CARD_FORM_TITLE_ID}
        className={bem(CARD_FORM_BLOCK, 'title')}
      >
        {formTitle}
      </h3>

      <ValidatedField
        {...PAN_FIELD_CONFIG}
        value={formData.pan || ''}
        error={errors.pan}
        disabled={isSubmitting}
        rightContent={panFieldRightContent}
        onChange={handleFieldChange}
        onValidate={handleFieldValidation}
        parentClass={CARD_FORM_BLOCK}
      />

      <div className={bem(CARD_FORM_BLOCK, 'row')}>
        <ValidatedField
          {...EXPIRES_FIELD_CONFIG}
          value={formData.expires || ''}
          error={errors.expires}
          disabled={isSubmitting}
          onChange={handleFieldChange}
          onValidate={handleFieldValidation}
          parentClass={CARD_FORM_BLOCK}
        />

        <ValidatedField
          {...CVV_FIELD_CONFIG}
          value={formData.cvv || ''}
          error={errors.cvv}
          disabled={isSubmitting}
          onChange={handleFieldChange}
          onValidate={handleFieldValidation}
          parentClass={CARD_FORM_BLOCK}
        />

        <ValidatedField
          {...PIN_FIELD_CONFIG}
          value={formData.pin || ''}
          error={errors.pin}
          disabled={isSubmitting}
          onChange={handleFieldChange}
          onValidate={handleFieldValidation}
          parentClass={CARD_FORM_BLOCK}
        />
      </div>

      <ValidatedField
        {...NAME_FIELD_CONFIG}
        value={formData.name || ''}
        error={errors.name}
        disabled={isSubmitting}
        onChange={handleFieldChange}
        parentClass={CARD_FORM_BLOCK}
      />

      <ValidatedField
        {...TYPE_FIELD_CONFIG}
        value={formData.type || ''}
        disabled={isSubmitting}
        onChange={handleFieldChange}
        parentClass={CARD_FORM_BLOCK}
      />

      <ValidatedField
        {...PHRASE_FIELD_CONFIG}
        value={formData.phrase || ''}
        error={errors.phrase}
        disabled={isSubmitting}
        onChange={handleFieldChange}
        onValidate={handleFieldValidation}
        parentClass={CARD_FORM_BLOCK}
      />

      <div className={bem(CARD_FORM_BLOCK, 'actions')}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={bem(bem(CARD_FORM_BLOCK, 'button'), ['primary'])}
        >
          {submitButtonText}
        </button>
        <button
          type="button"
          onClick={handleCancelClick}
          disabled={isSubmitting}
          className={bem(bem(CARD_FORM_BLOCK, 'button'), ['secondary'])}
        >
          {CANCEL_BUTTON_TEXT}
        </button>
        {isEditMode && (
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isSubmitting}
            className={bem(bem(CARD_FORM_BLOCK, 'button'), ['danger'])}
          >
            {DELETE_BUTTON_TEXT}
          </button>
        )}
      </div>
    </form>
  );
};
