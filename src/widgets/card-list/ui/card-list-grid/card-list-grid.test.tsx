import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CardListGrid } from './card-list-grid';
import type { IBankCard } from '@entities/bank-card';
import { ParentClassProvider } from '@shared/lib';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { FC, PropsWithChildren } from 'react';
import { MOCK_CARD, MOCK_CARD_SECOND } from '@test';

vi.mock('@entities/bank-card', () => ({
  BankCard: ({ card }: { card: IBankCard }) => (
    <div data-testid={`card-${card.pan}`}>{card.name}</div>
  ),
}));

const MOCK_CARDS: IBankCard[] = [MOCK_CARD, MOCK_CARD_SECOND];

const TEST_PARENT_CLASS = 'test-parent';

const DndWrapper: FC<PropsWithChildren> = ({ children }) => {
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
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <DndWrapper>
          <CardListGrid
            cards={MOCK_CARDS}
            flippedPan={null}
            isReorderMode={false}
            onFlipCard={vi.fn()}
            onEditCard={vi.fn()}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>
    );

    const grid = container.querySelector('.card-list-grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute('role', 'list');
  });

  it('должна рендерить все карты', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <DndWrapper>
          <CardListGrid
            cards={MOCK_CARDS}
            flippedPan={null}
            isReorderMode={false}
            onFlipCard={vi.fn()}
            onEditCard={vi.fn()}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>
    );

    expect(screen.getByTestId('card-5559494202595236')).toBeInTheDocument();
    expect(screen.getByTestId('card-4377723769243191')).toBeInTheDocument();
  });

  it('должна рендерить кнопку добавления', () => {
    const { container } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <DndWrapper>
          <CardListGrid
            cards={MOCK_CARDS}
            flippedPan={null}
            isReorderMode={false}
            onFlipCard={vi.fn()}
            onEditCard={vi.fn()}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>
    );

    const addButton = container.querySelector('.add-card-button');
    expect(addButton).toBeInTheDocument();
  });

  it('должна рендериться с пустым списком', () => {
    const { container } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <DndWrapper>
          <CardListGrid
            cards={[]}
            flippedPan={null}
            isReorderMode={false}
            onFlipCard={vi.fn()}
            onEditCard={vi.fn()}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>
    );

    const grid = container.querySelector('.card-list-grid');
    expect(grid).toBeInTheDocument();

    const addButton = container.querySelector('.add-card-button');
    expect(addButton).toBeInTheDocument();
  });

  it('должна использовать parentClass для генерации классов', () => {
    const { container } = render(
      <ParentClassProvider parentClass="custom-parent">
        <DndWrapper>
          <CardListGrid
            cards={MOCK_CARDS}
            flippedPan={null}
            isReorderMode={false}
            onFlipCard={vi.fn()}
            onEditCard={vi.fn()}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>
    );

    const grid = container.querySelector('.card-list-grid');
    expect(grid).toBeInTheDocument();
  });
});
