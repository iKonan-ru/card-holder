import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { UpdateModal } from './update-modal';
import {
  UPDATE_MODAL_TITLE,
  UPDATE_MODAL_MESSAGE,
  UPDATE_BUTTON_TEXT,
  DISMISS_BUTTON_TEXT,
} from './lib';

vi.mock('../', async () => {
  const actual = await vi.importActual('../');

  return {
    ...actual,
    useAnimatedModalClose: (callback: () => void | Promise<void>) => callback,
  };
});

describe('UpdateModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать заголовок', () => {
    render(<UpdateModal onUpdate={vi.fn()} />);

    expect(screen.getByText(UPDATE_MODAL_TITLE)).toBeInTheDocument();
  });

  it('должен отображать сообщение', () => {
    render(<UpdateModal onUpdate={vi.fn()} />);

    expect(screen.getByText(UPDATE_MODAL_MESSAGE)).toBeInTheDocument();
  });

  it('должен отображать кнопку обновления', () => {
    render(<UpdateModal onUpdate={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: UPDATE_BUTTON_TEXT })
    ).toBeInTheDocument();
  });

  it('должен отображать кнопку отмены если onDismiss передан', () => {
    render(
      <UpdateModal
        onUpdate={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: DISMISS_BUTTON_TEXT })
    ).toBeInTheDocument();
  });

  it('не должен отображать кнопку отмены если onDismiss не передан', () => {
    render(<UpdateModal onUpdate={vi.fn()} />);

    expect(
      screen.queryByRole('button', { name: DISMISS_BUTTON_TEXT })
    ).not.toBeInTheDocument();
  });

  it('должен вызывать onUpdate при клике на кнопку обновления', async () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<UpdateModal onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });
    await user.click(updateButton);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    });
  });

  it('должен вызывать onDismiss при клике на кнопку отмены', async () => {
    const handleDismiss = vi.fn();
    const user = userEvent.setup();

    render(
      <UpdateModal
        onUpdate={vi.fn()}
        onDismiss={handleDismiss}
      />
    );

    const dismissButton = screen.getByRole('button', {
      name: DISMISS_BUTTON_TEXT,
    });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('должен устанавливать isLoading в true во время обновления', async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const handleUpdate = vi.fn().mockReturnValue(promise);
    const user = userEvent.setup();

    render(<UpdateModal onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });
    await user.click(updateButton);

    await waitFor(() => {
      expect(updateButton).toBeDisabled();
      expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
    });

    await act(async () => {
      resolvePromise!();
      await promise;
    });
  });

  it('должен сбрасывать isLoading после обновления', async () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<UpdateModal onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });
    await user.click(updateButton);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(updateButton).not.toBeDisabled();
      expect(screen.queryByLabelText('Загрузка')).not.toBeInTheDocument();
    });
  });

  it('должен сбрасывать isLoading при ошибке обновления', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const testError = new Error('Test error');
    let rejectPromise: (error: Error) => void;

    const promise = new Promise<void>((_, reject) => {
      rejectPromise = reject;
    });

    const handledPromise = promise.catch(() => {});
    const handleUpdate = vi.fn().mockReturnValue(handledPromise);
    const user = userEvent.setup();

    render(<UpdateModal onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });

    await user.click(updateButton);

    await waitFor(() => {
      expect(updateButton).toBeDisabled();
      expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
    });

    await act(async () => {
      rejectPromise!(testError);
      await Promise.resolve();
    });

    await waitFor(
      () => {
        expect(handleUpdate).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(updateButton).not.toBeDisabled();
        expect(screen.queryByLabelText('Загрузка')).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    consoleErrorSpy.mockRestore();
  });

  it('должен устанавливать правильные id для заголовка и сообщения', () => {
    render(<UpdateModal onUpdate={vi.fn()} />);

    const title = screen.getByText(UPDATE_MODAL_TITLE);
    const message = screen.getByText(UPDATE_MODAL_MESSAGE);

    expect(title).toHaveAttribute('id', 'update-modal-title');
    expect(message).toHaveAttribute('id', 'update-modal-message');
  });

  it('должен устанавливать правильные aria-label для кнопок', () => {
    render(
      <UpdateModal
        onUpdate={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    const updateButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });
    const dismissButton = screen.getByRole('button', {
      name: DISMISS_BUTTON_TEXT,
    });

    expect(updateButton).toHaveAttribute('aria-label', UPDATE_BUTTON_TEXT);
    expect(dismissButton).toHaveAttribute('aria-label', DISMISS_BUTTON_TEXT);
  });
});
