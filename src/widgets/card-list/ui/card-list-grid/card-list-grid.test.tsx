import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CardListGrid } from './card-list-grid';
import type { IBankCard } from '@entities/bank-card';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { FC, ReactNode } from 'react';

vi.mock('@entities/bank-card', () => ({
  BankCard: ({ card }: { card: IBankCard }) => (
    <div data-testid={`card-${card.pan}`}>{card.name}</div>
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
];

const TEST_PARENT_CLASS = 'test-parent';

const DndWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const ids = MOCK_CARDS.map((card) => card.pan);

  return (
    <DndContext>
      <SortableContext items={ids}>{children}</SortableContext>
    </DndContext>
  );
};

describe('CardListGrid', () => {
  afterEach(() => {
    cleanup();
  });

  it('должна рендериться с картами', () => {
    const { container } = render(
      <DndWrapper>
        <CardListGrid
          cards={MOCK_CARDS}
          flippedPan={null}
          isReorderMode={false}
          onFlipCard={vi.fn()}
          onEditCard={vi.fn()}
          onShowForm={vi.fn()}
          parentClass={TEST_PARENT_CLASS}
        />
      </DndWrapper>
    );

    const grid = container.querySelector('.test-parent__grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute('role', 'list');
  });

  it('должна рендерить все карты', () => {
    render(
      <DndWrapper>
        <CardListGrid
          cards={MOCK_CARDS}
          flippedPan={null}
          isReorderMode={false}
          onFlipCard={vi.fn()}
          onEditCard={vi.fn()}
          onShowForm={vi.fn()}
          parentClass={TEST_PARENT_CLASS}
        />
      </DndWrapper>
    );

    expect(screen.getByTestId('card-5559494202595236')).toBeInTheDocument();
    expect(screen.getByTestId('card-4377723769243191')).toBeInTheDocument();
  });

  it('должна рендерить кнопку добавления', () => {
    const { container } = render(
      <DndWrapper>
        <CardListGrid
          cards={MOCK_CARDS}
          flippedPan={null}
          isReorderMode={false}
          onFlipCard={vi.fn()}
          onEditCard={vi.fn()}
          onShowForm={vi.fn()}
          parentClass={TEST_PARENT_CLASS}
        />
      </DndWrapper>
    );

    const addButton = container.querySelector('.add-card-button');
    expect(addButton).toBeInTheDocument();
  });

  it('должна рендериться с пустым списком', () => {
    const { container } = render(
      <DndWrapper>
        <CardListGrid
          cards={[]}
          flippedPan={null}
          isReorderMode={false}
          onFlipCard={vi.fn()}
          onEditCard={vi.fn()}
          onShowForm={vi.fn()}
          parentClass={TEST_PARENT_CLASS}
        />
      </DndWrapper>
    );

    const grid = container.querySelector('.test-parent__grid');
    expect(grid).toBeInTheDocument();

    const addButton = container.querySelector('.add-card-button');
    expect(addButton).toBeInTheDocument();
  });

  it('должна передавать isReorderMode в карты', () => {
    const { container } = render(
      <DndWrapper>
        <CardListGrid
          cards={MOCK_CARDS}
          flippedPan={null}
          isReorderMode={true}
          onFlipCard={vi.fn()}
          onEditCard={vi.fn()}
          onShowForm={vi.fn()}
          parentClass={TEST_PARENT_CLASS}
        />
      </DndWrapper>
    );

    const sortableItems = container.querySelectorAll(
      '.sortable-card-item__wrapper'
    );
    expect(sortableItems.length).toBe(MOCK_CARDS.length);
  });
});
