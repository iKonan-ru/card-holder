import { useRef, type FC } from 'react';
import {
  bem,
  MAX_PASSWORD_LENGTH,
  useClassName,
  useFocusTrap,
} from '@shared/lib';
import { Button, PasswordField } from '@shared/ui';
import {
  LOCK_SCREEN_BLOCK,
  LOCK_SCREEN_BUTTON_CREATE,
  LOCK_SCREEN_BUTTON_UNLOCK,
  LOCK_SCREEN_LABEL_CONFIRM,
  LOCK_SCREEN_LABEL_PASSWORD,
  LOCK_SCREEN_SUBTITLE_CREATE,
  LOCK_SCREEN_TITLE_CREATE,
  LOCK_SCREEN_TITLE_UNLOCK,
} from '../../constants';
import { useLockScreenForm } from '../../hooks';
import './lock-screen.less';

export const LockScreen: FC = () => {
  const {
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
  } = useLockScreenForm();

  const className = useClassName({ blockName: LOCK_SCREEN_BLOCK });
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ contentRef, isTopModal: true });

  const screenTitle = isFirstSetup
    ? LOCK_SCREEN_TITLE_CREATE
    : LOCK_SCREEN_TITLE_UNLOCK;
  const passwordAutoComplete = isFirstSetup
    ? 'new-password'
    : 'current-password';
  const submitButtonLabel = isFirstSetup
    ? LOCK_SCREEN_BUTTON_CREATE
    : LOCK_SCREEN_BUTTON_UNLOCK;

  return (
    <div
      className={className}
      role="dialog"
      aria-modal="true"
      aria-label={screenTitle}
    >
      <div
        ref={contentRef}
        className={bem(LOCK_SCREEN_BLOCK, 'content')}
      >
        <h1 className={bem(LOCK_SCREEN_BLOCK, 'title')}>{screenTitle}</h1>

        {isFirstSetup && (
          <p className={bem(LOCK_SCREEN_BLOCK, 'subtitle')}>
            {LOCK_SCREEN_SUBTITLE_CREATE}
          </p>
        )}

        <form
          className={bem(LOCK_SCREEN_BLOCK, 'form')}
          onSubmit={handleSubmit}
        >
          <PasswordField
            id="lock-password"
            name="password"
            label={LOCK_SCREEN_LABEL_PASSWORD}
            value={password}
            error={passwordError}
            onChange={handlePasswordChange}
            autoComplete={passwordAutoComplete}
            autoFocus={true}
            required={true}
            disabled={isSubmitting}
            maxLength={MAX_PASSWORD_LENGTH}
            isPasswordVisible={isPasswordVisible}
            onPasswordVisibilityChange={handleVisibilityChange}
          />

          {isFirstSetup && (
            <PasswordField
              id="lock-confirm-password"
              name="confirmPassword"
              label={LOCK_SCREEN_LABEL_CONFIRM}
              value={confirmPassword}
              error={confirmError}
              onChange={handleConfirmChange}
              autoComplete="new-password"
              required={true}
              disabled={isSubmitting}
              maxLength={MAX_PASSWORD_LENGTH}
              isPasswordVisible={isPasswordVisible}
              onPasswordVisibilityChange={handleVisibilityChange}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth={true}
            isLoading={isSubmitting}
            disabled={isSubmitting || !isSubmitEnabled}
          >
            {submitButtonLabel}
          </Button>
        </form>
      </div>
    </div>
  );
};
