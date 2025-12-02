import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalProvider, useModalContext } from '@shared/lib';

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
  const {
    openModal,
    closeModal,
    closeAllModals,
    updateModalPreventClose,
    modals,
    userActionRef,
  } = useModalContext();

  const handleOpenModal = () => {
    openModal('test-modal', <div>{MODAL_CONTENT_TEXT}</div>);
  };

  const handleOpenSecondModal = () => {
    openModal('test-modal-2', <div>Second Modal</div>);
  };

  const handleOpenModalWithMetadata = () => {
    openModal(
      'test-modal-metadata',
      <div>Modal with metadata</div>,
      'Modal Title'
    );
  };

  const handleCloseModal = () => {
    closeModal('test-modal');
  };

  const handleCloseAllModals = () => {
    closeAllModals();
  };

  const handlePreventClose = () => {
    updateModalPreventClose('test-modal', true);
  };

  const handleAllowClose = () => {
    updateModalPreventClose('test-modal', false);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <button onClick={handleOpenSecondModal}>Open Second Modal</button>
      <button onClick={handleOpenModalWithMetadata}>
        Open Modal With Metadata
      </button>
      <button onClick={handleCloseModal}>Close Modal</button>
      <button onClick={handleCloseAllModals}>Close All Modals</button>
      <button onClick={handlePreventClose}>Prevent Close</button>
      <button onClick={handleAllowClose}>Allow Close</button>
      <div data-testid="modals-count">{modals.length}</div>
      <div data-testid="user-action-ref">{String(userActionRef.current)}</div>
      {modals.map((modal) => (
        <div
          key={modal.id}
          data-testid={`modal-${modal.id}`}
        >
          {modal.content}
          {modal.preventClose && (
            <span data-testid="prevent-close-flag">prevent-close</span>
          )}
          {modal.title && (
            <span data-testid={`modal-title-${modal.id}`}>{modal.title}</span>
          )}
        </div>
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

  it('должен обновлять preventClose для модального окна', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByTestId('modal-test-modal')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('prevent-close-flag')).not.toBeInTheDocument();

    await user.click(screen.getByText('Prevent Close'));

    await waitFor(() => {
      expect(screen.getByTestId('prevent-close-flag')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Allow Close'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('prevent-close-flag')
      ).not.toBeInTheDocument();
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

  it('должен вызывать onModalOpen при открытии модального окна', async () => {
    const onModalOpen = vi.fn();
    const user = userEvent.setup();

    render(
      <ModalProvider onModalOpen={onModalOpen}>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(onModalOpen).toHaveBeenCalledTimes(1);
    });
  });

  it('не должен обновлять модальное окно если оно уже существует', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByTestId('modals-count')).toHaveTextContent('1');
    });

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByTestId('modals-count')).toHaveTextContent('1');
    });
  });

  it('должен сохранять title при открытии модального окна', async () => {
    const user = userEvent.setup();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal With Metadata'));

    await waitFor(() => {
      expect(
        screen.getByTestId('modal-title-test-modal-metadata')
      ).toHaveTextContent('Modal Title');
    });
  });

  it('должен предоставлять userActionRef', () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    const userActionRefElement = screen.getByTestId('user-action-ref');

    expect(userActionRefElement).toBeInTheDocument();
    expect(userActionRefElement).toHaveTextContent('false');
  });

  it('не должен изменять модальное окно если оно не найдено при updateModalPreventClose', async () => {
    const user = userEvent.setup();

    const TestComponentWithUpdate = () => {
      const { openModal, updateModalPreventClose, modals } = useModalContext();

      const handleOpenModal = () => {
        openModal('test-modal', <div>{MODAL_CONTENT_TEXT}</div>);
      };

      const handleUpdateNonExistent = () => {
        updateModalPreventClose('non-existent-modal', true);
      };

      return (
        <div>
          <button onClick={handleOpenModal}>Open Modal</button>
          <button onClick={handleUpdateNonExistent}>Update Non Existent</button>
          <div data-testid="modals-count">{modals.length}</div>
          {modals.map((modal) => (
            <div
              key={modal.id}
              data-testid={`modal-${modal.id}`}
            >
              {modal.content}
              {modal.preventClose && (
                <span data-testid="prevent-close-flag">prevent-close</span>
              )}
            </div>
          ))}
        </div>
      );
    };

    render(
      <ModalProvider>
        <TestComponentWithUpdate />
      </ModalProvider>
    );

    await user.click(screen.getByText('Open Modal'));

    await waitFor(() => {
      expect(screen.getByTestId('modals-count')).toHaveTextContent('1');
    });

    await user.click(screen.getByText('Update Non Existent'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('prevent-close-flag')
      ).not.toBeInTheDocument();
    });
  });
});
