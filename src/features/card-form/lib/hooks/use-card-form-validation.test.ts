import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCardFormValidation } from './use-card-form-validation';

describe('useCardFormValidation', () => {
  it('должен инициализироваться с пустым объектом ошибок', () => {
    const { result } = renderHook(() => useCardFormValidation());

    expect(result.current.errors).toEqual({});
  });

  it('должен добавлять ошибку через handleFieldValidation', () => {
    const { result } = renderHook(() => useCardFormValidation());

    act(() => {
      result.current.handleFieldValidation('pan', 'Номер карты обязателен');
    });

    expect(result.current.errors).toEqual({
      pan: 'Номер карты обязателен',
    });
  });

  it('должен удалять ошибку при передаче undefined', () => {
    const { result } = renderHook(() => useCardFormValidation());

    act(() => {
      result.current.handleFieldValidation('pan', 'Номер карты обязателен');
      result.current.handleFieldValidation('cvv', 'CVV обязателен');
    });

    expect(result.current.errors).toEqual({
      pan: 'Номер карты обязателен',
      cvv: 'CVV обязателен',
    });

    act(() => {
      result.current.handleFieldValidation('pan', undefined);
    });

    expect(result.current.errors).toEqual({
      cvv: 'CVV обязателен',
    });
  });

  it('должен обрабатывать несколько ошибок', () => {
    const { result } = renderHook(() => useCardFormValidation());

    act(() => {
      result.current.handleFieldValidation('pan', 'Номер карты обязателен');
      result.current.handleFieldValidation(
        'expires',
        'Срок действия обязателен'
      );
      result.current.handleFieldValidation('cvv', 'CVV обязателен');
    });

    expect(result.current.errors).toEqual({
      pan: 'Номер карты обязателен',
      expires: 'Срок действия обязателен',
      cvv: 'CVV обязателен',
    });
  });

  it('должен обновлять существующую ошибку', () => {
    const { result } = renderHook(() => useCardFormValidation());

    act(() => {
      result.current.handleFieldValidation('pan', 'Первая ошибка');
    });

    expect(result.current.errors.pan).toBe('Первая ошибка');

    act(() => {
      result.current.handleFieldValidation('pan', 'Вторая ошибка');
    });

    expect(result.current.errors.pan).toBe('Вторая ошибка');
  });

  it('должен сбрасывать все ошибки через resetErrors', () => {
    const { result } = renderHook(() => useCardFormValidation());

    act(() => {
      result.current.handleFieldValidation('pan', 'Ошибка 1');
      result.current.handleFieldValidation('cvv', 'Ошибка 2');
      result.current.handleFieldValidation('expires', 'Ошибка 3');
    });

    expect(Object.keys(result.current.errors).length).toBe(3);

    act(() => {
      result.current.resetErrors();
    });

    expect(result.current.errors).toEqual({});
  });

  it('должен устанавливать ошибки через setErrors', () => {
    const { result } = renderHook(() => useCardFormValidation());

    const newErrors = {
      pan: 'Ошибка номера карты',
      cvv: 'Ошибка CVV',
    };

    act(() => {
      result.current.setErrors(newErrors);
    });

    expect(result.current.errors).toEqual(newErrors);
  });

  it('должен заменять ошибки через setErrors', () => {
    const { result } = renderHook(() => useCardFormValidation());

    act(() => {
      result.current.setErrors({
        pan: 'Первая ошибка',
        cvv: 'Вторая ошибка',
      });
    });

    expect(Object.keys(result.current.errors).length).toBe(2);

    act(() => {
      result.current.setErrors({
        expires: 'Новая ошибка',
      });
    });

    expect(result.current.errors).toEqual({
      expires: 'Новая ошибка',
    });
  });
});
