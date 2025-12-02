import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorContent } from './error-content';

describe('ErrorContent', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать сообщение ошибки', () => {
    const onClose = vi.fn();
    const message = 'Не удалось загрузить карты';

    render(
      <ErrorContent
        message={message}
        onClose={onClose}
      />
    );

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('должен отображать кнопку закрытия', () => {
    const onClose = vi.fn();

    render(
      <ErrorContent
        message="Тестовая ошибка"
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Закрыть' });

    expect(closeButton).toBeInTheDocument();
  });

  it('должен вызывать onClose при клике на кнопку', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ErrorContent
        message="Тестовая ошибка"
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Закрыть' });

    await user.click(closeButton);

    await vi.waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('должен отображать длинное сообщение ошибки', () => {
    const onClose = vi.fn();
    const longMessage =
      'Это очень длинное сообщение об ошибке, которое должно корректно отображаться в модальном окне';

    render(
      <ErrorContent
        message={longMessage}
        onClose={onClose}
      />
    );

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('должен применять правильные CSS классы', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ErrorContent
        message="Тестовая ошибка"
        onClose={onClose}
      />
    );

    const errorContent = container.querySelector('.error-content');

    expect(errorContent).toBeInTheDocument();
  });
});
