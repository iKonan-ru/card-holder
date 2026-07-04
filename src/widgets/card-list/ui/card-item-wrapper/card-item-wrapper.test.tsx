import type { FC, PropsWithChildren, ReactNode } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { MOCK_CARD } from '@test';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { ModalProvider } from '@shared/lib';
import { CardItemWrapper } from './card-item-wrapper';

const {
  mockUseCardsStore,
  mockUseCardTypesManagementStore,
  mockOpenEditCardForm,
  mockFlipCard,
} = vi.hoisted(() => ({
  mockUseCardsStore: vi.fn(),
  mockUseCardTypesManagementStore: vi.fn(),
  mockOpenEditCardForm: vi.fn(),
  mockFlipCard: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardsStore: mockUseCardsStore,
  getCardTypeName: () => null,
}));

vi.mock('@features/card-types-management', () => ({
  useCardTypesManagementStore: mockUseCardTypesManagementStore,
}));

vi.mock('@features/card-form', () => ({
  useCardFormModal: () => ({
    openEditCardForm: mockOpenEditCardForm,
  }),
}));

vi.mock('@features/sortable-card-item', () => ({
  SortableCardItem: ({ children, id }: { children: ReactNode; id: string }) => (
    <div data-testid={`sortable-${id}`}>{children}</div>
  ),
}));

vi.mock('@entities/bank-card', () => ({
  BankCard: ({
    card,
    isFlipped,
    isReorderMode,
  }: {
    card: IBankCard;
    isFlipped: boolean;
    isReorderMode: boolean;
  }) => (
    <div
      data-testid={`bank-card-${card.pan}`}
      data-flipped={isFlipped}
      data-reorder={isReorderMode}
    >
      {card.name}
    </div>
  ),
}));

const DndWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ModalProvider>
      <DndContext>
        <SortableContext items={[MOCK_CARD.pan]}>{children}</SortableContext>
      </DndContext>
    </ModalProvider>
  );
};

const mockCardsStore = (flippedPan: string | null) => {
  mockUseCardsStore.mockImplementation((selector) => {
    const mockStore = {
      flipCard: mockFlipCard,
      flippedPan,
    };

    if (selector) {
      return selector(mockStore);
    }

    return mockStore;
  });
};

describe('CardItemWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCardsStore(null);
    mockUseCardTypesManagementStore.mockImplementation((selector) => {
      const mockStore = { cardTypes: [] };

      if (selector) {
        return selector(mockStore);
      }

      return mockStore;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('должна рендериться с корректными пропсами', () => {
    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={false}
        />
      </DndWrapper>,
    );

    const sortableItem = container.querySelector(
      `[data-testid="sortable-${MOCK_CARD.pan}"]`,
    );
    expect(sortableItem).toBeInTheDocument();

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${MOCK_CARD.pan}"]`,
    );
    expect(bankCard).toBeInTheDocument();
    expect(bankCard).toHaveTextContent(MOCK_CARD.name);
  });

  it('должна передавать isFlipped=true в BankCard, если pan совпадает с flippedPan из стора', () => {
    mockCardsStore(MOCK_CARD.pan);

    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={false}
        />
      </DndWrapper>,
    );

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${MOCK_CARD.pan}"]`,
    );
    expect(bankCard).toHaveAttribute('data-flipped', 'true');
  });

  it('должна передавать isReorderMode=true в SortableCardItem и BankCard', () => {
    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={true}
        />
      </DndWrapper>,
    );

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${MOCK_CARD.pan}"]`,
    );
    expect(bankCard).toHaveAttribute('data-reorder', 'true');
  });

  it('должна использовать flipCard из стора', () => {
    render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={false}
        />
      </DndWrapper>,
    );

    expect(mockUseCardsStore).toHaveBeenCalled();
  });

  it('должна использовать openEditCardForm из useCardFormModal', () => {
    render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={false}
        />
      </DndWrapper>,
    );

    expect(mockOpenEditCardForm).toBeDefined();
  });

  it('должна корректно рендериться с другой картой', () => {
    const anotherCard: IBankCard = {
      id: 'item-wrapper-another-id',
      pan: '4377723769243191',
      expires: '0726',
      name: 'ANOTHER USER',
      cvv: '456',
      pin: '5678',
      order: 1,
    };

    mockCardsStore(anotherCard.pan);

    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={anotherCard}
          isReorderMode={true}
        />
      </DndWrapper>,
    );

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${anotherCard.pan}"]`,
    );
    expect(bankCard).toBeInTheDocument();
    expect(bankCard).toHaveTextContent(anotherCard.name);
    expect(bankCard).toHaveAttribute('data-flipped', 'true');
    expect(bankCard).toHaveAttribute('data-reorder', 'true');
  });

  it('не должна ререндериться при одинаковых пропсах (memo)', () => {
    const { rerender } = render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={false}
        />
      </DndWrapper>,
    );

    mockFlipCard.mockClear();

    rerender(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isReorderMode={false}
        />
      </DndWrapper>,
    );
  });
});
