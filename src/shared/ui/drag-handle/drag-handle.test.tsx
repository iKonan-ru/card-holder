import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DragHandle } from './drag-handle';
import { DRAG_HANDLE_ARIA_LABEL, DRAG_HANDLE_BLOCK } from './lib';

describe('DragHandle', () => {
  afterEach(() => {
    cleanup();
  });

  it('должна рендериться', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).toBeInTheDocument();
  });

  it('должна иметь корректный aria-label', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).toHaveAttribute('aria-label', DRAG_HANDLE_ARIA_LABEL);
  });

  it('должна иметь корректный тип button', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('должна применять базовый класс', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).toHaveClass(DRAG_HANDLE_BLOCK);
  });

  it('должна применять модификатор visible когда isVisible=true', () => {
    render(<DragHandle isVisible={true} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).toHaveClass(`${DRAG_HANDLE_BLOCK}_visible`);
  });

  it('не должна применять модификатор visible когда isVisible=false', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).not.toHaveClass(`${DRAG_HANDLE_BLOCK}_visible`);
  });

  it('должна передавать дополнительные пропсы', () => {
    const testId = 'test-drag-handle';
    render(
      <DragHandle
        isVisible={false}
        data-testid={testId}
      />
    );

    const button = screen.getByTestId(testId);
    expect(button).toBeInTheDocument();
  });

  it('должна поддерживать onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <DragHandle
        isVisible={false}
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должна поддерживать disabled', () => {
    render(
      <DragHandle
        isVisible={false}
        disabled
      />
    );

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).toBeDisabled();
  });

  it('не должна вызывать onClick когда disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <DragHandle
        isVisible={false}
        onClick={handleClick}
        disabled
      />
    );

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('должна рендерить иконку', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    const icon = button.querySelector(`.${DRAG_HANDLE_BLOCK}__icon`);
    expect(icon).toBeInTheDocument();
  });

  it('иконка должна иметь aria-hidden', () => {
    render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    const icon = button.querySelector(`.${DRAG_HANDLE_BLOCK}__icon`);
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('должна поддерживать ref', () => {
    const ref = vi.fn();

    render(
      <DragHandle
        isVisible={false}
        ref={ref}
      />
    );

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
  });

  it('должна корректно переключать видимость', () => {
    const { rerender } = render(<DragHandle isVisible={false} />);

    const button = screen.getByRole('button', {
      name: DRAG_HANDLE_ARIA_LABEL,
    });
    expect(button).not.toHaveClass(`${DRAG_HANDLE_BLOCK}_visible`);

    rerender(<DragHandle isVisible={true} />);
    expect(button).toHaveClass(`${DRAG_HANDLE_BLOCK}_visible`);
  });
});
