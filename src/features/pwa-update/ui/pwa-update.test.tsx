import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Procedure } from '@shared/types';
import {
  PWA_UPDATE_BUTTON_TEXT,
  PWA_UPDATE_DISMISS_BUTTON_TEXT,
  PWA_UPDATE_MESSAGE,
} from '../lib';
import { PWAUpdate } from './pwa-update';

vi.mock('@shared/ui', async () => {
  const actual = await vi.importActual('@shared/ui');

  return {
    ...actual,
    useAnimatedModalClose: (callback: Procedure | Promise<void>) => callback,
  };
});

describe('UpdateModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать сообщение', () => {
    render(<PWAUpdate onUpdate={vi.fn()} />);

    expect(screen.getByText(PWA_UPDATE_MESSAGE)).toBeInTheDocument();
  });

  it('должен отображать кнопку обновления', () => {
    render(<PWAUpdate onUpdate={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: PWA_UPDATE_BUTTON_TEXT })
    ).toBeInTheDocument();
  });

  it('должен отображать кнопку отмены если onDismiss передан', () => {
    render(
      <PWAUpdate
        onUpdate={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: PWA_UPDATE_DISMISS_BUTTON_TEXT })
    ).toBeInTheDocument();
  });

  it('не должен отображать кнопку отмены если onDismiss не передан', () => {
    render(<PWAUpdate onUpdate={vi.fn()} />);

    expect(
      screen.queryByRole('button', { name: PWA_UPDATE_DISMISS_BUTTON_TEXT })
    ).not.toBeInTheDocument();
  });

  it('должен вызывать onUpdate при клике на кнопку обновления', async () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<PWAUpdate onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: PWA_UPDATE_BUTTON_TEXT,
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
      <PWAUpdate
        onUpdate={vi.fn()}
        onDismiss={handleDismiss}
      />
    );

    const dismissButton = screen.getByRole('button', {
      name: PWA_UPDATE_DISMISS_BUTTON_TEXT,
    });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('должен устанавливать isLoading в true во время обновления', async () => {
    let resolvePromise: Procedure;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const handleUpdate = vi.fn().mockReturnValue(promise);
    const user = userEvent.setup();

    render(<PWAUpdate onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: PWA_UPDATE_BUTTON_TEXT,
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

    render(<PWAUpdate onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: PWA_UPDATE_BUTTON_TEXT,
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

    render(<PWAUpdate onUpdate={handleUpdate} />);

    const updateButton = screen.getByRole('button', {
      name: PWA_UPDATE_BUTTON_TEXT,
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

  it('должен устанавливать правильные aria-label для кнопок', () => {
    render(
      <PWAUpdate
        onUpdate={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    const updateButton = screen.getByRole('button', {
      name: PWA_UPDATE_BUTTON_TEXT,
    });
    const dismissButton = screen.getByRole('button', {
      name: PWA_UPDATE_DISMISS_BUTTON_TEXT,
    });

    expect(updateButton).toHaveAttribute('aria-label', PWA_UPDATE_BUTTON_TEXT);
    expect(dismissButton).toHaveAttribute(
      'aria-label',
      PWA_UPDATE_DISMISS_BUTTON_TEXT
    );
  });

  it('не должен вызывать onDismiss если он не передан', async () => {
    const user = userEvent.setup();

    render(<PWAUpdate onUpdate={vi.fn()} />);

    const updateButton = screen.getByRole('button', {
      name: PWA_UPDATE_BUTTON_TEXT,
    });
    await user.click(updateButton);

    expect(updateButton).toBeInTheDocument();
  });
});
