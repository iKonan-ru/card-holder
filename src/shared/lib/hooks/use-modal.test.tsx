import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../modal';
import { ModalContainer } from '@shared/ui';
import { useModal } from './use-modal';
import type { FC, PropsWithChildren } from 'react';

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
});
