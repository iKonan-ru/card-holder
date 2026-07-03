import { useState, type ChangeEvent, type FC, type SubmitEvent } from 'react';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import { Button, FormField } from '@shared/ui';
import {
  CARD_TYPE_QUICK_CREATE_BLOCK,
  CARD_TYPE_QUICK_CREATE_NAME_LABEL,
  CARD_TYPE_QUICK_CREATE_SUBMIT_LABEL,
} from './constants';
import './card-type-quick-create-modal.less';

interface ICardTypeQuickCreateModalProps {
  onCreate: (name: string) => Promise<void>;
}

export const CardTypeQuickCreateModal: FC<ICardTypeQuickCreateModalProps> = ({
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onCreate(name.trim());
  };

  const isSubmitEnabled = name.trim().length > 0;

  const className = useClassName({ blockName: CARD_TYPE_QUICK_CREATE_BLOCK });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={CARD_TYPE_QUICK_CREATE_BLOCK}>
        <FormField
          id="card-type-quick-create-name"
          name="name"
          label={CARD_TYPE_QUICK_CREATE_NAME_LABEL}
          value={name}
          onChange={handleNameChange}
          disabled={isSubmitting}
          required
          autoFocus
        />
        <div className={bem(CARD_TYPE_QUICK_CREATE_BLOCK, 'actions')}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting || !isSubmitEnabled}
          >
            {CARD_TYPE_QUICK_CREATE_SUBMIT_LABEL}
          </Button>
        </div>
      </ParentClassProvider>
    </form>
  );
};
