import { render, renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Procedure } from '@shared/types';
import { useOverlayClick } from './use-overlay-click';

const TestComponent = ({
  onOverlayClick,
  isTopModal,
  preventClose = false,
}: {
  onOverlayClick: Procedure;
  isTopModal: boolean;
  preventClose?: boolean;
}) => {
  const {
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleContentClick,
    handleContentMouseDown,
  } = useOverlayClick({ onOverlayClick, isTopModal, preventClose });

  return (
    <div>
      <div
        data-testid="overlay"
        onMouseDown={handleOverlayMouseDown}
        onMouseUp={handleOverlayMouseUp}
      >
        <div
          data-testid="content"
          onClick={handleContentClick}
          onMouseDown={handleContentMouseDown}
        >
          Content
        </div>
      </div>
    </div>
  );
};

describe('useOverlayClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('должен возвращать обработчики событий', () => {
    const mockOnOverlayClick = vi.fn();

    const { result } = renderHook(() =>
      useOverlayClick({
        onOverlayClick: mockOnOverlayClick,
        isTopModal: true,
      }),
    );

    expect(result.current.handleOverlayMouseDown).toBeDefined();
    expect(result.current.handleOverlayMouseUp).toBeDefined();
    expect(result.current.handleContentClick).toBeDefined();
    expect(result.current.handleContentMouseDown).toBeDefined();
  });

  it('должен вызывать onOverlayClick при клике на overlay когда isTopModal = true', async () => {
    const mockOnOverlayClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TestComponent
        onOverlayClick={mockOnOverlayClick}
        isTopModal={true}
      />,
    );

    const overlay = screen.getByTestId('overlay');

    await user.click(overlay);

    expect(mockOnOverlayClick).toHaveBeenCalledTimes(1);
  });

  it('не должен вызывать onOverlayClick при клике на overlay когда isTopModal = false', async () => {
    const mockOnOverlayClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TestComponent
        onOverlayClick={mockOnOverlayClick}
        isTopModal={false}
      />,
    );

    const overlay = screen.getByTestId('overlay');

    await user.click(overlay);

    expect(mockOnOverlayClick).not.toHaveBeenCalled();
  });

  it('не должен вызывать onOverlayClick при клике на overlay когда preventClose = true', async () => {
    const mockOnOverlayClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TestComponent
        onOverlayClick={mockOnOverlayClick}
        isTopModal={true}
        preventClose={true}
      />,
    );

    const overlay = screen.getByTestId('overlay');

    await user.click(overlay);

    expect(mockOnOverlayClick).not.toHaveBeenCalled();
  });

  it('не должен вызывать onOverlayClick при клике на контент', async () => {
    const mockOnOverlayClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TestComponent
        onOverlayClick={mockOnOverlayClick}
        isTopModal={true}
      />,
    );

    const content = screen.getByTestId('content');

    await user.click(content);

    expect(mockOnOverlayClick).not.toHaveBeenCalled();
  });

  it('не должен вызывать onOverlayClick если mousedown был на контенте', () => {
    const mockOnOverlayClick = vi.fn();

    const { container } = render(
      <TestComponent
        onOverlayClick={mockOnOverlayClick}
        isTopModal={true}
      />,
    );

    const content = container.querySelector('[data-testid="content"]');
    const overlay = container.querySelector('[data-testid="overlay"]');

    if (content && overlay) {
      content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      overlay.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(mockOnOverlayClick).not.toHaveBeenCalled();
    }
  });

  it('должен останавливать всплытие события при клике на контент', async () => {
    const mockOnOverlayClick = vi.fn();
    const user = userEvent.setup();

    render(
      <TestComponent
        onOverlayClick={mockOnOverlayClick}
        isTopModal={true}
      />,
    );

    const content = screen.getByTestId('content');

    await user.click(content);

    expect(mockOnOverlayClick).not.toHaveBeenCalled();
  });
});
