import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PasswordModal } from './password-modal';
import {
  PASSWORD_MODAL_BUTTON_EXPORT,
  PASSWORD_MODAL_BUTTON_IMPORT,
  PASSWORD_MODAL_BUTTON_CANCEL,
  PASSWORD_MODAL_LABEL,
  PASSWORD_MODAL_LABEL_CONFIRM,
} from '../../lib/constants';
import {
  ERROR_PASSWORD_TOO_SHORT,
  ERROR_PASSWORD_MISMATCH,
} from '../../model/constants';

const getPasswordInput = () =>
  screen.getByPlaceholderText(PASSWORD_MODAL_LABEL);
const getConfirmInput = () =>
  screen.getByPlaceholderText(PASSWORD_MODAL_LABEL_CONFIRM);

describe('PasswordModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Режим экспорта', () => {
    it('должен отображать заголовок экспорта', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/экспорт карт/i)).toBeInTheDocument();
    });

    it('должен отображать два поля пароля', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
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
        />
      );

      expect(
        screen.getByRole('button', {
          name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
        })
      ).toBeInTheDocument();
    });

    it('должен показывать ошибку при коротком пароле', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '1234567');
      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_TOO_SHORT)).toBeInTheDocument();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('должен показывать ошибку при несовпадении паролей', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '87654321');
      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_MISMATCH)).toBeInTheDocument();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('должен вызывать onConfirm с паролем при валидных данных', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '12345678');
      await user.click(submitButton);

      expect(mockOnConfirm).toHaveBeenCalledWith('12345678');
    });

    it('должен показывать/скрывать пароль при клике на иконку', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const toggleButtons = screen.getAllByLabelText(
        /показать пароль|скрыть пароль/i
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
        />
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const toggleButtons = screen.getAllByLabelText(
        /показать пароль|скрыть пароль/i
      );

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmInput).toHaveAttribute('type', 'password');

      await user.click(toggleButtons[0]);

      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmInput).toHaveAttribute('type', 'text');
    });

    it('должен очищать ошибки при вводе в поле пароля', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '1234567');
      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_TOO_SHORT)).toBeInTheDocument();

      await user.type(passwordInput, '8');

      expect(
        screen.queryByText(ERROR_PASSWORD_TOO_SHORT)
      ).not.toBeInTheDocument();
    });

    it('должен очищать ошибку несовпадения при вводе в поле подтверждения', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '87654321');
      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_MISMATCH)).toBeInTheDocument();

      await user.clear(confirmInput);
      await user.type(confirmInput, '1');

      expect(
        screen.queryByText(ERROR_PASSWORD_MISMATCH)
      ).not.toBeInTheDocument();
    });
  });

  describe('Режим импорта', () => {
    it('должен отображать заголовок импорта', () => {
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/импорт карт/i)).toBeInTheDocument();
    });

    it('должен отображать только одно поле пароля', () => {
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(getPasswordInput()).toBeInTheDocument();
      expect(
        screen.queryByLabelText(PASSWORD_MODAL_LABEL_CONFIRM)
      ).not.toBeInTheDocument();
    });

    it('должен отображать кнопку импорта', () => {
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByRole('button', {
          name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
        })
      ).toBeInTheDocument();
    });

    it('должен показывать ошибку при пустом пароле', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
      });

      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_TOO_SHORT)).toBeInTheDocument();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('должен показывать ошибку при коротком пароле', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
      });

      await user.type(passwordInput, '1234567');
      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_TOO_SHORT)).toBeInTheDocument();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('должен вызывать onConfirm с паролем при валидном пароле', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="import"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_IMPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.click(submitButton);

      expect(mockOnConfirm).toHaveBeenCalledWith('12345678');
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
        />
      );

      const cancelButton = screen.getByRole('button', {
        name: PASSWORD_MODAL_BUTTON_CANCEL,
      });

      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('должен отображать кнопку отмены', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByRole('button', { name: PASSWORD_MODAL_BUTTON_CANCEL })
      ).toBeInTheDocument();
    });

    it('должен отображать поля с правильным типом', () => {
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
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
        />
      );

      const passwordInput = getPasswordInput();

      await user.type(passwordInput, '12345678{Enter}');

      expect(mockOnConfirm).toHaveBeenCalledWith('12345678');
    });

    it('должен очищать обе ошибки при изменении пароля в экспорте', async () => {
      const user = userEvent.setup();
      render(
        <PasswordModal
          mode="export"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const passwordInput = getPasswordInput();
      const confirmInput = getConfirmInput();
      const submitButton = screen.getByRole('button', {
        name: new RegExp(PASSWORD_MODAL_BUTTON_EXPORT, 'i'),
      });

      await user.type(passwordInput, '12345678');
      await user.type(confirmInput, '87654321');
      await user.click(submitButton);

      expect(screen.getByText(ERROR_PASSWORD_MISMATCH)).toBeInTheDocument();

      await user.type(passwordInput, '9');

      expect(
        screen.queryByText(ERROR_PASSWORD_MISMATCH)
      ).not.toBeInTheDocument();
    });
  });
});
