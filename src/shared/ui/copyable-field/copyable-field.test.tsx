import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ParentClassProvider } from '@shared/lib';
import { CopyableField } from './copyable-field';

const TEST_VALUE = 'test-value';
const TEST_PARENT_CLASS = 'parent-class';
const TEST_LABEL = 'Test Label';
const TEST_TITLE = 'Test Title';

const originalError = console.error;

describe('CopyableField', () => {
  let clipboardWriteTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    clipboardWriteTextMock = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: clipboardWriteTextMock,
      },
      writable: true,
      configurable: true,
    });

    console.error = (...args: unknown[]) => {
      const message = String(args[0]);
      if (message.includes('not wrapped in act')) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
    console.error = originalError;
  });

  it('должна рендериться с базовыми пропсами', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    expect(screen.getByText(TEST_VALUE)).toBeInTheDocument();
  });

  it('должна отображать label если он передан', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          label={TEST_LABEL}
        />
      </ParentClassProvider>
    );

    expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
  });

  it('должна не отображать label если он не передан', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    expect(screen.queryByText(TEST_LABEL)).not.toBeInTheDocument();
  });

  it('должна использовать кастомный title', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          title={TEST_TITLE}
        />
      </ParentClassProvider>
    );

    const element = screen.getByTitle(TEST_TITLE);
    expect(element).toBeInTheDocument();
  });

  it('должна копировать значение при клике', async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.click(element);

    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith(TEST_VALUE);
    });
  });

  it('должна отображать индикатор копирования после успешного копирования', async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.click(element);

    await vi.waitFor(() => {
      const indicator = document.querySelector('.copyable-field__indicator');
      expect(indicator).toBeInTheDocument();
    });
  });

  it('должна использовать maskFn для отображения значения', () => {
    const maskFn = (value: string) => `masked-${value}`;

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          maskFn={maskFn}
        />
      </ParentClassProvider>
    );

    expect(screen.getByText(`masked-${TEST_VALUE}`)).toBeInTheDocument();
  });

  it('должна передавать showValue в maskFn после копирования', async () => {
    const maskFn = vi.fn((value: string, showValue?: boolean) => {
      return showValue ? value : `masked-${value}`;
    });
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          maskFn={maskFn}
        />
      </ParentClassProvider>
    );

    const element = screen.getByText(`masked-${TEST_VALUE}`);
    fireEvent.click(element);

    await vi.waitFor(() => {
      expect(maskFn).toHaveBeenCalledWith(TEST_VALUE, true);
    });
  });

  it('должна останавливать всплытие события при клике', async () => {
    const onContainerClick = vi.fn();
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <div onClick={onContainerClick}>
        <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
          <CopyableField value={TEST_VALUE} />
        </ParentClassProvider>
      </div>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.click(element);

    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalled();
    });

    expect(onContainerClick).not.toHaveBeenCalled();
  });

  it('должна обрабатывать ошибку копирования', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const errorMessage = 'Copy failed';
    clipboardWriteTextMock.mockRejectedValue(new Error(errorMessage));

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.click(element);

    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('должна очищать таймаут при размонтировании компонента', async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined);

    const { unmount } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.click(element);

    await vi.waitFor(() => {
      const indicator = document.querySelector('.copyable-field__indicator');
      expect(indicator).toBeInTheDocument();
    });

    unmount();

    const indicator = document.querySelector('.copyable-field__indicator');
    expect(indicator).not.toBeInTheDocument();
  });

  it('должна очищать предыдущий таймаут при множественных быстрых кликах', async () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);

    fireEvent.click(element);
    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(element);
    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(element);
    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledTimes(3);
    });

    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(0);

    clearTimeoutSpy.mockRestore();
  });

  it('должна копировать значение при нажатии Enter', async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.keyDown(element, { key: 'Enter' });

    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith(TEST_VALUE);
    });
  });

  it('должна копировать значение при нажатии пробела', async () => {
    clipboardWriteTextMock.mockResolvedValue(undefined);

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByText(TEST_VALUE);
    fireEvent.keyDown(element, { key: ' ' });

    await vi.waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith(TEST_VALUE);
    });
  });
});
