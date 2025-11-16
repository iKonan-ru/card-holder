import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import { useModalClosingState } from './use-modal-closing-state';
import { useRef } from 'react';

const FADE_OUT_MODAL_ANIMATION_NAME = 'fadeOutModal';

const TestComponent = ({ onClose }: { onClose: () => void }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { isClosing, handleClose } = useModalClosingState(onClose, overlayRef);

  return (
    <div
      ref={overlayRef}
      data-testid="overlay"
      data-closing={isClosing}
    >
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

describe('useModalClosingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен возвращать isClosing = false изначально', () => {
    const mockOnClose = vi.fn();
    const overlayRef = { current: null };

    const { result } = renderHook(() =>
      useModalClosingState(mockOnClose, overlayRef)
    );

    expect(result.current.isClosing).toBe(false);
  });

  it('должен устанавливать isClosing = true при вызове handleClose', () => {
    const mockOnClose = vi.fn();
    const overlayRef = { current: document.createElement('div') };

    const { result } = renderHook(() =>
      useModalClosingState(mockOnClose, overlayRef)
    );

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isClosing).toBe(true);
  });

  it('не должен вызывать onClose сразу после handleClose', () => {
    const mockOnClose = vi.fn();
    const overlayRef = { current: null };

    const { result } = renderHook(() =>
      useModalClosingState(mockOnClose, overlayRef)
    );

    act(() => {
      result.current.handleClose();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('должен вызывать onClose после завершения анимации', async () => {
    const mockOnClose = vi.fn();

    const { container } = render(<TestComponent onClose={mockOnClose} />);

    const overlay = container.querySelector('[data-testid="overlay"]');
    const closeButton = container.querySelector('button');

    if (closeButton && overlay) {
      act(() => {
        closeButton.click();
      });

      await waitFor(() => {
        expect(
          container.querySelector('[data-closing="true"]')
        ).toBeInTheDocument();
      });

      const animationEndEvent = new Event('animationend', {
        bubbles: true,
        cancelable: false,
      }) as AnimationEvent;

      Object.defineProperty(animationEndEvent, 'animationName', {
        value: FADE_OUT_MODAL_ANIMATION_NAME,
        writable: false,
      });

      act(() => {
        overlay.dispatchEvent(animationEndEvent);
      });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    }
  });

  it('не должен вызывать onClose если animationName не совпадает', async () => {
    const mockOnClose = vi.fn();

    const { container } = render(<TestComponent onClose={mockOnClose} />);

    const overlay = container.querySelector('[data-testid="overlay"]');
    const closeButton = container.querySelector('button');

    if (closeButton && overlay) {
      act(() => {
        closeButton.click();
      });

      await waitFor(() => {
        expect(
          container.querySelector('[data-closing="true"]')
        ).toBeInTheDocument();
      });

      const animationEndEvent = new Event('animationend', {
        bubbles: true,
        cancelable: false,
      }) as AnimationEvent;

      Object.defineProperty(animationEndEvent, 'animationName', {
        value: 'otherAnimation',
        writable: false,
      });

      act(() => {
        overlay.dispatchEvent(animationEndEvent);
      });

      await waitFor(() => {
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    }
  });

  it('не должен вызывать onClose если overlayRef.current = null', () => {
    const mockOnClose = vi.fn();
    const overlayRef = { current: null };

    const { result } = renderHook(() =>
      useModalClosingState(mockOnClose, overlayRef)
    );

    act(() => {
      result.current.handleClose();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('не должен устанавливать isClosing дважды', () => {
    const mockOnClose = vi.fn();
    const overlayRef = { current: document.createElement('div') };

    const { result } = renderHook(() =>
      useModalClosingState(mockOnClose, overlayRef)
    );

    act(() => {
      result.current.handleClose();
    });

    const firstIsClosing = result.current.isClosing;

    act(() => {
      result.current.handleClose();
    });

    const secondIsClosing = result.current.isClosing;

    expect(firstIsClosing).toBe(true);
    expect(secondIsClosing).toBe(true);
  });
});
