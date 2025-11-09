import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReorderToggleButton } from './reorder-toggle-button';

const TEST_PARENT_CLASS = 'test-parent';

describe('ReorderToggleButton', () => {
  afterEach(() => {
    cleanup();
  });

  it('должна рендериться с неактивным состоянием', () => {
    render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('должна рендериться с активным состоянием', () => {
    render(
      <ReorderToggleButton
        isActive={true}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('должна вызывать onClick при клике', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ReorderToggleButton
        isActive={false}
        onClick={handleClick}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должна отображать только иконку без текста', () => {
    const { container } = render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const icon = container.querySelector('.fab-button__icon');
    expect(icon).toBeInTheDocument();

    const text = container.querySelector('.fab-button__text');
    expect(text).not.toBeInTheDocument();
  });

  it('должна иметь класс active при isActive=true', () => {
    const { container } = render(
      <ReorderToggleButton
        isActive={true}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = container.querySelector('.fab-button_active');
    expect(button).toBeInTheDocument();
  });

  it('должна иметь правильный класс родителя', () => {
    const { container } = render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = container.querySelector('.test-parent__fab-button');
    expect(button).toBeInTheDocument();
  });

  it('не должна иметь класс active при isActive=false', () => {
    const { container } = render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = container.querySelector('.fab-button_active');
    expect(button).not.toBeInTheDocument();
  });

  it('должна иметь type="button"', () => {
    render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('должна иметь базовый класс блока', () => {
    const { container } = render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = container.querySelector('.fab-button');
    expect(button).toBeInTheDocument();
  });

  it('иконка должна иметь aria-hidden="true"', () => {
    const { container } = render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const icon = container.querySelector('.fab-button__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('должна переключать иконку при изменении isActive', () => {
    const { container, rerender } = render(
      <ReorderToggleButton
        isActive={false}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    let icon = container.querySelector('.fab-button__icon');
    expect(icon).toBeInTheDocument();

    rerender(
      <ReorderToggleButton
        isActive={true}
        onClick={vi.fn()}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    icon = container.querySelector('.fab-button__icon');
    expect(icon).toBeInTheDocument();
  });

  it('должна вызывать onClick при клике в активном состоянии', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ReorderToggleButton
        isActive={true}
        onClick={handleClick}
        parentClass={TEST_PARENT_CLASS}
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
