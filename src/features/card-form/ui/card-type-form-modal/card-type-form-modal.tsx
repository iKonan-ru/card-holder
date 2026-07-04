import { useState, type ChangeEvent, type FC, type SubmitEvent } from 'react';
import { MasterPasswordConfirmModal } from '@features/app-lock';
import type { ICardType } from '@entities/card-type';
import { bem, ParentClassProvider, useClassName, useModal } from '@shared/lib';
import { Button, FormField } from '@shared/ui';
import {
  CARD_TYPE_FORM_BLOCK,
  CARD_TYPE_FORM_DELETE_BUTTON_LABEL,
  CARD_TYPE_FORM_DELETE_MODAL_MESSAGE,
  CARD_TYPE_FORM_DELETE_MODAL_TITLE,
  CARD_TYPE_FORM_NAME_LABEL,
  CARD_TYPE_FORM_SUBMIT_LABEL_CREATE,
  CARD_TYPE_FORM_SUBMIT_LABEL_EDIT,
} from './constants';
import './card-type-form-modal.less';

interface ICardTypeFormModalProps {
  cardType?: ICardType;
  onSubmit: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const CardTypeFormModal: FC<ICardTypeFormModalProps> = ({
  cardType,
  onSubmit,
  onDelete,
}) => {
  const [name, setName] = useState(cardType?.name ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open } = useModal();

  const isEditMode = Boolean(cardType);

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit(name.trim());
  };

  const handleDeleteClick = () => {
    if (!onDelete) {
      return;
    }

    open(
      <MasterPasswordConfirmModal
        message={CARD_TYPE_FORM_DELETE_MODAL_MESSAGE}
        onConfirm={onDelete}
      />,
      CARD_TYPE_FORM_DELETE_MODAL_TITLE,
    );
  };

  const isSubmitEnabled = name.trim().length > 0;
  const submitLabel = isEditMode
    ? CARD_TYPE_FORM_SUBMIT_LABEL_EDIT
    : CARD_TYPE_FORM_SUBMIT_LABEL_CREATE;

  const className = useClassName({ blockName: CARD_TYPE_FORM_BLOCK });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={CARD_TYPE_FORM_BLOCK}>
        <FormField
          id="card-type-form-name"
          name="name"
          label={CARD_TYPE_FORM_NAME_LABEL}
          value={name}
          onChange={handleNameChange}
          disabled={isSubmitting}
          required
          autoFocus
        />
        <div className={bem(CARD_TYPE_FORM_BLOCK, 'actions')}>
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
              {CARD_TYPE_FORM_DELETE_BUTTON_LABEL}
            </Button>
          )}
        </div>
      </ParentClassProvider>
    </form>
  );
};
