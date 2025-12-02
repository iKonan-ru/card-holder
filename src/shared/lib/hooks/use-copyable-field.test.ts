import { type KeyboardEvent, type MouseEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as utils from '../utils';
import { useCopyableField } from './use-copyable-field';

vi.mock('../utils', () => ({
  copyToClipboard: vi.fn(),
  logError: vi.fn(),
}));

const TEST_VALUE = 'test-value';
const TEST_LABEL = 'Test Label';
const TEST_TITLE = 'Test Title';

describe('useCopyableField', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен инициализироваться с isCopied = false', () => {
    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    expect(result.current.isCopied).toBe(false);
  });

  it('должен возвращать displayValue равный value', () => {
    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    expect(result.current.displayValue).toBe(TEST_VALUE);
  });

  it('должен формировать ariaLabel с дефолтным title', () => {
    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    expect(result.current.ariaLabel).toBe(
      `Кликните для копирования: ${TEST_VALUE}`
    );
  });

  it('должен формировать ariaLabel с кастомным title', () => {
    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
        title: TEST_TITLE,
      })
    );

    expect(result.current.ariaLabel).toBe(`${TEST_TITLE}: ${TEST_VALUE}`);
  });

  it('должен формировать ariaLabel с label если он передан', () => {
    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
        label: TEST_LABEL,
      })
    );

    expect(result.current.ariaLabel).toContain(TEST_LABEL);
  });

  it('должен использовать maskFn для displayValue', () => {
    const maskFn = (value: string) => `masked-${value}`;

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
        maskFn,
      })
    );

    expect(result.current.displayValue).toBe(`masked-${TEST_VALUE}`);
  });

  it('должен вызывать copyToClipboard с правильным значением', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(copyMock).toHaveBeenCalledWith(TEST_VALUE);
  });

  it('должен устанавливать isCopied в true после успешного копирования', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(result.current.isCopied).toBe(true);
  });

  it('должен сбрасывать isCopied после таймаута', async () => {
    vi.useFakeTimers();
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isCopied).toBe(false);
    vi.useRealTimers();
  });

  it('должен передавать revealed=true в maskFn после копирования', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);
    const maskFn = vi.fn((value: string, revealed: boolean) =>
      revealed ? value : `masked-${value}`
    );

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
        maskFn,
      })
    );

    expect(maskFn).toHaveBeenCalledWith(TEST_VALUE, false);

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(result.current.isCopied).toBe(true);

    const displayValue = result.current.displayValue;
    expect(maskFn).toHaveBeenCalledWith(TEST_VALUE, true);
    expect(displayValue).toBe(TEST_VALUE);
  });

  it('должен останавливать всплытие события в handleClick', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);
    const stopPropagationMock = vi.fn();

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleClick({
        stopPropagation: stopPropagationMock,
      } as unknown as MouseEvent);
    });

    expect(stopPropagationMock).toHaveBeenCalled();
  });

  it('должен обрабатывать ошибку копирования', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    const logErrorMock = vi.mocked(utils.logError);
    const errorMessage = 'Copy failed';
    copyMock.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(logErrorMock).toHaveBeenCalled();
    expect(result.current.isCopied).toBe(false);
  });

  it('должен обрабатывать нажатие Enter в handleKeyDown', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);
    const preventDefaultMock = vi.fn();

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleKeyDown({
        key: 'Enter',
        preventDefault: preventDefaultMock,
      } as unknown as KeyboardEvent<HTMLDivElement>);
    });

    expect(preventDefaultMock).toHaveBeenCalled();
    expect(copyMock).toHaveBeenCalledWith(TEST_VALUE);
  });

  it('должен обрабатывать нажатие пробела в handleKeyDown', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);
    const preventDefaultMock = vi.fn();

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleKeyDown({
        key: ' ',
        preventDefault: preventDefaultMock,
      } as unknown as KeyboardEvent<HTMLDivElement>);
    });

    expect(preventDefaultMock).toHaveBeenCalled();
    expect(copyMock).toHaveBeenCalledWith(TEST_VALUE);
  });

  it('не должен обрабатывать другие клавиши в handleKeyDown', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);
    const preventDefaultMock = vi.fn();

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleKeyDown({
        key: 'Escape',
        preventDefault: preventDefaultMock,
      } as unknown as KeyboardEvent<HTMLDivElement>);
    });

    expect(preventDefaultMock).not.toHaveBeenCalled();
    expect(copyMock).not.toHaveBeenCalled();
  });

  it('должен очищать предыдущий таймаут при повторном копировании', async () => {
    const copyMock = vi.mocked(utils.copyToClipboard);
    copyMock.mockResolvedValue(undefined);
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { result } = renderHook(() =>
      useCopyableField({
        value: TEST_VALUE,
      })
    );

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(result.current.isCopied).toBe(true);

    await act(async () => {
      result.current.handleClick({
        stopPropagation: vi.fn(),
      } as unknown as MouseEvent);
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('должен перевычислять ariaLabel при изменении value', () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useCopyableField({
          value,
        }),
      { initialProps: { value: TEST_VALUE } }
    );

    const initialAriaLabel = result.current.ariaLabel;

    rerender({ value: 'new-value' });

    expect(result.current.ariaLabel).not.toBe(initialAriaLabel);
    expect(result.current.ariaLabel).toContain('new-value');
  });

  it('должен перевычислять ariaLabel при изменении label', () => {
    const { result, rerender } = renderHook(
      ({ label }) =>
        useCopyableField({
          value: TEST_VALUE,
          label,
        }),
      { initialProps: { label: TEST_LABEL } }
    );

    const initialAriaLabel = result.current.ariaLabel;

    rerender({ label: 'New Label' });

    expect(result.current.ariaLabel).not.toBe(initialAriaLabel);
    expect(result.current.ariaLabel).toContain('New Label');
  });
});
