import { useState, type ChangeEvent, type FC, type SubmitEvent } from 'react';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import { Button, FormField } from '@shared/ui';
import {
  OWNER_ALIASES_SEPARATOR,
  OWNER_QUICK_CREATE_ALIASES_LABEL,
  OWNER_QUICK_CREATE_BLOCK,
  OWNER_QUICK_CREATE_NAME_LABEL,
  OWNER_QUICK_CREATE_SUBMIT_LABEL,
} from './constants';
import './owner-quick-create-modal.less';

interface IOwnerQuickCreateModalProps {
  onCreate: (realName: string, aliases: string[]) => Promise<void>;
}

export const OwnerQuickCreateModal: FC<IOwnerQuickCreateModalProps> = ({
  onCreate,
}) => {
  const [realName, setRealName] = useState('');
  const [aliasesInput, setAliasesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRealNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRealName(event.target.value);
  };

  const handleAliasesChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setAliasesInput(event.target.value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const aliases = aliasesInput
      .split(OWNER_ALIASES_SEPARATOR)
      .map((alias) => alias.trim())
      .filter(Boolean);

    await onCreate(realName.trim(), aliases);
  };

  const isSubmitEnabled = realName.trim().length > 0;

  const className = useClassName({ blockName: OWNER_QUICK_CREATE_BLOCK });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={OWNER_QUICK_CREATE_BLOCK}>
        <FormField
          id="owner-quick-create-name"
          name="realName"
          label={OWNER_QUICK_CREATE_NAME_LABEL}
          value={realName}
          onChange={handleRealNameChange}
          disabled={isSubmitting}
          required
          autoFocus
        />
        <FormField
          id="owner-quick-create-aliases"
          name="aliases"
          label={OWNER_QUICK_CREATE_ALIASES_LABEL}
          value={aliasesInput}
          onChange={handleAliasesChange}
          disabled={isSubmitting}
        />
        <div className={bem(OWNER_QUICK_CREATE_BLOCK, 'actions')}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting || !isSubmitEnabled}
          >
            {OWNER_QUICK_CREATE_SUBMIT_LABEL}
          </Button>
        </div>
      </ParentClassProvider>
    </form>
  );
};
