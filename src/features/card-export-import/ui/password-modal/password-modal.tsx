import { type FC, useEffect } from 'react';
import {
  bem,
  useClassName,
  ParentClassProvider,
  useModalContext,
} from '@shared/lib';
import { PasswordField, Button } from '@shared/ui';
import type { IPasswordModalProps } from '../../model';
import {
  PASSWORD_MODAL_BLOCK,
  PASSWORD_MODAL_TITLE_ID,
  PASSWORD_MODAL_LABEL,
  PASSWORD_MODAL_LABEL_CONFIRM,
  PASSWORD_MODAL_BUTTON_CANCEL,
  PASSWORD_MODAL_ID_IMPORT,
  PASSWORD_MODAL_ID_EXPORT,
  usePasswordModal,
} from './lib';
import './password-modal.less';

export const PasswordModal: FC<IPasswordModalProps> = (props) => {
  const { mode, onConfirm, onCancel } = props;

  const modalContext = useModalContext();

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
    modalContext.updateModalPreventClose(passwordModalId, isSubmitting);
  }, [modalContext, passwordModalId, isSubmitting]);

  const className = useClassName({
    blockName: PASSWORD_MODAL_BLOCK,
  });

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
      aria-labelledby={PASSWORD_MODAL_TITLE_ID}
    >
      <h3
        id={PASSWORD_MODAL_TITLE_ID}
        className={bem(PASSWORD_MODAL_BLOCK, 'title')}
      >
        {title}
      </h3>

      <ParentClassProvider parentClass={PASSWORD_MODAL_BLOCK}>
        <PasswordField
          id="password"
          name="password"
          label={PASSWORD_MODAL_LABEL}
          value={password}
          error={passwordError}
          onChange={handlePasswordChange}
          autoComplete="new-password"
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
            required={true}
            isPasswordVisible={isPasswordVisible}
            onPasswordVisibilityChange={handlePasswordVisibilityChange}
          />
        )}
      </ParentClassProvider>

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
    </form>
  );
};
