import { useEffect, type FC } from 'react';
import {
  bem,
  ParentClassProvider,
  useClassName,
  useModalContext,
} from '@shared/lib';
import type { Procedure } from '@shared/types';
import { Button, PasswordField } from '@shared/ui';
import {
  PASSWORD_MODAL_BLOCK,
  PASSWORD_MODAL_BUTTON_CANCEL,
  PASSWORD_MODAL_ID_EXPORT,
  PASSWORD_MODAL_ID_IMPORT,
  PASSWORD_MODAL_LABEL,
  PASSWORD_MODAL_LABEL_CONFIRM,
} from '../../constants';
import { usePasswordModal } from '../../hooks';
import type { TPasswordModalMode } from '../../types';
import './password-modal.less';

interface IPasswordModalProps {
  mode: TPasswordModalMode;
  onConfirm: (
    password: string,
    closeModal: Procedure,
    setError: (error: string) => void
  ) => Promise<void>;
  onCancel?: Procedure;
}

export const PasswordModal: FC<IPasswordModalProps> = (props) => {
  const { mode, onConfirm, onCancel } = props;
  const { updateModalPreventClose } = useModalContext();

  const {
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
  } = usePasswordModal({ mode, onConfirm, onCancel });

  const passwordModalId = isExportMode
    ? PASSWORD_MODAL_ID_EXPORT
    : PASSWORD_MODAL_ID_IMPORT;

  useEffect(() => {
    updateModalPreventClose(passwordModalId, isSubmitting);
  }, [updateModalPreventClose, passwordModalId, isSubmitting]);

  const className = useClassName({
    blockName: PASSWORD_MODAL_BLOCK,
  });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <ParentClassProvider parentClass={PASSWORD_MODAL_BLOCK}>
        <PasswordField
          id="password"
          name="password"
          label={PASSWORD_MODAL_LABEL}
          value={password}
          error={passwordError}
          onChange={handlePasswordChange}
          autoComplete="new-password"
          disabled={isSubmitting}
          autoFocus={true}
          required={true}
          isPasswordVisible={isPasswordVisible}
          onPasswordVisibilityChange={handlePasswordVisibilityChange}
        />

        {isExportMode && (
          <PasswordField
            id="confirm-password"
            name="confirm-password"
            label={PASSWORD_MODAL_LABEL_CONFIRM}
            value={confirmPassword}
            error={confirmError}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            disabled={isSubmitting}
            required={true}
            isPasswordVisible={isPasswordVisible}
            onPasswordVisibilityChange={handlePasswordVisibilityChange}
          />
        )}

        <div className={bem(PASSWORD_MODAL_BLOCK, 'actions')}>
          <Button
            type="submit"
            aria-label={`${buttonText}: ${title}`}
            variant="primary"
            isLoading={isSubmitting}
          >
            {buttonText}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            aria-label={PASSWORD_MODAL_BUTTON_CANCEL}
            variant="secondary"
            disabled={isSubmitting}
          >
            {PASSWORD_MODAL_BUTTON_CANCEL}
          </Button>
        </div>
      </ParentClassProvider>
    </form>
  );
};
