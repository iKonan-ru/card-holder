import { useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { bem, useClassName, ParentClassProvider } from '@shared/lib';
import {
  ERROR_PASSWORD_TOO_SHORT,
  ERROR_PASSWORD_MISMATCH,
} from '../../model/constants';
import { FormField } from '@shared/ui';
import type { IPasswordModalProps } from '../../model';
import { MIN_PASSWORD_LENGTH } from '../../model/constants';
import {
  PASSWORD_MODAL_BLOCK,
  PASSWORD_MODAL_TITLE_ID,
  PASSWORD_MODAL_TITLE_EXPORT,
  PASSWORD_MODAL_TITLE_IMPORT,
  PASSWORD_MODAL_LABEL,
  PASSWORD_MODAL_LABEL_CONFIRM,
  PASSWORD_MODAL_BUTTON_EXPORT,
  PASSWORD_MODAL_BUTTON_IMPORT,
  PASSWORD_MODAL_BUTTON_CANCEL,
} from './lib/constants';
import './password-modal.less';

export const PasswordModal: FC<IPasswordModalProps> = ({
  mode,
  onConfirm,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const isExportMode = mode === 'export';
  const title = isExportMode
    ? PASSWORD_MODAL_TITLE_EXPORT
    : PASSWORD_MODAL_TITLE_IMPORT;
  const buttonText = isExportMode
    ? PASSWORD_MODAL_BUTTON_EXPORT
    : PASSWORD_MODAL_BUTTON_IMPORT;

  const className = useClassName({
    blockName: PASSWORD_MODAL_BLOCK,
  });

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordError(undefined);
    setConfirmError(undefined);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmError(undefined);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(undefined);
    setConfirmError(undefined);

    if (isExportMode) {
      const isPasswordValid = password.length >= MIN_PASSWORD_LENGTH;

      if (!isPasswordValid) {
        setPasswordError(ERROR_PASSWORD_TOO_SHORT);

        return;
      }

      const doPasswordsMatch = password === confirmPassword;

      if (!doPasswordsMatch) {
        setConfirmError(ERROR_PASSWORD_MISMATCH);

        return;
      }
    }

    onConfirm(password);
  };

  const PasswordIcon = showPassword ? MdVisibilityOff : MdVisibility;
  const ariaLabelPassword = showPassword ? 'Скрыть пароль' : 'Показать пароль';
  const inputType = showPassword ? 'text' : 'password';

  const passwordRightContent = (
    <button
      type="button"
      onClick={handleTogglePasswordVisibility}
      className={bem(PASSWORD_MODAL_BLOCK, 'toggle-button')}
      aria-label={ariaLabelPassword}
      tabIndex={-1}
    >
      <PasswordIcon className={bem(PASSWORD_MODAL_BLOCK, 'toggle-icon')} />
    </button>
  );

  const confirmPasswordRightContent = (
    <button
      type="button"
      onClick={handleTogglePasswordVisibility}
      className={bem(PASSWORD_MODAL_BLOCK, 'toggle-button')}
      aria-label={ariaLabelPassword}
      tabIndex={-1}
    >
      <PasswordIcon className={bem(PASSWORD_MODAL_BLOCK, 'toggle-icon')} />
    </button>
  );

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
        <FormField
          id="password"
          name="password"
          type={inputType}
          label={PASSWORD_MODAL_LABEL}
          value={password}
          error={passwordError}
          onChange={handlePasswordChange}
          autoComplete="new-password"
          autoFocus={true}
          required={true}
          rightContent={passwordRightContent}
        />

        {isExportMode && (
          <FormField
            id="confirm-password"
            name="confirm-password"
            type={inputType}
            label={PASSWORD_MODAL_LABEL_CONFIRM}
            value={confirmPassword}
            error={confirmError}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            required={true}
            rightContent={confirmPasswordRightContent}
          />
        )}
      </ParentClassProvider>

      <div className={bem(PASSWORD_MODAL_BLOCK, 'actions')}>
        <button
          type="submit"
          aria-label={`${buttonText}: ${title}`}
          className={bem(bem(PASSWORD_MODAL_BLOCK, 'button'), ['primary'])}
        >
          {buttonText}
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label={PASSWORD_MODAL_BUTTON_CANCEL}
          className={bem(bem(PASSWORD_MODAL_BLOCK, 'button'), ['secondary'])}
        >
          {PASSWORD_MODAL_BUTTON_CANCEL}
        </button>
      </div>
    </form>
  );
};
