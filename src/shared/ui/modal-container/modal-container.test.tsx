import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { ModalProvider, useModal } from '../../lib';
import { ModalContainer } from './modal-container';

const MODAL_CONTENT = 'Test Modal Content';
const SECOND_MODAL_CONTENT = 'Second Modal Content';

const triggerModalAnimationEnd = () => {
  const closingModals = document.querySelectorAll('.modal_closing');
  closingModals.forEach((modal) => {
    const animationEndEvent = new Event('animationend', {
      bubbles: true,
      cancelable: false,
    });
    Object.defineProperty(animationEndEvent, 'animationName', {
      value: 'fadeOutModal',
      writable: false,
    });
    modal.dispatchEvent(animationEndEvent);
  });
};

const TestComponent = () => {
  const firstModal = useModal();
  const secondModal = useModal();

  const handleOpenFirstModal = () => {
    firstModal.open(<div>{MODAL_CONTENT}</div>);
  };

  const handleOpenSecondModal = () => {
    secondModal.open(<div>{SECOND_MODAL_CONTENT}</div>);
  };

  const handleCloseFirstModal = () => {
    firstModal.close();
  };

  const handlePreventClose = () => {
    firstModal.updatePreventClose(true);
  };

  const handleAllowClose = () => {
    firstModal.updatePreventClose(false);
  };

  return (
    <div>
      <button onClick={handleOpenFirstModal}>Open First Modal</button>
      <button onClick={handleOpenSecondModal}>Open Second Modal</button>
      <button onClick={handleCloseFirstModal}>Close First Modal</button>
      <button onClick={handlePreventClose}>Prevent Close</button>
      <button onClick={handleAllowClose}>Allow Close</button>
    </div>
  );
};

describe('ModalContainer', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('должен рендерить модальное окно', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });
  });

  it('должен добавлять запись в историю при открытии модального окна', async () => {
    const user = userEvent.setup();
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(pushStateSpy).toHaveBeenCalled();
    });
  });

  it('должен закрывать модальное окно при нажатии ESC', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      const closingModals = document.querySelectorAll('.modal_closing');
      expect(closingModals.length).toBeGreaterThan(0);
    });

    act(() => {
      triggerModalAnimationEnd();
    });

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT)).not.toBeInTheDocument();
    });
  });

  it('должен закрывать только верхнее модальное окно при нажатии ESC', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));
    await user.click(screen.getByText('Open Second Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
      expect(screen.getByText(SECOND_MODAL_CONTENT)).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      const closingModals = document.querySelectorAll('.modal_closing');
      expect(closingModals.length).toBeGreaterThan(0);
    });

    act(() => {
      triggerModalAnimationEnd();
    });

    await waitFor(() => {
      expect(screen.queryByText(SECOND_MODAL_CONTENT)).not.toBeInTheDocument();
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });
  });

  it('должен закрывать модальное окно при клике на overlay верхнего модального окна', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });

    const overlays = document.querySelectorAll('.modal');
    const topOverlay = overlays[overlays.length - 1];

    await user.click(topOverlay);

    await waitFor(() => {
      const closingModals = document.querySelectorAll('.modal_closing');
      expect(closingModals.length).toBeGreaterThan(0);
    });

    act(() => {
      triggerModalAnimationEnd();
    });

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT)).not.toBeInTheDocument();
    });
  });

  it('должен закрывать модальное окно программно через close', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Close First Modal'));

    await waitFor(() => {
      const closingModals = document.querySelectorAll('.modal_closing');

      if (closingModals.length > 0) {
        return true;
      }

      const allModals = document.querySelectorAll('.modal');

      if (allModals.length === 0) {
        return true;
      }

      throw new Error('Waiting for modal to start closing or close');
    });

    act(() => {
      triggerModalAnimationEnd();
    });

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT)).not.toBeInTheDocument();
    });
  });

  it('должен закрывать модальное окно при навигации назад', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });

    act(() => {
      window.history.back();
    });

    await waitFor(() => {
      const closingModals = document.querySelectorAll('.modal_closing');
      expect(closingModals.length).toBeGreaterThan(0);
    });

    act(() => {
      triggerModalAnimationEnd();
    });

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT)).not.toBeInTheDocument();
    });
  });

  it('не должен рендерить ничего когда нет модальных окон', () => {
    const { container } = render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    const portal = container.querySelector('#modal-root');
    expect(portal?.children.length || 0).toBe(0);
  });

  it('не должен закрывать модальное окно по ESC когда preventClose=true', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Prevent Close'));

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });
  });

  it('должен закрывать модальное окно по ESC когда preventClose=false', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    act(() => {
      triggerModalAnimationEnd();
    });

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT)).not.toBeInTheDocument();
    });
  });

  it('должен корректно обрабатывать несколько модальных окон', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
        <ModalContainer />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open First Modal'));
    await user.click(screen.getByText('Open Second Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT)).toBeInTheDocument();
      expect(screen.getByText(SECOND_MODAL_CONTENT)).toBeInTheDocument();
    });

    const modals = document.querySelectorAll('.modal');
    expect(modals.length).toBe(2);
  });
});
