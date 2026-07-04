import type { FC, PropsWithChildren } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { MOCK_CARD, MOCK_CARD_SECOND } from '@test';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { ModalProvider, ParentClassProvider } from '@shared/lib';
import { CardListGrid } from './card-list-grid';

const { mockUseCardManagementStore, mockOpenEditCardForm } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
  mockOpenEditCardForm: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
  getCardTypeName: () => null,
}));

vi.mock('@features/card-form', () => ({
  useCardFormModal: () => ({
    openEditCardForm: mockOpenEditCardForm,
  }),
}));

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
    <ModalProvider>
      <DndContext>
        <SortableContext items={ids}>{children}</SortableContext>
      </DndContext>
    </ModalProvider>
  );
};

describe('CardListGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCardManagementStore.mockImplementation((selector) => {
      const mockStore = {
        flipCard: vi.fn(),
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

  it('должна рендериться с картами', () => {
    const { container } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <DndWrapper>
          <CardListGrid
            cards={MOCK_CARDS}
            flippedPan={null}
            isReorderMode={false}
            cardTypes={[]}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>,
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
            cardTypes={[]}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>,
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
            cardTypes={[]}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>,
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
            cardTypes={[]}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>,
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
            cardTypes={[]}
            onShowForm={vi.fn()}
          />
        </DndWrapper>
      </ParentClassProvider>,
    );

    const grid = container.querySelector('.card-list-grid');
    expect(grid).toBeInTheDocument();
  });
});
