import { useRef, type FC } from 'react';
import { MAX_PASSWORD_LENGTH } from '@features/card-export-import';
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

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={LOCK_SCREEN_BLOCK}
      role="dialog"
      aria-modal="true"
      aria-label={
        isFirstSetup ? LOCK_SCREEN_TITLE_CREATE : LOCK_SCREEN_TITLE_UNLOCK
      }
    >
      <div
        ref={contentRef}
        className={`${LOCK_SCREEN_BLOCK}__content`}
      >
        <h1 className={`${LOCK_SCREEN_BLOCK}__title`}>
          {isFirstSetup ? LOCK_SCREEN_TITLE_CREATE : LOCK_SCREEN_TITLE_UNLOCK}
        </h1>

        {isFirstSetup && (
          <p className={`${LOCK_SCREEN_BLOCK}__subtitle`}>
            {LOCK_SCREEN_SUBTITLE_CREATE}
          </p>
        )}

        <form
          className={`${LOCK_SCREEN_BLOCK}__form`}
          onSubmit={handleSubmit}
        >
          <PasswordField
            id="lock-password"
            name="password"
            label={LOCK_SCREEN_LABEL_PASSWORD}
            value={password}
            error={passwordError}
            onChange={handlePasswordChange}
            autoComplete={isFirstSetup ? 'new-password' : 'current-password'}
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
            {isFirstSetup
              ? LOCK_SCREEN_BUTTON_CREATE
              : LOCK_SCREEN_BUTTON_UNLOCK}
          </Button>
        </form>
      </div>
    </div>
  );
};
