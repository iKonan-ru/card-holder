import {
  useCallback,
  useState,
  type ChangeEvent,
  type FC,
  type SubmitEvent,
} from 'react';
import { MIN_PASSWORD_LENGTH } from '@features/card-export-import';
import {
  bem,
  ERROR_WRONG_MASTER_PASSWORD,
  ParentClassProvider,
  useClassName,
  useModalClose,
  verifyMasterPassword,
  withRateLimit,
} from '@shared/lib';
import { Button, PasswordField } from '@shared/ui';
import {
  MASTER_PASSWORD_CONFIRM_MODAL_BLOCK,
  MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL,
  MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
  MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD,
  MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD,
} from '../../constants';
import './master-password-confirm-modal.less';

interface IMasterPasswordConfirmModalProps {
  message: string;
  onConfirm: () => Promise<void>;
}

export const MasterPasswordConfirmModal: FC<
  IMasterPasswordConfirmModalProps
> = ({ message, onConfirm }) => {
  const closeModal = useModalClose();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSubmitEnabled = password.length >= MIN_PASSWORD_LENGTH;

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(undefined);
      setIsSubmitting(true);

      try {
        await withRateLimit(async () => {
          const isCorrect = await verifyMasterPassword(password);

          if (!isCorrect) {
            throw new Error(ERROR_WRONG_MASTER_PASSWORD);
          }
        });

        await onConfirm();
        closeModal();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD,
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [password, onConfirm, closeModal],
  );

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPassword(event.target.value);
      setError(undefined);
    },
    [],
  );

  const className = useClassName({
    blockName: MASTER_PASSWORD_CONFIRM_MODAL_BLOCK,
  });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={MASTER_PASSWORD_CONFIRM_MODAL_BLOCK}>
        <p className={bem(MASTER_PASSWORD_CONFIRM_MODAL_BLOCK, 'message')}>
          {message}
        </p>

        <PasswordField
          id="master-password-confirm"
          name="masterPassword"
          label={MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD}
          value={password}
          error={error}
          onChange={handlePasswordChange}
          autoComplete="current-password"
          autoFocus={true}
          required={true}
          disabled={isSubmitting}
          isPasswordVisible={isPasswordVisible}
          onPasswordVisibilityChange={setIsPasswordVisible}
        />

        <div className={bem(MASTER_PASSWORD_CONFIRM_MODAL_BLOCK, 'actions')}>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            disabled={isSubmitting || !isSubmitEnabled}
          >
            {MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            {MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL}
          </Button>
        </div>
      </ParentClassProvider>
    </form>
  );
};
