import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type SubmitEvent,
} from 'react';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@features/card-export-import';
import { Button, PasswordField } from '@shared/ui';
import {
  LOCK_SCREEN_BLOCK,
  LOCK_SCREEN_BUTTON_CREATE,
  LOCK_SCREEN_BUTTON_UNLOCK,
  LOCK_SCREEN_ERROR_MISMATCH,
  LOCK_SCREEN_ERROR_TOO_LONG,
  LOCK_SCREEN_ERROR_TOO_SHORT,
  LOCK_SCREEN_ERROR_WRONG_PASSWORD,
  LOCK_SCREEN_LABEL_CONFIRM,
  LOCK_SCREEN_LABEL_PASSWORD,
  LOCK_SCREEN_SUBTITLE_CREATE,
  LOCK_SCREEN_TITLE_CREATE,
  LOCK_SCREEN_TITLE_UNLOCK,
} from '../../constants';
import { useCryptoStore } from '../../store';
import './lock-screen.less';

export const LockScreen: FC = () => {
  const { isFirstSetup, unlock } = useCryptoStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const validate = (): boolean => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(LOCK_SCREEN_ERROR_TOO_SHORT);

      return false;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setPasswordError(LOCK_SCREEN_ERROR_TOO_LONG);

      return false;
    }

    if (isFirstSetup && password !== confirmPassword) {
      setConfirmError(LOCK_SCREEN_ERROR_MISMATCH);

      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPasswordError(undefined);
      setConfirmError(undefined);

      if (!validate()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await unlock(password);
      } catch {
        setPasswordError(LOCK_SCREEN_ERROR_WRONG_PASSWORD);
      } finally {
        setIsSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password, confirmPassword, isFirstSetup, unlock],
  );

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
            disabled={isSubmitting}
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
