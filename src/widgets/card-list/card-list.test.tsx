import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardList } from './card-list';
import { ModalProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import type { IBankCard } from '@entities/bank-card';
import type { FC, ReactNode } from 'react';
import { MOCK_CARDS } from '@test';

const {
  mockUseCardManagementStore,
  mockOpenAddCardForm,
  mockOpenEditCardForm,
} = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
  mockOpenAddCardForm: vi.fn(),
  mockOpenEditCardForm: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

vi.mock('@features/card-form', () => ({
  useCardFormModal: () => ({
    openAddCardForm: mockOpenAddCardForm,
    openEditCardForm: mockOpenEditCardForm,
  }),
}));

vi.mock('@entities/bank-card', () => ({
  BankCard: ({ card }: { card: IBankCard }) => (
    <div data-testid={`bank-card-${card.pan}`}>{card.name}</div>
  ),
}));

const TestWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalContainer />
    </ModalProvider>
  );
};

const createMockStore = (overrides = {}) => ({
  cards: [],
  flippedPan: null,
  isLoading: false,
  isReorderMode: false,
  flipCard: vi.fn(),
  loadCards: vi.fn(),
  addCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
  reorderCards: vi.fn(),
  setCards: vi.fn(),
  toggleReorderMode: vi.fn(),
  unflipCards: vi.fn(),
  setReorderMode: vi.fn(),
  ...overrides,
});

describe('CardList', () => {
  beforeEach(() => {
    const mockStoreValue = createMockStore({ cards: MOCK_CARDS });

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

  it('должна рендериться с картами', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const cardList = document.querySelector('.card-list');
    expect(cardList).toBeInTheDocument();
  });

  it('должна отображать все карты из store', () => {
    render(<CardList />, { wrapper: TestWrapper });

    MOCK_CARDS.forEach((card: IBankCard) => {
      expect(screen.getByTestId(`bank-card-${card.pan}`)).toBeInTheDocument();
    });
  });

  it('должна отображать корректное количество карт', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const cards = screen.getAllByText(/USER/);
    expect(cards).toHaveLength(MOCK_CARDS.length);
  });

  it('должна рендериться с пустым списком карт', () => {
    const mockStoreValue = createMockStore({ cards: [] });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(<CardList />, { wrapper: TestWrapper });

    const cardList = document.querySelector('.card-list');
    expect(cardList).toBeInTheDocument();

    const cards = screen.queryAllByText(/USER/);
    expect(cards).toHaveLength(0);
  });

  it('должна содержать grid контейнер', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const gridElement = document.querySelector('.card-list-grid');
    expect(gridElement).toBeInTheDocument();
  });

  it('должна использовать pan как key для карт', () => {
    const { container } = render(<CardList />, { wrapper: TestWrapper });

    MOCK_CARDS.forEach((card: IBankCard) => {
      const cardElement = container.querySelector(
        `[data-testid="bank-card-${card.pan}"]`
      );
      expect(cardElement).toBeInTheDocument();
    });
  });

  it('должна рендерить карты в правильном порядке', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const cardElements = screen.getAllByText(/USER/);
    expect(cardElements[0]).toHaveTextContent('USER ONE');
    expect(cardElements[1]).toHaveTextContent('USER TWO');
    expect(cardElements[2]).toHaveTextContent('USER THREE');
  });

  it('должна обновлять список при изменении cards в store', () => {
    const { rerender } = render(<CardList />, { wrapper: TestWrapper });

    expect(screen.getAllByText(/USER/)).toHaveLength(MOCK_CARDS.length);

    const updatedCards = [MOCK_CARDS[0]];
    const mockStoreValue = createMockStore({ cards: updatedCards });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    rerender(<CardList />);

    expect(screen.getAllByText(/USER/)).toHaveLength(updatedCards.length);
  });

  it('должна отображать кнопку добавления карты', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const addButton = document.querySelector('.add-card-button');
    expect(addButton).toBeInTheDocument();
  });

  it('должна открывать форму при клике на кнопку добавления', async () => {
    const user = userEvent.setup();
    render(<CardList />, { wrapper: TestWrapper });

    const addButton = document.querySelector('.add-card-button') as HTMLElement;
    await user.click(addButton);

    expect(mockOpenAddCardForm).toHaveBeenCalled();
  });

  it('должна использовать openAddCardForm при добавлении карты', async () => {
    vi.clearAllMocks();
    const user = userEvent.setup();
    render(<CardList />, { wrapper: TestWrapper });

    const addButton = document.querySelector('.add-card-button') as HTMLElement;
    await user.click(addButton);

    expect(mockOpenAddCardForm).toHaveBeenCalled();
  });
});
