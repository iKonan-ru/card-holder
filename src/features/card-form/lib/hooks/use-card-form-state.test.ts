import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardFormState } from './use-card-form-state';
import type { IBankCard } from '@entities/bank-card';

describe('useCardFormState', () => {
  it('должен инициализироваться с пустой формой', () => {
    const { result } = renderHook(() => useCardFormState({}));

    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      type: '',
      phrase: '',
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isEditMode).toBe(false);
    expect(result.current.originalPan).toBeUndefined();
  });

  it('должен инициализироваться с данными карты', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '5536914125525541',
      expires: '1225',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
    };

    const { result } = renderHook(() => useCardFormState({ initialCard }));

    expect(result.current.formData).toEqual({
      pan: '5536 9141 2552 5541',
      expires: '12/25',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
    });
    expect(result.current.isEditMode).toBe(true);
    expect(result.current.originalPan).toBe('5536914125525541');
  });

  it('должен обновлять поле через handleFieldChange', () => {
    const { result } = renderHook(() => useCardFormState({}));

    act(() => {
      result.current.handleFieldChange('name', 'JOHN DOE');
    });

    expect(result.current.formData.name).toBe('JOHN DOE');
  });

  it('должен обновлять несколько полей', () => {
    const { result } = renderHook(() => useCardFormState({}));

    act(() => {
      result.current.handleFieldChange('pan', '5536 9141 2552 5541');
      result.current.handleFieldChange('expires', '12/25');
      result.current.handleFieldChange('cvv', '123');
    });

    expect(result.current.formData).toEqual({
      pan: '5536 9141 2552 5541',
      expires: '12/25',
      name: '',
      cvv: '123',
      pin: '',
      type: '',
      phrase: '',
    });
  });

  it('должен сбрасывать форму через resetForm', () => {
    const { result } = renderHook(() => useCardFormState({}));

    act(() => {
      result.current.handleFieldChange('name', 'TEST USER');
      result.current.handleFieldChange('pan', '5536 9141 2552 5541');
    });

    expect(result.current.formData.name).toBe('TEST USER');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      pan: '',
      expires: '',
      name: '',
      cvv: '',
      pin: '',
      type: '',
      phrase: '',
    });
  });

  it('должен обновлять данные при изменении initialCard', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '5536914125525541',
      expires: '1225',
      name: 'INITIAL USER',
      cvv: '123',
      pin: '1234',
    };

    const { result, rerender } = renderHook(
      ({ card }) => useCardFormState({ initialCard: card }),
      { initialProps: { card: initialCard } }
    );

    expect(result.current.formData.name).toBe('INITIAL USER');

    const updatedCard: Partial<IBankCard> = {
      pan: '4276300015876543',
      expires: '0626',
      name: 'UPDATED USER',
      cvv: '456',
      pin: '5678',
    };

    rerender({ card: updatedCard });

    expect(result.current.formData).toEqual({
      pan: '4276 3000 1587 6543',
      expires: '06/26',
      name: 'UPDATED USER',
      cvv: '456',
      pin: '5678',
    });
  });

  it('должен корректно определять isEditMode', () => {
    const { result: resultEmpty } = renderHook(() => useCardFormState({}));

    expect(resultEmpty.current.isEditMode).toBe(false);

    const initialCard: Partial<IBankCard> = {
      pan: '5536914125525541',
      expires: '1225',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
    };

    const { result: resultWithCard } = renderHook(() =>
      useCardFormState({ initialCard })
    );

    expect(resultWithCard.current.isEditMode).toBe(true);
  });

  it('должен форматировать pan и expires при инициализации', () => {
    const initialCard: Partial<IBankCard> = {
      pan: '5536914125525541',
      expires: '1225',
    };

    const { result } = renderHook(() => useCardFormState({ initialCard }));

    expect(result.current.formData.pan).toBe('5536 9141 2552 5541');
    expect(result.current.formData.expires).toBe('12/25');
  });

  it('не должен изменять formData при отсутствии initialCard', () => {
    const { result, rerender } = renderHook(() => useCardFormState({}));

    const initialFormData = result.current.formData;

    rerender();

    expect(result.current.formData).toEqual(initialFormData);
  });
});
