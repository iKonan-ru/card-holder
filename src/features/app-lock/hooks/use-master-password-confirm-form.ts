import {
  useCallback,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import {
  ERROR_WRONG_MASTER_PASSWORD,
  MIN_PASSWORD_LENGTH,
  useModalClose,
  verifyMasterPassword,
  withRateLimit,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD } from '../constants';

interface IUseMasterPasswordConfirmFormParams {
  onConfirm: () => Promise<void>;
}

interface IUseMasterPasswordConfirmFormResult {
  password: string;
  error: string | undefined;
  isSubmitting: boolean;
  isPasswordVisible: boolean;
  isSubmitEnabled: boolean;
  closeModal: Procedure;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handlePasswordChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setIsPasswordVisible: (isVisible: boolean) => void;
}

export const useMasterPasswordConfirmForm = ({
  onConfirm,
}: IUseMasterPasswordConfirmFormParams): IUseMasterPasswordConfirmFormResult => {
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

  return {
    password,
    error,
    isSubmitting,
    isPasswordVisible,
    isSubmitEnabled,
    closeModal,
    handleSubmit,
    handlePasswordChange,
    setIsPasswordVisible,
  };
};
