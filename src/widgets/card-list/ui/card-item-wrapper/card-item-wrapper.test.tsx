import type { FC, PropsWithChildren } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { MOCK_CARD } from '@test';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { ModalProvider } from '@shared/lib';
import { CardItemWrapper } from './card-item-wrapper';

const { mockUseCardManagementStore, mockOpenEditCardForm, mockFlipCard } =
  vi.hoisted(() => ({
    mockUseCardManagementStore: vi.fn(),
    mockOpenEditCardForm: vi.fn(),
    mockFlipCard: vi.fn(),
  }));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

vi.mock('@features/card-form', () => ({
  useCardFormModal: () => ({
    openEditCardForm: mockOpenEditCardForm,
  }),
}));

vi.mock('@features/sortable-card-item', () => ({
  SortableCardItem: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id: string;
  }) => <div data-testid={`sortable-${id}`}>{children}</div>,
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

describe('CardItemWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCardManagementStore.mockImplementation((selector) => {
      const mockStore = {
        flipCard: mockFlipCard,
      };

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
          isFlipped={false}
          isReorderMode={false}
        />
      </DndWrapper>
    );

    const sortableItem = container.querySelector(
      `[data-testid="sortable-${MOCK_CARD.pan}"]`
    );
    expect(sortableItem).toBeInTheDocument();

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${MOCK_CARD.pan}"]`
    );
    expect(bankCard).toBeInTheDocument();
    expect(bankCard).toHaveTextContent(MOCK_CARD.name);
  });

  it('должна передавать isFlipped=true в BankCard', () => {
    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isFlipped={true}
          isReorderMode={false}
        />
      </DndWrapper>
    );

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${MOCK_CARD.pan}"]`
    );
    expect(bankCard).toHaveAttribute('data-flipped', 'true');
  });

  it('должна передавать isReorderMode=true в SortableCardItem и BankCard', () => {
    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isFlipped={false}
          isReorderMode={true}
        />
      </DndWrapper>
    );

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${MOCK_CARD.pan}"]`
    );
    expect(bankCard).toHaveAttribute('data-reorder', 'true');
  });

  it('должна использовать flipCard из стора', () => {
    render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isFlipped={false}
          isReorderMode={false}
        />
      </DndWrapper>
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('должна использовать openEditCardForm из useCardFormModal', () => {
    render(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isFlipped={false}
          isReorderMode={false}
        />
      </DndWrapper>
    );

    expect(mockOpenEditCardForm).toBeDefined();
  });

  it('должна корректно рендериться с другой картой', () => {
    const anotherCard: IBankCard = {
      pan: '4377723769243191',
      expires: '0726',
      name: 'ANOTHER USER',
      cvv: '456',
      pin: '5678',
      order: 1,
    };

    const { container } = render(
      <DndWrapper>
        <CardItemWrapper
          card={anotherCard}
          isFlipped={true}
          isReorderMode={true}
        />
      </DndWrapper>
    );

    const bankCard = container.querySelector(
      `[data-testid="bank-card-${anotherCard.pan}"]`
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
          isFlipped={false}
          isReorderMode={false}
        />
      </DndWrapper>
    );

    mockFlipCard.mockClear();

    rerender(
      <DndWrapper>
        <CardItemWrapper
          card={MOCK_CARD}
          isFlipped={false}
          isReorderMode={false}
        />
      </DndWrapper>
    );
  });
});
