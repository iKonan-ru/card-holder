import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL,
  MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
  MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD,
} from '../../constants';
import { useMasterPasswordConfirmForm } from '../../hooks';
import { MasterPasswordConfirmModal } from './master-password-confirm-modal';

vi.mock('../../hooks', () => ({
  useMasterPasswordConfirmForm: vi.fn(),
}));

const mockCloseModal = vi.fn();
const mockHandleSubmit = vi.fn();
const mockHandlePasswordChange = vi.fn();
const mockSetIsPasswordVisible = vi.fn();
const mockOnConfirm = vi.fn();

const createHookValue = (overrides = {}) => ({
  password: '',
  error: undefined,
  isSubmitting: false,
  isPasswordVisible: false,
  isSubmitEnabled: false,
  closeModal: mockCloseModal,
  handleSubmit: mockHandleSubmit,
  handlePasswordChange: mockHandlePasswordChange,
  setIsPasswordVisible: mockSetIsPasswordVisible,
  ...overrides,
});

const renderModal = (message = 'Подтвердите действие') =>
  render(
    <MasterPasswordConfirmModal
      message={message}
      onConfirm={mockOnConfirm}
    />,
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useMasterPasswordConfirmForm).mockReturnValue(createHookValue());
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

  it('должен отображать error из хука', () => {
    vi.mocked(useMasterPasswordConfirmForm).mockReturnValue(
      createHookValue({ error: 'Неверный пароль' }),
    );

    renderModal();

    expect(screen.getByText('Неверный пароль')).toBeInTheDocument();
  });

  it('должен передавать onConfirm в хук', () => {
    renderModal();

    expect(useMasterPasswordConfirmForm).toHaveBeenCalledWith({
      onConfirm: mockOnConfirm,
    });
  });
});

describe('MasterPasswordConfirmModal - состояния кнопок', () => {
  it('кнопка подтверждения недоступна когда isSubmitEnabled = false', () => {
    renderModal();

    expect(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    ).toBeDisabled();
  });

  it('кнопка подтверждения доступна когда isSubmitEnabled = true', () => {
    vi.mocked(useMasterPasswordConfirmForm).mockReturnValue(
      createHookValue({ isSubmitEnabled: true }),
    );

    renderModal();

    expect(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    ).not.toBeDisabled();
  });

  it('кнопки и поле недоступны при isSubmitting = true', () => {
    vi.mocked(useMasterPasswordConfirmForm).mockReturnValue(
      createHookValue({ isSubmitting: true }),
    );

    const { container } = renderModal();

    expect(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
    ).toBeDisabled();
    expect(container.querySelector('[type="submit"]')).toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CANCEL,
      }),
    ).toBeDisabled();
  });
});

describe('MasterPasswordConfirmModal - обработчики', () => {
  it('должен передавать handlePasswordChange в поле пароля', async () => {
    const user = userEvent.setup();

    renderModal();

    await user.type(
      screen.getByPlaceholderText(MASTER_PASSWORD_CONFIRM_MODAL_LABEL_PASSWORD),
      'a',
    );

    expect(mockHandlePasswordChange).toHaveBeenCalled();
  });

  it('должен передавать handleSubmit в форму', async () => {
    const user = userEvent.setup();

    vi.mocked(useMasterPasswordConfirmForm).mockReturnValue(
      createHookValue({ isSubmitEnabled: true }),
    );

    renderModal();

    await user.click(
      screen.getByRole('button', {
        name: MASTER_PASSWORD_CONFIRM_MODAL_BUTTON_CONFIRM,
      }),
    );

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('должен вызвать closeModal при клике на кнопку отмены', async () => {
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
