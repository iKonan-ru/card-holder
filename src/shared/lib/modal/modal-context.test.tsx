import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from './modal-context';
import { useModalContext } from './';

const { mockUseCardManagementStore } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

const MODAL_CONTENT_TEXT = 'Test Modal Content';

const createMockStore = (overrides = {}) => ({
  cards: [],
  isLoading: false,
  flippedPan: null,
  isReorderMode: false,
  loadCards: vi.fn(),
  addCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
  flipCard: vi.fn(),
  unflipCards: vi.fn(),
  setCards: vi.fn(),
  reorderCards: vi.fn(),
  setReorderMode: vi.fn(),
  toggleReorderMode: vi.fn(),
  ...overrides,
});

const TestComponent = () => {
  const { openModal, closeModal, closeAllModals, modals } = useModalContext();

  const handleOpenModal = () => {
    openModal('test-modal', <div>{MODAL_CONTENT_TEXT}</div>, () => {});
  };

  const handleOpenSecondModal = () => {
    openModal('test-modal-2', <div>Second Modal</div>, () => {});
  };

  const handleCloseModal = () => {
    closeModal('test-modal');
  };

  const handleCloseAllModals = () => {
    closeAllModals();
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <button onClick={handleOpenSecondModal}>Open Second Modal</button>
      <button onClick={handleCloseModal}>Close Modal</button>
      <button onClick={handleCloseAllModals}>Close All Modals</button>
      <div data-testid="modals-count">{modals.length}</div>
      {modals.map((modal) => (
        <div key={modal.id}>{modal.content}</div>
      ))}
    </div>
  );
};

describe('ModalProvider', () => {
  beforeEach(() => {
    const mockStoreValue = createMockStore();

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('должен открыть модальное окно', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    expect(screen.getByTestId('modals-count')).toHaveTextContent('0');

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT_TEXT)).toBeInTheDocument();
    });

    expect(screen.getByTestId('modals-count')).toHaveTextContent('1');
  });

  it('должен закрыть модальное окно', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByText(MODAL_CONTENT_TEXT)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Close Modal'));

    await waitFor(() => {
      expect(screen.queryByText(MODAL_CONTENT_TEXT)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('modals-count')).toHaveTextContent('0');
  });

  it('не должен открывать дубликат модального окна с тем же id', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));
    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByTestId('modals-count')).toHaveTextContent('1');
    });
  });

  it('должен закрывать все модальные окна', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));
    await user.click(screen.getByText('Open Second Modal'));

    await waitFor(() => {
      expect(screen.getByTestId('modals-count')).toHaveTextContent('2');
    });

    await user.click(screen.getByText('Close All Modals'));

    await waitFor(() => {
      expect(screen.getByTestId('modals-count')).toHaveTextContent('0');
    });
  });

  it('должен выбрасывать ошибку при использовании вне провайдера', () => {
    const ErrorComponent = () => {
      useModalContext();

      return <div>Test</div>;
    };

    expect(() => {
      render(<ErrorComponent />);
    }).toThrow('useModalContext must be used within ModalProvider');
  });
});
