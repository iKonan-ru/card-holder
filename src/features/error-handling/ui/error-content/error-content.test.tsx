import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorContent } from './error-content';

describe('ErrorContent', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать заголовок ошибки', () => {
    const onClose = vi.fn();

    render(
      <ErrorContent
        message="Тестовая ошибка"
        onClose={onClose}
      />
    );

    expect(screen.getByText('Ошибка')).toBeInTheDocument();
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

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('должен иметь правильные accessibility атрибуты', () => {
    const onClose = vi.fn();

    render(
      <ErrorContent
        message="Тестовая ошибка"
        onClose={onClose}
      />
    );

    const title = screen.getByText('Ошибка');
    const message = screen.getByText('Тестовая ошибка');

    expect(title).toHaveAttribute('id', 'error-modal-title');
    expect(message).toHaveAttribute('id', 'error-modal-message');
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

    const errorModal = container.querySelector('.error-modal');

    expect(errorModal).toBeInTheDocument();
  });
});
