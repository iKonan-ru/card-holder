import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardList } from '.';
import { useCardManagementStore } from '@features/card-management';
import { ModalProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import type { IBankCard } from '@entities/bank-card';
import type { FC, ReactNode } from 'react';

vi.mock('@features/card-management', () => ({
  useCardManagementStore: vi.fn(),
}));

vi.mock('@entities/bank-card', () => ({
  BankCard: ({ card }: { card: IBankCard }) => (
    <div data-testid={`bank-card-${card.pan}`}>{card.name}</div>
  ),
}));

const MOCK_CARDS: IBankCard[] = [
  {
    pan: '5559494202595236',
    expires: '0726',
    name: 'USER ONE',
    cvv: '123',
    pin: '1234',
    order: 0,
  },
  {
    pan: '4377723769243191',
    expires: '0726',
    name: 'USER TWO',
    cvv: '456',
    pin: '5678',
    order: 1,
  },
  {
    pan: '2200150236441892',
    expires: '0329',
    name: 'USER THREE',
    cvv: '789',
    pin: '9012',
    order: 2,
  },
];

const TestWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalContainer />
    </ModalProvider>
  );
};

describe('CardList', () => {
  beforeEach(() => {
    vi.mocked(useCardManagementStore).mockReturnValue({
      cards: MOCK_CARDS,
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

    MOCK_CARDS.forEach((card) => {
      expect(screen.getByTestId(`bank-card-${card.pan}`)).toBeInTheDocument();
    });
  });

  it('должна отображать корректное количество карт', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const cards = screen.getAllByText(/USER/);
    expect(cards).toHaveLength(MOCK_CARDS.length);
  });

  it('должна рендериться с пустым списком карт', () => {
    vi.mocked(useCardManagementStore).mockReturnValue({
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
    });

    render(<CardList />, { wrapper: TestWrapper });

    const cardList = document.querySelector('.card-list');
    expect(cardList).toBeInTheDocument();

    const cards = screen.queryAllByText(/USER/);
    expect(cards).toHaveLength(0);
  });

  it('должна содержать grid контейнер', () => {
    render(<CardList />, { wrapper: TestWrapper });

    const gridElement = document.querySelector('.card-list__grid');
    expect(gridElement).toBeInTheDocument();
  });

  it('должна использовать pan как key для карт', () => {
    const { container } = render(<CardList />, { wrapper: TestWrapper });

    MOCK_CARDS.forEach((card) => {
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
    vi.mocked(useCardManagementStore).mockReturnValue({
      cards: updatedCards,
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

    expect(screen.getByText('Добавление карты')).toBeInTheDocument();
  });

  it('должна закрывать форму при клике на кнопку отмены', async () => {
    const user = userEvent.setup();
    render(<CardList />, { wrapper: TestWrapper });

    const addButton = document.querySelector('.add-card-button') as HTMLElement;
    await user.click(addButton);

    const cancelButton = screen.getByRole('button', { name: 'Отмена' });
    await user.click(cancelButton);

    expect(screen.queryByText('Добавление карты')).not.toBeInTheDocument();
  });
});
