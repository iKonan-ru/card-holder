import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LOCK_SCREEN_BUTTON_CREATE,
  LOCK_SCREEN_BUTTON_UNLOCK,
  LOCK_SCREEN_LABEL_CONFIRM,
  LOCK_SCREEN_LABEL_PASSWORD,
  LOCK_SCREEN_SUBTITLE_CREATE,
  LOCK_SCREEN_TITLE_CREATE,
  LOCK_SCREEN_TITLE_UNLOCK,
} from '../../constants';
import { useLockScreenForm } from '../../hooks';
import { LockScreen } from './lock-screen';

vi.mock('../../hooks', () => ({
  useLockScreenForm: vi.fn(),
}));

const mockHandlePasswordChange = vi.fn();
const mockHandleConfirmChange = vi.fn();
const mockHandleVisibilityChange = vi.fn();
const mockHandleSubmit = vi.fn();

const createHookValue = (overrides = {}) => ({
  password: '',
  confirmPassword: '',
  passwordError: undefined,
  confirmError: undefined,
  isSubmitting: false,
  isPasswordVisible: false,
  isSubmitEnabled: false,
  isFirstSetup: false,
  handlePasswordChange: mockHandlePasswordChange,
  handleConfirmChange: mockHandleConfirmChange,
  handleVisibilityChange: mockHandleVisibilityChange,
  handleSubmit: mockHandleSubmit,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useLockScreenForm).mockReturnValue(createHookValue());
});

describe('LockScreen - режим разблокировки', () => {
  it('должен отображать заголовок разблокировки', () => {
    render(<LockScreen />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      LOCK_SCREEN_TITLE_UNLOCK,
    );
  });

  it('должен показывать только поле пароля (без поля подтверждения)', () => {
    render(<LockScreen />);

    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
    ).not.toBeInTheDocument();
  });

  it('не должен показывать подзаголовок', () => {
    render(<LockScreen />);

    expect(
      screen.queryByText(LOCK_SCREEN_SUBTITLE_CREATE),
    ).not.toBeInTheDocument();
  });

  it('должен отображать кнопку «Войти»', () => {
    render(<LockScreen />);

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    ).toBeInTheDocument();
  });

  it('кнопка недоступна когда isSubmitEnabled = false', () => {
    render(<LockScreen />);

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    ).toBeDisabled();
  });

  it('кнопка доступна когда isSubmitEnabled = true', () => {
    vi.mocked(useLockScreenForm).mockReturnValue(
      createHookValue({ isSubmitEnabled: true }),
    );

    render(<LockScreen />);

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    ).not.toBeDisabled();
  });

  it('поле пароля и кнопка недоступны при isSubmitting = true', () => {
    vi.mocked(useLockScreenForm).mockReturnValue(
      createHookValue({ isSubmitting: true }),
    );

    const { container } = render(<LockScreen />);

    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
    ).toBeDisabled();
    expect(container.querySelector('[type="submit"]')).toBeDisabled();
  });

  it('должен отображать passwordError', () => {
    vi.mocked(useLockScreenForm).mockReturnValue(
      createHookValue({ passwordError: 'Неверный пароль' }),
    );

    render(<LockScreen />);

    expect(screen.getByText('Неверный пароль')).toBeInTheDocument();
  });

  it('должен передавать handlePasswordChange в поле пароля', async () => {
    const user = userEvent.setup();

    render(<LockScreen />);

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      'a',
    );

    expect(mockHandlePasswordChange).toHaveBeenCalled();
  });

  it('должен передавать handleSubmit в форму', async () => {
    const user = userEvent.setup();

    vi.mocked(useLockScreenForm).mockReturnValue(
      createHookValue({ isSubmitEnabled: true }),
    );

    render(<LockScreen />);

    await user.click(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    );

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('должен принимать dialog role с правильным aria-label', () => {
    render(<LockScreen />);

    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      LOCK_SCREEN_TITLE_UNLOCK,
    );
  });
});

describe('LockScreen - режим первой установки', () => {
  beforeEach(() => {
    vi.mocked(useLockScreenForm).mockReturnValue(
      createHookValue({ isFirstSetup: true }),
    );
  });

  it('должен отображать заголовок создания пароля', () => {
    render(<LockScreen />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      LOCK_SCREEN_TITLE_CREATE,
    );
  });

  it('должен показывать подзаголовок', () => {
    render(<LockScreen />);

    expect(
      screen.getByText(LOCK_SCREEN_SUBTITLE_CREATE.split('\n')[0], {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('должен показывать оба поля: пароль и подтверждение', () => {
    render(<LockScreen />);

    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
    ).toBeInTheDocument();
  });

  it('должен отображать кнопку «Создать пароль»', () => {
    render(<LockScreen />);

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_CREATE }),
    ).toBeInTheDocument();
  });

  it('должен передавать handleConfirmChange в поле подтверждения', async () => {
    const user = userEvent.setup();

    render(<LockScreen />);

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
      'a',
    );

    expect(mockHandleConfirmChange).toHaveBeenCalled();
  });

  it('должен отображать confirmError в поле подтверждения', () => {
    vi.mocked(useLockScreenForm).mockReturnValue(
      createHookValue({
        isFirstSetup: true,
        confirmError: 'Пароли не совпадают',
      }),
    );

    render(<LockScreen />);

    expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();
  });

  it('должен принимать dialog role с aria-label установки', () => {
    render(<LockScreen />);

    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      LOCK_SCREEN_TITLE_CREATE,
    );
  });
});
