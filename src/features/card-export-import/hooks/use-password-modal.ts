import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useAnimatedModalClose, useModalClose } from '@shared/lib';
import type { Procedure } from '@shared/types';
import {
  PASSWORD_MODAL_BUTTON_EXPORT,
  PASSWORD_MODAL_BUTTON_IMPORT,
  PASSWORD_MODAL_TITLE_EXPORT,
  PASSWORD_MODAL_TITLE_IMPORT,
} from '../constants';
import type { TPasswordModalMode } from '../types';
import { exportPasswordSchema } from '../utils/schemas';

interface IUsePasswordModalParams {
  mode: TPasswordModalMode;
  onConfirm: (
    password: string,
    closeModal: Procedure,
    setError: (error: string) => void,
  ) => Promise<void>;
  onCancel?: Procedure;
}

interface IUsePasswordModalResult {
  password: string;
  confirmPassword: string;
  passwordError: string | undefined;
  confirmError: string | undefined;
  isSubmitting: boolean;
  isExportMode: boolean;
  isPasswordVisible: boolean;
  title: string;
  buttonText: string;
  handlePasswordChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleConfirmPasswordChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handlePasswordVisibilityChange: (isVisible: boolean) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleCancel: Procedure;
}

export const usePasswordModal = (
  params: IUsePasswordModalParams,
): IUsePasswordModalResult => {
  const { mode, onConfirm, onCancel } = params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const closeModal = useModalClose();
  const handleCancel = useAnimatedModalClose(onCancel);

  const isExportMode = mode === 'export';

  const title = useMemo(() => {
    return isExportMode
      ? PASSWORD_MODAL_TITLE_EXPORT
      : PASSWORD_MODAL_TITLE_IMPORT;
  }, [isExportMode]);

  const buttonText = useMemo(() => {
    return isExportMode
      ? PASSWORD_MODAL_BUTTON_EXPORT
      : PASSWORD_MODAL_BUTTON_IMPORT;
  }, [isExportMode]);

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newPassword = event.target.value;
      setPassword(newPassword);
      setPasswordError(undefined);
      setConfirmError(undefined);
    },
    [],
  );

  const handleConfirmPasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newConfirmPassword = event.target.value;
      setConfirmPassword(newConfirmPassword);
      setConfirmError(undefined);
    },
    [],
  );

  const handlePasswordVisibilityChange = useCallback((isVisible: boolean) => {
    setIsPasswordVisible(isVisible);
  }, []);

  const validatePasswords = useCallback((): boolean => {
    if (!isExportMode) {
      return true;
    }

    const result = exportPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setPasswordError(fieldErrors.password?.[0]);
      setConfirmError(fieldErrors.confirmPassword?.[0]);

      return false;
    }

    return true;
  }, [isExportMode, password, confirmPassword]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPasswordError(undefined);
      setConfirmError(undefined);

      const isValid = validatePasswords();

      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      const setPasswordErrorHandler = (error: string) => {
        setPasswordError(error);
        setIsSubmitting(false);
      };

      try {
        await onConfirm(password, closeModal, setPasswordErrorHandler);
      } catch {
        setIsSubmitting(false);
      }
    },
    [validatePasswords, password, onConfirm, closeModal],
  );

  return {
    password,
    confirmPassword,
    passwordError,
    confirmError,
    isSubmitting,
    isExportMode,
    isPasswordVisible,
    title,
    buttonText,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handlePasswordVisibilityChange,
    handleSubmit,
    handleCancel,
  };
};
