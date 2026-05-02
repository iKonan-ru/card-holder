import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LOCK_SCREEN_BUTTON_CREATE,
  LOCK_SCREEN_BUTTON_UNLOCK,
  LOCK_SCREEN_ERROR_WRONG_PASSWORD,
  LOCK_SCREEN_LABEL_CONFIRM,
  LOCK_SCREEN_LABEL_PASSWORD,
  LOCK_SCREEN_TITLE_CREATE,
  LOCK_SCREEN_TITLE_UNLOCK,
} from '../../constants';
import { useCryptoStore } from '../../store';
import { LockScreen } from './lock-screen';

vi.mock('../../store', () => ({
  useCryptoStore: vi.fn(),
}));

const mockUnlock = vi.fn();

const renderUnlock = () => {
  vi.mocked(useCryptoStore).mockReturnValue({
    isFirstSetup: false,
    unlock: mockUnlock,
  } as ReturnType<typeof useCryptoStore>);
  render(<LockScreen />);
};

const renderSetup = () => {
  vi.mocked(useCryptoStore).mockReturnValue({
    isFirstSetup: true,
    unlock: mockUnlock,
  } as ReturnType<typeof useCryptoStore>);
  render(<LockScreen />);
};

beforeEach(() => {
  mockUnlock.mockReset();
});

describe('LockScreen — режим разблокировки', () => {
  it('должен отображать заголовок разблокировки', () => {
    renderUnlock();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      LOCK_SCREEN_TITLE_UNLOCK,
    );
  });

  it('должен показывать только поле пароля (без поля подтверждения)', () => {
    renderUnlock();

    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
    ).not.toBeInTheDocument();
  });

  it('должен отображать кнопку «Войти»', () => {
    renderUnlock();

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    ).toBeInTheDocument();
  });

  it('кнопка должна быть недоступна при пустом пароле', () => {
    renderUnlock();

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    ).toBeDisabled();
  });

  it('кнопка становится доступной после ввода пароля достаточной длины', async () => {
    const user = userEvent.setup();
    renderUnlock();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    ).not.toBeDisabled();
  });

  it('должен вызвать unlock с введённым паролем', async () => {
    const user = userEvent.setup();
    mockUnlock.mockResolvedValue(undefined);
    renderUnlock();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    );

    await waitFor(() => {
      expect(mockUnlock).toHaveBeenCalledWith('12345678');
    });
  });

  it('должен показать ошибку при неверном пароле', async () => {
    const user = userEvent.setup();
    mockUnlock.mockRejectedValue(new Error(LOCK_SCREEN_ERROR_WRONG_PASSWORD));
    renderUnlock();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(LOCK_SCREEN_ERROR_WRONG_PASSWORD),
      ).toBeInTheDocument();
    });
  });

  it('должен снова активировать кнопку после ошибки', async () => {
    const user = userEvent.setup();
    mockUnlock.mockRejectedValue(new Error(LOCK_SCREEN_ERROR_WRONG_PASSWORD));
    renderUnlock();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_UNLOCK }),
      ).not.toBeDisabled();
    });
  });

  it('должен принимать dialog role с правильным aria-label', () => {
    renderUnlock();

    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      LOCK_SCREEN_TITLE_UNLOCK,
    );
  });
});

describe('LockScreen — режим первой установки', () => {
  it('должен отображать заголовок создания пароля', () => {
    renderSetup();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      LOCK_SCREEN_TITLE_CREATE,
    );
  });

  it('должен показывать оба поля: пароль и подтверждение', () => {
    renderSetup();

    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
    ).toBeInTheDocument();
  });

  it('должен отображать кнопку «Создать пароль»', () => {
    renderSetup();

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_CREATE }),
    ).toBeInTheDocument();
  });

  it('кнопка недоступна когда пароли не совпадают', async () => {
    const user = userEvent.setup();
    renderSetup();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );
    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
      '87654321',
    );

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_CREATE }),
    ).toBeDisabled();
  });

  it('кнопка активна когда пароли совпадают и достаточно длинные', async () => {
    const user = userEvent.setup();
    renderSetup();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );
    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
      '12345678',
    );

    expect(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_CREATE }),
    ).not.toBeDisabled();
  });

  it('должен вызвать unlock с паролем при совпадающих полях', async () => {
    const user = userEvent.setup();
    mockUnlock.mockResolvedValue(undefined);
    renderSetup();

    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_PASSWORD),
      '12345678',
    );
    await user.type(
      screen.getByPlaceholderText(LOCK_SCREEN_LABEL_CONFIRM),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', { name: LOCK_SCREEN_BUTTON_CREATE }),
    );

    await waitFor(() => {
      expect(mockUnlock).toHaveBeenCalledWith('12345678');
    });
  });

  it('должен принимать dialog role с aria-label установки', () => {
    renderSetup();

    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      LOCK_SCREEN_TITLE_CREATE,
    );
  });
});
