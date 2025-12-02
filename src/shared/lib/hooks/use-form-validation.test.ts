import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFormValidation } from './use-form-validation';

interface ITestFormErrors {
  email?: string;
  password?: string;
  username?: string;
  [key: string]: string | undefined;
}

describe('useFormValidation', () => {
  it('должен инициализироваться с пустым объектом ошибок', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors()).toBe(false);
  });

  it('должен добавлять ошибку через handleFieldValidation', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('должен удалять ошибку при передаче undefined', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
    });

    expect(result.current.errors.email).toBe('Invalid email');

    act(() => {
      result.current.handleFieldValidation('email', undefined);
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.hasErrors()).toBe(false);
  });

  it('должен обновлять существующую ошибку', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
    });

    expect(result.current.errors.email).toBe('Invalid email');

    act(() => {
      result.current.handleFieldValidation('email', 'Email is required');
    });

    expect(result.current.errors.email).toBe('Email is required');
  });

  it('должен работать с множественными ошибками', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
      result.current.handleFieldValidation('password', 'Password too short');
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.errors.password).toBe('Password too short');
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('должен сбрасывать все ошибки через resetErrors', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
      result.current.handleFieldValidation('password', 'Password too short');
    });

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

    act(() => {
      result.current.resetErrors();
    });

    expect(result.current.errors).toEqual({});
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  it('должен получать ошибку поля через getFieldError', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
    });

    expect(result.current.getFieldError('email')).toBe('Invalid email');
    expect(result.current.getFieldError('password')).toBeUndefined();
  });

  it('должен устанавливать множественные ошибки через setMultipleErrors', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.setMultipleErrors({
        email: 'Invalid email',
        password: 'Password too short',
      });
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.errors.password).toBe('Password too short');
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('должен очищать ошибку поля через clearFieldError', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
      result.current.handleFieldValidation('password', 'Password too short');
    });

    act(() => {
      result.current.clearFieldError('email');
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBe('Password too short');
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('должен объединять ошибки при setMultipleErrors', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.handleFieldValidation('email', 'Invalid email');
    });

    act(() => {
      result.current.setMultipleErrors({
        password: 'Password too short',
        username: 'Username required',
      });
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.errors.password).toBe('Password too short');
    expect(result.current.errors.username).toBe('Username required');
  });

  it('не должен изменять состояние при удалении несуществующей ошибки', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    const initialErrors = result.current.errors;

    act(() => {
      result.current.handleFieldValidation('email', undefined);
    });

    expect(result.current.errors).toBe(initialErrors);
  });

  it('должен устанавливать ошибки напрямую через setErrors', () => {
    const { result } = renderHook(() => useFormValidation<ITestFormErrors>());

    act(() => {
      result.current.setErrors({
        email: 'Error 1',
        password: 'Error 2',
      });
    });

    expect(result.current.errors.email).toBe('Error 1');
    expect(result.current.errors.password).toBe('Error 2');
  });
});
