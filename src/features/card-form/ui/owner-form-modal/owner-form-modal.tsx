import { useState, type ChangeEvent, type FC, type SubmitEvent } from 'react';
import { MasterPasswordConfirmModal } from '@features/app-lock';
import type { IOwner } from '@entities/card-owner';
import { bem, ParentClassProvider, useClassName, useModal } from '@shared/lib';
import { Button, FormField } from '@shared/ui';
import {
  OWNER_FORM_BLOCK,
  OWNER_FORM_DELETE_BUTTON_LABEL,
  OWNER_FORM_DELETE_MODAL_MESSAGE,
  OWNER_FORM_DELETE_MODAL_TITLE,
  OWNER_FORM_NAME_LABEL,
  OWNER_FORM_SUBMIT_LABEL_CREATE,
  OWNER_FORM_SUBMIT_LABEL_EDIT,
} from './constants';
import './owner-form-modal.less';

interface IOwnerFormModalProps {
  owner?: IOwner;
  onSubmit: (realName: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const OwnerFormModal: FC<IOwnerFormModalProps> = ({
  owner,
  onSubmit,
  onDelete,
}) => {
  const [realName, setRealName] = useState(owner?.realName ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open } = useModal();

  const isEditMode = Boolean(owner);

  const handleRealNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRealName(event.target.value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit(realName.trim());
  };

  const handleDeleteClick = () => {
    if (!onDelete) {
      return;
    }

    open(
      <MasterPasswordConfirmModal
        message={OWNER_FORM_DELETE_MODAL_MESSAGE}
        onConfirm={onDelete}
      />,
      OWNER_FORM_DELETE_MODAL_TITLE,
    );
  };

  const isSubmitEnabled = realName.trim().length > 0;
  const submitLabel = isEditMode
    ? OWNER_FORM_SUBMIT_LABEL_EDIT
    : OWNER_FORM_SUBMIT_LABEL_CREATE;

  const className = useClassName({ blockName: OWNER_FORM_BLOCK });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={OWNER_FORM_BLOCK}>
        <FormField
          id="owner-form-name"
          name="realName"
          label={OWNER_FORM_NAME_LABEL}
          value={realName}
          onChange={handleRealNameChange}
          disabled={isSubmitting}
          required
          autoFocus
        />
        <div className={bem(OWNER_FORM_BLOCK, 'actions')}>
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
              {OWNER_FORM_DELETE_BUTTON_LABEL}
            </Button>
          )}
        </div>
      </ParentClassProvider>
    </form>
  );
};
