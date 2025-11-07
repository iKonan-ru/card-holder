import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardListDrag } from './use-card-list-drag';
import type { IBankCard } from '@entities/bank-card';
import type { DragStartEvent, DragOverEvent } from '@dnd-kit/core';

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

describe('useCardListDrag', () => {
  const mockOnDragEnd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен инициализироваться с картами из store', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    expect(result.current.cards).toEqual(MOCK_CARDS);
    expect(result.current.activeCard).toBeNull();
  });

  it('должен устанавливать activeCard при handleDragStart', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    const mockStartEvent = {
      active: {
        id: MOCK_CARDS[0].pan,
      },
    } as DragStartEvent;

    act(() => {
      result.current.handleDragStart(mockStartEvent);
    });

    expect(result.current.activeCard).toEqual(MOCK_CARDS[0]);
  });

  it('должен переставлять карты при handleDragOver', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    const mockEvent = {
      active: {
        id: MOCK_CARDS[0].pan,
      },
      over: {
        id: MOCK_CARDS[1].pan,
      },
    } as DragOverEvent;

    act(() => {
      result.current.handleDragOver(mockEvent);
    });

    expect(result.current.cards[0]).toEqual(MOCK_CARDS[1]);
    expect(result.current.cards[1]).toEqual(MOCK_CARDS[0]);
  });

  it('не должен переставлять карты если over=null', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    const mockEvent = {
      active: {
        id: MOCK_CARDS[0].pan,
      },
      over: null,
    } as DragOverEvent;

    act(() => {
      result.current.handleDragOver(mockEvent);
    });

    expect(result.current.cards).toEqual(MOCK_CARDS);
  });

  it('должен вызывать onDragEnd и сбрасывать activeCard', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    const mockEvent = {
      active: {
        id: MOCK_CARDS[0].pan,
      },
    } as DragStartEvent;

    act(() => {
      result.current.handleDragStart(mockEvent);
    });

    expect(result.current.activeCard).not.toBeNull();

    act(() => {
      result.current.handleDragEnd();
    });

    expect(mockOnDragEnd).toHaveBeenCalledWith(result.current.cards);
    expect(result.current.activeCard).toBeNull();
  });

  it('должен синхронизироваться с storeCards когда не drag', () => {
    const { result, rerender } = renderHook(
      ({ storeCards }) =>
        useCardListDrag({
          storeCards,
          onDragEnd: mockOnDragEnd,
        }),
      {
        initialProps: { storeCards: MOCK_CARDS },
      }
    );

    const updatedCards = [MOCK_CARDS[0]];

    rerender({ storeCards: updatedCards });

    expect(result.current.cards).toEqual(updatedCards);
  });

  it('не должен синхронизироваться с storeCards во время drag', () => {
    const { result, rerender } = renderHook(
      ({ storeCards }) =>
        useCardListDrag({
          storeCards,
          onDragEnd: mockOnDragEnd,
        }),
      {
        initialProps: { storeCards: MOCK_CARDS },
      }
    );

    const mockEvent = {
      active: {
        id: MOCK_CARDS[0].pan,
      },
    } as DragStartEvent;

    act(() => {
      result.current.handleDragStart(mockEvent);
    });

    const updatedCards = [MOCK_CARDS[0]];

    rerender({ storeCards: updatedCards });

    expect(result.current.cards).toEqual(MOCK_CARDS);
  });

  it('не должен устанавливать activeCard если карта не найдена', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    const mockEvent = {
      active: {
        id: 'non-existent-pan',
      },
    } as DragStartEvent;

    act(() => {
      result.current.handleDragStart(mockEvent);
    });

    expect(result.current.activeCard).toBeNull();
  });

  it('не должен переставлять карты если active.id === over.id', () => {
    const { result } = renderHook(() =>
      useCardListDrag({
        storeCards: MOCK_CARDS,
        onDragEnd: mockOnDragEnd,
      })
    );

    const mockEvent = {
      active: {
        id: MOCK_CARDS[0].pan,
      },
      over: {
        id: MOCK_CARDS[0].pan,
      },
    } as DragOverEvent;

    act(() => {
      result.current.handleDragOver(mockEvent);
    });

    expect(result.current.cards).toEqual(MOCK_CARDS);
  });
});
