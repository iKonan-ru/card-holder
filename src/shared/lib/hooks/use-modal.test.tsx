import type { FC, PropsWithChildren } from 'react';
import {
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ModalContainer } from '@shared/ui';
import { ModalProvider, useModalContext } from '../context';
import { useModal } from './use-modal';

const MODAL_CONTENT_TEXT = 'Modal Content';

const TestWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalContainer />
    </ModalProvider>
  );
};

const TestComponent = () => {
  const { open, close } = useModal();

  const handleOpen = () => {
    open(<div>{MODAL_CONTENT_TEXT}</div>);
  };

  return (
    <div>
      <button onClick={handleOpen}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  );
};

describe('useModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен открывать модальное окно', async () => {
    const user = userEvent.setup();

    render(<TestComponent />, { wrapper: TestWrapper });

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT_TEXT)).toBeInTheDocument();
    });
  });

  it('должен закрывать модальное окно', async () => {
    const user = userEvent.setup();

    render(<TestComponent />, { wrapper: TestWrapper });

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT_TEXT)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT_TEXT)).not.toBeInTheDocument();
    });
  });

  it('при вызове close не должен инициировать history.back()', async () => {
    const historyBackSpy = vi
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    const TestWithClose = () => {
      const { open, close } = useModal();

      return (
        <div>
          <button onClick={() => open(<div>{MODAL_CONTENT_TEXT}</div>)}>
            Open
          </button>
          <button onClick={close}>Close</button>
        </div>
      );
    };

    const user = userEvent.setup();
    render(<TestWithClose />, { wrapper: TestWrapper });

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT_TEXT)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT_TEXT)).not.toBeInTheDocument();
    });

    expect(historyBackSpy).not.toHaveBeenCalled();

    historyBackSpy.mockRestore();
  });

  it('должен обновлять preventClose через updatePreventClose', async () => {
    let capturedModals: Array<{ id: string; preventClose?: boolean }> = [];

    const TestWithPreventClose = () => {
      const { modals } = useModalContext();
      const { open, updatePreventClose, modalId } = useModal();

      capturedModals = modals;

      return (
        <div>
          <button onClick={() => open(<div>{MODAL_CONTENT_TEXT}</div>)}>
            Open
          </button>
          <button onClick={() => updatePreventClose(true)}>Lock</button>
          <button onClick={() => updatePreventClose(false)}>Unlock</button>
          <span data-testid="modal-id">{modalId}</span>
        </div>
      );
    };

    const user = userEvent.setup();
    render(<TestWithPreventClose />, { wrapper: TestWrapper });

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(capturedModals.length).toBe(1);
    });

    expect(capturedModals[0].preventClose).toBeUndefined();

    await user.click(screen.getByText('Lock'));

    await waitFor(() => {
      expect(capturedModals[0].preventClose).toBe(true);
    });

    await user.click(screen.getByText('Unlock'));

    await waitFor(() => {
      expect(capturedModals[0].preventClose).toBe(false);
    });
  });

  it('разные экземпляры useModal должны иметь уникальные modalId', () => {
    const { result: result1 } = renderHook(() => useModal(), {
      wrapper: TestWrapper,
    });
    const { result: result2 } = renderHook(() => useModal(), {
      wrapper: TestWrapper,
    });

    expect(result1.current.modalId).toBeTruthy();
    expect(result2.current.modalId).toBeTruthy();
    expect(result1.current.modalId).not.toBe(result2.current.modalId);
  });

  it('modalId должен оставаться стабильным между ре-рендерами', () => {
    const { result, rerender } = renderHook(() => useModal(), {
      wrapper: TestWrapper,
    });

    const firstId = result.current.modalId;
    rerender();

    expect(result.current.modalId).toBe(firstId);
  });
});
