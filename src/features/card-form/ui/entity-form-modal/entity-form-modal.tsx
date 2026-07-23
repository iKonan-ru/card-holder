import { useState, type ChangeEvent, type FC, type SubmitEvent } from 'react';
import { MasterPasswordConfirmModal } from '@features/app-lock';
import {
  bem,
  logError,
  ParentClassProvider,
  useClassName,
  useModal,
} from '@shared/lib';
import { Button, FormField } from '@shared/ui';
import {
  ENTITY_FORM_MODAL_BLOCK,
  ERROR_FAILED_TO_SUBMIT_ENTITY_FORM,
} from './constants';
import './entity-form-modal.less';

export interface IEntityFormModalTexts {
  fieldId: string;
  fieldName: string;
  nameLabel: string;
  submitLabelCreate: string;
  submitLabelEdit: string;
  deleteButtonLabel: string;
  deleteModalTitle: string;
  deleteModalMessage: string;
}

interface IEntityFormModalProps {
  initialValue: string;
  isEditMode: boolean;
  texts: IEntityFormModalTexts;
  onSubmit: (value: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const EntityFormModal: FC<IEntityFormModalProps> = ({
  initialValue,
  isEditMode,
  texts,
  onSubmit,
  onDelete,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open } = useModal();

  const handleValueChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(value.trim());
    } catch (error) {
      logError({
        message: ERROR_FAILED_TO_SUBMIT_ENTITY_FORM,
        error,
        context: 'EntityFormModal.handleSubmit',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    if (!onDelete) {
      return;
    }

    open(
      <MasterPasswordConfirmModal
        message={texts.deleteModalMessage}
        onConfirm={onDelete}
      />,
      texts.deleteModalTitle,
    );
  };

  const isSubmitEnabled = value.trim().length > 0;
  const submitLabel = isEditMode
    ? texts.submitLabelEdit
    : texts.submitLabelCreate;

  const className = useClassName({ blockName: ENTITY_FORM_MODAL_BLOCK });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={ENTITY_FORM_MODAL_BLOCK}>
        <FormField
          id={texts.fieldId}
          name={texts.fieldName}
          label={texts.nameLabel}
          value={value}
          onChange={handleValueChange}
          disabled={isSubmitting}
          required
          autoFocus
        />
        <div className={bem(ENTITY_FORM_MODAL_BLOCK, 'actions')}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting || !isSubmitEnabled}
          >
            {submitLabel}
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteClick}
              disabled={isSubmitting}
            >
              {texts.deleteButtonLabel}
            </Button>
          )}
        </div>
      </ParentClassProvider>
    </form>
  );
};
