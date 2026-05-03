import {
  useCallback,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@features/card-export-import';
import {
  LOCK_SCREEN_ERROR_MISMATCH,
  LOCK_SCREEN_ERROR_TOO_LONG,
  LOCK_SCREEN_ERROR_TOO_SHORT,
  LOCK_SCREEN_ERROR_WRONG_PASSWORD,
} from '../constants';
import { useCryptoStore } from '../store';

interface IUseLockScreenFormResult {
  password: string;
  confirmPassword: string;
  passwordError: string | undefined;
  confirmError: string | undefined;
  isSubmitting: boolean;
  isPasswordVisible: boolean;
  isSubmitEnabled: boolean;
  isFirstSetup: boolean;
  handlePasswordChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleConfirmChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleVisibilityChange: (isVisible: boolean) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
}

export const useLockScreenForm = (): IUseLockScreenFormResult => {
  const { isFirstSetup, unlock } = useCryptoStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPassword(event.target.value);
      setPasswordError(undefined);
      setConfirmError(undefined);
    },
    [],
  );

  const handleConfirmChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setConfirmPassword(event.target.value);
      setConfirmError(undefined);
    },
    [],
  );

  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    setIsPasswordVisible(isVisible);
  }, []);

  const isSubmitEnabled =
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH &&
    (!isFirstSetup ||
      (confirmPassword.length >= MIN_PASSWORD_LENGTH &&
        password === confirmPassword));

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPasswordError(undefined);
      setConfirmError(undefined);

      if (password.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(LOCK_SCREEN_ERROR_TOO_SHORT);

        return;
      }

      if (password.length > MAX_PASSWORD_LENGTH) {
        setPasswordError(LOCK_SCREEN_ERROR_TOO_LONG);

        return;
      }

      if (isFirstSetup && password !== confirmPassword) {
        setConfirmError(LOCK_SCREEN_ERROR_MISMATCH);

        return;
      }

      setIsSubmitting(true);

      try {
        await unlock(password);
      } catch (error) {
        setPasswordError(
          error instanceof Error
            ? error.message
            : LOCK_SCREEN_ERROR_WRONG_PASSWORD,
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [password, confirmPassword, isFirstSetup, unlock],
  );

  return {
    password,
    confirmPassword,
    passwordError,
    confirmError,
    isSubmitting,
    isPasswordVisible,
    isSubmitEnabled,
    isFirstSetup,
    handlePasswordChange,
    handleConfirmChange,
    handleVisibilityChange,
    handleSubmit,
  };
};
