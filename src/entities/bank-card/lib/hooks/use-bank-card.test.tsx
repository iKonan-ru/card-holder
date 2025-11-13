import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBankCard } from './use-bank-card';
import type { IBankCard } from '../../model';

const MOCK_MASTERCARD: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

const MOCK_VISA: IBankCard = {
  pan: '4377723769243191',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

const MOCK_MIR: IBankCard = {
  pan: '2200123456789012',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

describe('useBankCard', () => {
  it('должен определять платежную систему Mastercard', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.paymentSystem).toBe('mastercard');
  });

  it('должен определять платежную систему Visa', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_VISA,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.paymentSystem).toBe('visa');
  });

  it('должен определять платежную систему МИР', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MIR,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.paymentSystem).toBe('mir');
  });

  it('должен возвращать банк', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.bank).toBeDefined();
    expect(result.current.bank).toHaveProperty('id');
    expect(result.current.bank).toHaveProperty('name');
    expect(result.current.bank).toHaveProperty('color');
  });

  it('должен формировать стили с цветом банка', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.cardStyle).toHaveProperty('--color');
    expect(result.current.cardStyle).toHaveProperty('--color-dark');
  });

  it('должен добавлять модификатор flipped когда карта перевернута', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: true,
        isReorderMode: false,
      })
    );

    expect(result.current.modifiers).toContain('flipped');
  });

  it('не должен добавлять модификатор flipped когда карта не перевернута', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.modifiers).not.toContain('flipped');
  });

  it('должен добавлять модификатор reorder-mode в режиме переупорядочивания', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: true,
      })
    );

    expect(result.current.modifiers).toContain('reorder-mode');
  });

  it('не должен добавлять модификатор reorder-mode вне режима переупорядочивания', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.modifiers).not.toContain('reorder-mode');
  });

  it('должен добавлять оба модификатора одновременно', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: true,
        isReorderMode: true,
      })
    );

    expect(result.current.modifiers).toContain('flipped');
    expect(result.current.modifiers).toContain('reorder-mode');
  });

  it('должен вызывать onFlip при клике на карту', () => {
    const onFlipMock = vi.fn();

    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
        onFlip: onFlipMock,
      })
    );

    const mockEvent = {
      target: document.createElement('div'),
    } as unknown as React.MouseEvent;

    result.current.handleCardClick(mockEvent);

    expect(onFlipMock).toHaveBeenCalledWith(MOCK_MASTERCARD.pan);
  });

  it('не должен вызывать onFlip если коллбэк не передан', () => {
    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    const mockEvent = {
      target: document.createElement('div'),
    } as unknown as React.MouseEvent;

    expect(() => {
      result.current.handleCardClick(mockEvent);
    }).not.toThrow();
  });

  it('не должен вызывать onFlip в режиме переупорядочивания', () => {
    const onFlipMock = vi.fn();

    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: true,
        onFlip: onFlipMock,
      })
    );

    const mockEvent = {
      target: document.createElement('div'),
    } as unknown as React.MouseEvent;

    result.current.handleCardClick(mockEvent);

    expect(onFlipMock).not.toHaveBeenCalled();
  });

  it('не должен вызывать onFlip при клике на actions', () => {
    const onFlipMock = vi.fn();

    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
        onFlip: onFlipMock,
      })
    );

    const actionsElement = document.createElement('div');
    actionsElement.className = 'bank-card__actions';
    const targetElement = document.createElement('div');
    actionsElement.appendChild(targetElement);

    const mockEvent = {
      target: targetElement,
    } as unknown as React.MouseEvent;

    result.current.handleCardClick(mockEvent);

    expect(onFlipMock).not.toHaveBeenCalled();
  });

  it('должен вызывать onEdit при клике на кнопку редактирования', () => {
    const onEditMock = vi.fn();
    const stopPropagationMock = vi.fn();

    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
        onEdit: onEditMock,
      })
    );

    const mockEvent = {
      stopPropagation: stopPropagationMock,
    } as unknown as React.MouseEvent;

    result.current.handleEditClick(mockEvent);

    expect(stopPropagationMock).toHaveBeenCalled();
    expect(onEditMock).toHaveBeenCalledWith(MOCK_MASTERCARD);
  });

  it('не должен вызывать onEdit если коллбэк не передан', () => {
    const stopPropagationMock = vi.fn();

    const { result } = renderHook(() =>
      useBankCard({
        card: MOCK_MASTERCARD,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    const mockEvent = {
      stopPropagation: stopPropagationMock,
    } as unknown as React.MouseEvent;

    expect(() => {
      result.current.handleEditClick(mockEvent);
    }).not.toThrow();

    expect(stopPropagationMock).toHaveBeenCalled();
  });

  it('должен обновлять платежную систему при изменении pan', () => {
    const { result, rerender } = renderHook(
      ({ card }) =>
        useBankCard({
          card,
          isFlipped: false,
          isReorderMode: false,
        }),
      { initialProps: { card: MOCK_MASTERCARD } }
    );

    expect(result.current.paymentSystem).toBe('mastercard');

    rerender({ card: MOCK_VISA });

    expect(result.current.paymentSystem).toBe('visa');
  });

  it('должен обновлять модификаторы при изменении isFlipped', () => {
    const { result, rerender } = renderHook(
      ({ isFlipped }) =>
        useBankCard({
          card: MOCK_MASTERCARD,
          isFlipped,
          isReorderMode: false,
        }),
      { initialProps: { isFlipped: false } }
    );

    expect(result.current.modifiers).not.toContain('flipped');

    rerender({ isFlipped: true });

    expect(result.current.modifiers).toContain('flipped');
  });

  it('должен обновлять модификаторы при изменении isReorderMode', () => {
    const { result, rerender } = renderHook(
      ({ isReorderMode }) =>
        useBankCard({
          card: MOCK_MASTERCARD,
          isFlipped: false,
          isReorderMode,
        }),
      { initialProps: { isReorderMode: false } }
    );

    expect(result.current.modifiers).not.toContain('reorder-mode');

    rerender({ isReorderMode: true });

    expect(result.current.modifiers).toContain('reorder-mode');
  });

  it('должен использовать дефолтный банк для неизвестной карты', () => {
    const unknownCard: IBankCard = {
      pan: '0000000000000000',
      expires: '0726',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
      order: 0,
    };

    const { result } = renderHook(() =>
      useBankCard({
        card: unknownCard,
        isFlipped: false,
        isReorderMode: false,
      })
    );

    expect(result.current.bank).toBeDefined();
    expect(result.current.bank.id).toBe('default');
  });
});
