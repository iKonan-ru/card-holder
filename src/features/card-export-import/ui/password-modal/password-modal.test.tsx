import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as sharedLib from '@shared/lib';
import {
  PASSWORD_MODAL_BUTTON_CANCEL,
  PASSWORD_MODAL_BUTTON_EXPORT,
  PASSWORD_MODAL_BUTTON_IMPORT,
  PASSWORD_MODAL_LABEL,
  PASSWORD_MODAL_LABEL_CONFIRM,
} from '../../constants';
import { PasswordModal } from './password-modal';

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    useModalContext: vi.fn(),
  };
});

const getPasswordInput = () =>
  screen.getByPlaceholderText(PASSWORD_MODAL_LABEL);
const getConfirmInput = () =>
  screen.getByPlaceholderText(PASSWORD_MODAL_LABEL_CONFIRM);

describe('PasswordModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();
  const mockUpdateModalPreventClose = vi.fn();

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
    mockUpdateModalPreventClose.mockClear();

    vi.mocked(sharedLib.useModalContext).mockReturnValue({
      openModal: vi.fn(),
      closeModal: vi.fn(),
      closeAllModals: vi.fn(),
      updateModalPreventClose: mockUpdateModalPreventClose,
      modals: [],
      userActionRef: { current: false },
    });
  });

  describe('Режим экспорта', () => {
    it('должен отображать два поля пароля', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      expect(getPasswordInput()).toBeInTheDocument();
      expect(getConfirmInput()).toBeInTheDocument();
    });

    it('должен отображать кнопку экспорта', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      expect(
        screen.getByRole('button', {
          name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
        }),
      ).toBeInTheDocument();
    });

    it('кнопка недоступна при пароле короче 8 символов', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      expect(submitButton).toBeDisabled();

      await user.type(passwordInput, '1234567');

      expect(submitButton).toBeDisabled();
    });

    it('кнопка недоступна при несовпадении паролей', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '87654321');

      expect(submitButton).toBeDisabled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('должен вызывать onConfirm с паролем при валидных данных', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '12345678');
      await user.click(submitButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(
        '12345678',
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('должен показывать/скрывать пароль при клике на иконку', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const toggleButtons = screen.getAllByLabelText(
        /показать пароль|скрыть пароль/i,
      );

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(toggleButtons[0]);

      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButtons[0]);

      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('должен синхронизировать видимость пароля в обоих полях', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const toggleButtons = screen.getAllByLabelText(
        /показать пароль|скрыть пароль/i,
      );

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmInput).toHaveAttribute('type', 'password');

      await user.click(toggleButtons[0]);

      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmInput).toHaveAttribute('type', 'text');
    });

    it('кнопка активируется при вводе 8 и более символов в оба поля', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      expect(submitButton).toBeDisabled();

      await user.type(passwordInput, '12345678');
      expect(submitButton).toBeDisabled();

      await user.type(confirmInput, '12345678');
      expect(submitButton).not.toBeDisabled();
    });

    it('кнопка активируется при совпадении паролей', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '87654321');
      expect(submitButton).toBeDisabled();

      await user.clear(confirmInput);
      await user.type(confirmInput, '12345678');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Режим импорта', () => {
    it('должен отображать только одно поле пароля', () => {
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      expect(getPasswordInput()).toBeInTheDocument();
      expect(
        screen.queryByLabelText(PASSWORD_MODAL_LABEL_CONFIRM),
      ).not.toBeInTheDocument();
    });

    it('должен отображать кнопку импорта', () => {
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      expect(
        screen.getByRole('button', {
          name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
        }),
      ).toBeInTheDocument();
    });

    it('кнопка недоступна при пустом пароле', async () => {
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
      });

      expect(submitButton).toBeDisabled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('кнопка доступна при любом непустом пароле', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
      });

      await user.type(passwordInput, '123');
      await user.click(submitButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(
        '123',
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('должен вызывать onConfirm с паролем при валидном пароле', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.click(submitButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(
        '12345678',
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe('Общее поведение', () => {
    it('должен вызывать onCancel при клике на кнопку отмены', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const cancelButton = screen.getByRole('button', {
        name: PASSWORD_MODAL_BUTTON_CANCEL,
      });

      await user.click(cancelButton);

      await vi.waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalled();
      });
    });

    it('должен отображать кнопку отмены', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      expect(
        screen.getByRole('button', { name: PASSWORD_MODAL_BUTTON_CANCEL }),
      ).toBeInTheDocument();
    });

    it('должен отображать поля с правильным типом', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmInput).toHaveAttribute('type', 'password');
    });

    it('должен обрабатывать submit через Enter', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();

      await user.type(passwordInput, '12345678{Enter}');

      expect(mockOnConfirm).toHaveBeenCalledWith(
        '12345678',
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('кнопка активируется когда пароли совпадают после изменения', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '87654321');
      expect(submitButton).toBeDisabled();

      await user.clear(passwordInput);
      await user.type(passwordInput, '87654321');
      expect(submitButton).not.toBeDisabled();
    });
  });
});
