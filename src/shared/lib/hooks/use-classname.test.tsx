import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClassName } from '@shared/lib';
import { ParentClassProvider } from '../context';
import type { FC, PropsWithChildren } from 'react';

const createWrapper =
  (parentClass?: string): FC<PropsWithChildren> =>
  ({ children }) => {
    if (parentClass) {
      return (
        <ParentClassProvider parentClass={parentClass}>
          {children}
        </ParentClassProvider>
      );
    }

    return <>{children}</>;
  };

describe('useClassName', () => {
  it('должен генерировать базовый className без modifiers', () => {
    const { result } = renderHook(
      () => useClassName({ blockName: 'test-block' }),
      { wrapper: createWrapper() }
    );

    expect(result.current).toBe('test-block');
  });

  it('должен генерировать className с модификаторами', () => {
    const { result } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          modifiers: ['active', 'large'],
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current).toContain('test-block');
    expect(result.current).toContain('test-block_active');
    expect(result.current).toContain('test-block_large');
  });

  it('должен использовать parentClass из контекста', () => {
    const { result } = renderHook(
      () => useClassName({ blockName: 'test-block' }),
      { wrapper: createWrapper('parent-block') }
    );

    expect(result.current).toContain('test-block');
    expect(result.current).toContain('parent-block__test-block');
  });

  it('должен генерировать className с parentClass и модификаторами', () => {
    const { result } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          modifiers: ['active'],
        }),
      { wrapper: createWrapper('parent-block') }
    );

    expect(result.current).toContain('test-block');
    expect(result.current).toContain('test-block_active');
    expect(result.current).toContain('parent-block__test-block');
  });

  it('должен работать с пустыми модификаторами', () => {
    const { result } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          modifiers: [],
        }),
      { wrapper: createWrapper('parent-block') }
    );

    expect(result.current).toContain('test-block');
    expect(result.current).toContain('parent-block__test-block');
  });

  it('должен поддерживать elementName', () => {
    const { result } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          elementName: 'title',
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current).toBe('test-block');
  });

  it('должен генерировать className с parentClass и elementName', () => {
    const { result } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          elementName: 'title',
        }),
      { wrapper: createWrapper('parent-block') }
    );

    expect(result.current).toContain('test-block');
    expect(result.current).toContain('parent-block__title');
  });

  it('должен поддерживать additionalClasses', () => {
    const { result } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          additionalClasses: ['extra-class'],
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current).toContain('test-block');
    expect(result.current).toContain('extra-class');
  });

  it('должен мемоизировать результат', () => {
    const { result, rerender } = renderHook(
      () =>
        useClassName({
          blockName: 'test-block',
          modifiers: ['active'],
        }),
      { wrapper: createWrapper('parent') }
    );

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });
});
