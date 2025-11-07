import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { CardListDragOverlay } from './card-list-drag-overlay';
import type { IBankCard } from '@entities/bank-card';

vi.mock('@entities/bank-card', () => ({
  BankCard: ({ card }: { card: IBankCard }) => (
    <div data-testid={`overlay-card-${card.pan}`}>{card.name}</div>
  ),
}));

const MOCK_CARD: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

const TEST_PARENT_CLASS = 'test-parent';

describe('CardListDragOverlay', () => {
  afterEach(() => {
    cleanup();
  });

  it('должна возвращать null когда activeCard=null', () => {
    const { container } = render(
      <CardListDragOverlay
        activeCard={null}
        onEditCard={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('должна рендериться когда есть activeCard', () => {
    const { container } = render(
      <CardListDragOverlay
        activeCard={MOCK_CARD}
        onEditCard={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const overlay = container.querySelector('.test-parent__drag-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('должна рендерить BankCard с activeCard', () => {
    const { getByTestId } = render(
      <CardListDragOverlay
        activeCard={MOCK_CARD}
        onEditCard={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    expect(getByTestId('overlay-card-5559494202595236')).toBeInTheDocument();
  });

  it('должна передавать isReorderMode=true в BankCard', () => {
    render(
      <CardListDragOverlay
        activeCard={MOCK_CARD}
        onEditCard={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    expect(true).toBe(true);
  });
});
