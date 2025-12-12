import { useCallback, useMemo, type FC } from 'react';
import { CardPreview } from '@features/card-preview';
import type { IBankCard } from '@entities/bank-card';
import {
  bem,
  BUTTON_TYPE_BUTTON,
  BUTTON_TYPE_SUBMIT,
  FormProvider,
  ParentClassProvider,
  useClassName,
  useModal,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Button, ConfirmModal, ValidatedField } from '@shared/ui';
import {
  CANCEL_BUTTON_TEXT,
  CARD_FORM_BLOCK,
  CVV_FIELD_CONFIG,
  DELETE_BUTTON_TEXT,
  DELETE_CANCEL_TEXT,
  DELETE_CONFIRM_TEXT,
  DELETE_MODAL_MESSAGE,
  DELETE_MODAL_TITLE,
  EXPIRES_FIELD_CONFIG,
  NAME_FIELD_CONFIG,
  PAN_FIELD_CONFIG,
  PHRASE_FIELD_CONFIG,
  PIN_FIELD_CONFIG,
  SUBMIT_BUTTON_EDIT_TEXT,
  SUBMIT_BUTTON_TEXT,
  TYPE_FIELD_CONFIG,
} from '../../constants';
import { useCardForm } from '../../hooks';
import './card-form.less';

interface ICardFormProps {
  initialCard?: Partial<IBankCard>;
  onSuccess?: Procedure;
  onCancel?: Procedure;
}

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
  } = useCardForm({ initialCard, onSuccess });

  const { open } = useModal();

  const handleCancelClick = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleConfirmDelete = useCallback(async () => {
    await handleDelete();
  }, [handleDelete]);

  const handleDeleteClick = useCallback(() => {
    open(
      <ConfirmModal
        message={DELETE_MODAL_MESSAGE}
        confirmText={DELETE_CONFIRM_TEXT}
        cancelText={DELETE_CANCEL_TEXT}
        onConfirm={handleConfirmDelete}
      />,
      DELETE_MODAL_TITLE,
    );
  }, [open, handleConfirmDelete]);

  const panFieldRightContent = useMemo(
    () => <CardPreview pan={formData.pan || ''} />,
    [formData.pan],
  );

  const submitButtonText = isEditMode
    ? SUBMIT_BUTTON_EDIT_TEXT
    : SUBMIT_BUTTON_TEXT;

  const className = useClassName({
    blockName: CARD_FORM_BLOCK,
  });

  return (
    <FormProvider
      onChange={handleFieldChange}
      onValidate={handleFieldValidation}
    >
      <form
        className={className}
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
      >
        <ParentClassProvider parentClass={CARD_FORM_BLOCK}>
          <ValidatedField
            {...PAN_FIELD_CONFIG}
            value={formData.pan || ''}
            error={errors.pan}
            disabled={isSubmitting}
            rightContent={panFieldRightContent}
            parentClass={CARD_FORM_BLOCK}
          />

          <div className={bem(CARD_FORM_BLOCK, 'row')}>
            <ValidatedField
              {...EXPIRES_FIELD_CONFIG}
              value={formData.expires || ''}
              error={errors.expires}
              disabled={isSubmitting}
              parentClass={CARD_FORM_BLOCK}
            />

            <ValidatedField
              {...CVV_FIELD_CONFIG}
              value={formData.cvv || ''}
              error={errors.cvv}
              disabled={isSubmitting}
              parentClass={CARD_FORM_BLOCK}
            />

            <ValidatedField
              {...PIN_FIELD_CONFIG}
              value={formData.pin || ''}
              error={errors.pin}
              disabled={isSubmitting}
              parentClass={CARD_FORM_BLOCK}
            />
          </div>

          <ValidatedField
            {...NAME_FIELD_CONFIG}
            value={formData.name || ''}
            error={errors.name}
            disabled={isSubmitting}
            parentClass={CARD_FORM_BLOCK}
          />

          <ValidatedField
            {...TYPE_FIELD_CONFIG}
            value={formData.type || ''}
            disabled={isSubmitting}
            parentClass={CARD_FORM_BLOCK}
          />

          <ValidatedField
            {...PHRASE_FIELD_CONFIG}
            value={formData.phrase || ''}
            error={errors.phrase}
            disabled={isSubmitting}
            parentClass={CARD_FORM_BLOCK}
          />

          <div className={bem(CARD_FORM_BLOCK, 'actions')}>
            <Button
              type={BUTTON_TYPE_SUBMIT}
              disabled={isSubmitting}
              variant="primary"
            >
              {submitButtonText}
            </Button>
            <Button
              type={BUTTON_TYPE_BUTTON}
              onClick={handleCancelClick}
              disabled={isSubmitting}
              variant="secondary"
            >
              {CANCEL_BUTTON_TEXT}
            </Button>
            {isEditMode && (
              <Button
                type={BUTTON_TYPE_BUTTON}
                onClick={handleDeleteClick}
                disabled={isSubmitting}
                variant="danger"
              >
                {DELETE_BUTTON_TEXT}
              </Button>
            )}
          </div>
        </ParentClassProvider>
      </form>
    </FormProvider>
  );
};
