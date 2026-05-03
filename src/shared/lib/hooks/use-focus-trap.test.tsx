import { useRef } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFocusTrap } from './use-focus-trap';

const TestComponent = ({ isTopModal }: { isTopModal: boolean }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ contentRef, isTopModal });

  return (
    <div ref={contentRef}>
      <button>First Button</button>
      <button>Second Button</button>
      <button>Third Button</button>
    </div>
  );
};

describe('useFocusTrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен устанавливать фокус на первый элемент когда isTopModal = true', () => {
    render(<TestComponent isTopModal={true} />);

    const firstButton = screen.getByText('First Button');

    expect(firstButton).toHaveFocus();
  });

  it('не должен устанавливать фокус когда isTopModal = false', () => {
    render(<TestComponent isTopModal={false} />);

    const firstButton = screen.getByText('First Button');

    expect(firstButton).not.toHaveFocus();
  });

  it('не должен устанавливать фокус когда contentRef.current = null', () => {
    const contentRef = { current: null };

    renderHook(() => useFocusTrap({ contentRef, isTopModal: true }));

    expect(contentRef.current).toBeNull();
  });

  it('должен управлять фокусом с помощью Tab', async () => {
    const user = userEvent.setup();

    render(<TestComponent isTopModal={true} />);

    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');
    const thirdButton = screen.getByText('Third Button');

    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(secondButton).toHaveFocus();

    await user.tab();
    expect(thirdButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();
  });

  it('должен управлять фокусом с помощью Shift+Tab', async () => {
    const user = userEvent.setup();

    render(<TestComponent isTopModal={true} />);

    const firstButton = screen.getByText('First Button');
    const thirdButton = screen.getByText('Third Button');

    expect(firstButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(thirdButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByText('Second Button')).toHaveFocus();
  });

  it('не должен обрабатывать другие клавиши', async () => {
    const user = userEvent.setup();

    render(<TestComponent isTopModal={true} />);

    const firstButton = screen.getByText('First Button');

    expect(firstButton).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(firstButton).toHaveFocus();
  });

  it('не должен устанавливать фокус если нет фокусируемых элементов', () => {
    const TestComponentWithoutFocusable = ({
      isTopModal,
    }: {
      isTopModal: boolean;
    }) => {
      const contentRef = useRef<HTMLDivElement>(null);

      useFocusTrap({ contentRef, isTopModal });

      return (
        <div ref={contentRef}>
          <div>No focusable elements</div>
        </div>
      );
    };

    render(<TestComponentWithoutFocusable isTopModal={true} />);

    const div = screen.getByText('No focusable elements');

    expect(div).not.toHaveFocus();
  });

  it('должен удалять обработчик keydown при анмаунте', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<TestComponent isTopModal={true} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });

  it('должен удалять обработчик при смене isTopModal с true на false', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { rerender } = render(<TestComponent isTopModal={true} />);
    rerender(<TestComponent isTopModal={false} />);

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });
});
