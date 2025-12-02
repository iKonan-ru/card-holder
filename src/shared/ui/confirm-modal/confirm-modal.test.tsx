import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать сообщение', () => {
    render(
      <ConfirmModal
        message="Сообщение"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Сообщение')).toBeInTheDocument();
  });

  it('должен отображать кнопки с текстом по умолчанию', () => {
    render(
      <ConfirmModal
        message="Сообщение"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Подтвердить' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('должен отображать кастомный текст кнопок', () => {
    render(
      <ConfirmModal
        message="Сообщение"
        confirmText="Да"
        cancelText="Нет"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Да' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Нет' })).toBeInTheDocument();
  });

  it('должен вызывать onConfirm при клике на кнопку подтверждения', async () => {
    const handleConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmModal
        message="Сообщение"
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    const confirmButton = screen.getByRole('button', {
      name: 'Подтвердить',
    });
    await user.click(confirmButton);

    await vi.waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('должен вызывать onCancel при клике на кнопку отмены', async () => {
    const handleCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmModal
        message="Сообщение"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Отмена' });
    await user.click(cancelButton);

    await vi.waitFor(() => {
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });
  });
});
