import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDndSensors } from './use-dnd-sensors';

describe('useDndSensors', () => {
  it('должен возвращать массив сенсоров', () => {
    const { result } = renderHook(() => useDndSensors());

    expect(Array.isArray(result.current)).toBe(true);
  });

  it('должен возвращать 3 сенсора (Pointer, Touch, Keyboard)', () => {
    const { result } = renderHook(() => useDndSensors());

    expect(result.current).toHaveLength(3);
  });

  it('каждый сенсор должен иметь sensor объект', () => {
    const { result } = renderHook(() => useDndSensors());

    result.current.forEach((sensor) => {
      expect(sensor).toHaveProperty('sensor');
    });
  });
});
