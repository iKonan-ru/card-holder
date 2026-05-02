import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as sharedLib from '@shared/lib';
import {
  MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL,
  MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
  MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD,
  MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD,
} from '../../constants';
import { MasterPasswordConfirmModal } from './master-password-confirm-modal';

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    verifyMasterPassword: vi.fn(),
    useModalClose: vi.fn(),
    withRateLimit: vi.fn(async (op: () => Promise<unknown>) => op()),
  };
});

const mockCloseModal = vi.fn();
const mockOnConfirm = vi.fn();

const renderModal = (message = 'Подтвердите действие') => {
  render(
    <MasterPasswordConfirmModal
      message={message}
      onConfirm={mockOnConfirm}
    />,
  );
};

beforeEach(() => {
  mockCloseModal.mockReset();
  mockOnConfirm.mockReset();
  vi.mocked(sharedLib.useModalClose).mockReturnValue(mockCloseModal);
});

describe('MasterPasswordConfirmModal - отображение', () => {
  it('должен показывать переданный message', () => {
    renderModal('Очистить все данные?');

    expect(screen.getByText('Очистить все данные?')).toBeInTheDocument();
  });

  it('должен показывать поле ввода пароля', () => {
    renderModal();

    expect(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
    ).toBeInTheDocument();
  });

  it('должен показывать кнопку подтверждения', () => {
    renderModal();

    expect(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    ).toBeInTheDocument();
  });

  it('должен показывать кнопку отмены', () => {
    renderModal();

    expect(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL,
      }),
    ).toBeInTheDocument();
  });

  it('кнопка подтверждения недоступна при пустом пароле', () => {
    renderModal();

    expect(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    ).toBeDisabled();
  });
});

describe('MasterPasswordConfirmModal - успешное подтверждение', () => {
  it('должен вызвать onConfirm при верном пароле', async () => {
    const user = userEvent.setup();
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);
    mockOnConfirm.mockResolvedValue(undefined);
    renderModal();

    await user.type(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('должен закрыть модалку после успешного подтверждения', async () => {
    const user = userEvent.setup();
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(true);
    mockOnConfirm.mockResolvedValue(undefined);
    renderModal();

    await user.type(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
  });
});

describe('MasterPasswordConfirmModal - неверный пароль', () => {
  it('должен показать ошибку при неверном пароле', async () => {
    const user = userEvent.setup();
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);
    renderModal();

    await user.type(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD),
      ).toBeInTheDocument();
    });
  });

  it('не должен вызывать onConfirm при неверном пароле', async () => {
    const user = userEvent.setup();
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);
    renderModal();

    await user.type(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    await waitFor(() => {
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  it('не должен закрывать модалку при неверном пароле', async () => {
    const user = userEvent.setup();
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);
    renderModal();

    await user.type(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
      '12345678',
    );
    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    await waitFor(() => {
      expect(mockCloseModal).not.toHaveBeenCalled();
    });
  });

  it('должен очистить ошибку при изменении пароля', async () => {
    const user = userEvent.setup();
    vi.mocked(sharedLib.verifyMasterPassword).mockResolvedValue(false);
    renderModal();

    const input = screen.getByPlaceholderText(
      MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD,
    );
    await user.type(input, '12345678');
    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD),
      ).toBeInTheDocument();
    });

    await user.type(input, 'x');

    expect(
      screen.queryByText(MASTER_PASSWORD_CONFIRM_MODAL_ERROR_WRONG_PASSWORD),
    ).not.toBeInTheDocument();
  });
});

describe('MasterPasswordConfirmModal - кнопка отмены', () => {
  it('должен вызвать closeModal при клике на отмену', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL,
      }),
    );

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
