import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { IconType } from 'react-icons';
import { ParentClassProvider } from '@shared/lib';
import { FabButton } from './fab-button';
import { FAB_BUTTON_BLOCK } from './lib';

const MockIcon: IconType = ({ className, 'aria-hidden': ariaHidden }) => (
  <span
    className={className}
    data-testid="mock-icon"
    aria-hidden={ariaHidden}
  >
    Icon
  </span>
);

describe('FabButton', () => {
  it('должен отрисовываться', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button).toBeInTheDocument();
  });

  it('должен отображать иконку', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
      />
    );

    const icon = screen.getByTestId('mock-icon');

    expect(icon).toBeInTheDocument();
  });

  it('должен вызывать onClick при клике', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должен устанавливать aria-label', () => {
    const ariaLabel = 'Export cards';

    render(
      <FabButton
        icon={MockIcon}
        ariaLabel={ariaLabel}
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    expect(button).toHaveAttribute('aria-label', ariaLabel);
  });

  it('должен устанавливать title', () => {
    const title = 'Export cards';

    render(
      <FabButton
        icon={MockIcon}
        ariaLabel={title}
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: title });

    expect(button).toHaveAttribute('title', title);
  });

  it('должен быть отключен когда disabled=true', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button).toBeDisabled();
  });

  it('не должен вызывать onClick когда disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={handleClick}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('должен добавлять модификатор active', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
        isActive={true}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button.className).toContain('active');
  });

  it('должен добавлять модификатор disabled', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button.className).toContain('disabled');
  });

  it('должен устанавливать aria-pressed', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
        ariaPressed={true}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('должен использовать правильный базовый класс', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button.className).toContain(FAB_BUTTON_BLOCK);
  });

  it('должен добавлять parentClass из контекста', () => {
    const parentClass = 'custom-parent-class';

    render(
      <ParentClassProvider parentClass={parentClass}>
        <FabButton
          icon={MockIcon}
          ariaLabel="Test button"
          onClick={vi.fn()}
        />
      </ParentClassProvider>
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button.className).toContain(parentClass);
  });

  it('должен быть типа button', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: 'Test button' });

    expect(button).toHaveAttribute('type', 'button');
  });

  it('должен добавлять класс иконки', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
      />
    );

    const icon = screen.getByTestId('mock-icon');

    expect(icon.className).toContain(`${FAB_BUTTON_BLOCK}__icon`);
  });

  it('иконка должна иметь aria-hidden', () => {
    render(
      <FabButton
        icon={MockIcon}
        ariaLabel="Test button"
        onClick={vi.fn()}
      />
    );

    const icon = screen.getByTestId('mock-icon');

    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
