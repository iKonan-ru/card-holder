import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AddCardButton } from './add-card-button';
import { ADD_CARD_BUTTON_ARIA_LABEL } from './lib';
import { ParentClassProvider } from '@shared/lib';

const TEST_PARENT_CLASS = 'parent-class';

describe('AddCardButton', () => {
  afterEach(() => {
    cleanup();
  });

  it('должна рендериться', () => {
    const handleClick = vi.fn();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });
    expect(button).toBeInTheDocument();
  });

  it('должна иметь корректный aria-label', () => {
    const handleClick = vi.fn();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });
    expect(button).toHaveAttribute('aria-label', ADD_CARD_BUTTON_ARIA_LABEL);
  });

  it('должна иметь type="button"', () => {
    const handleClick = vi.fn();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('должна вызывать onClick при клике', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должна вызывать onClick при нажатии Enter', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });
    button.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должна вызывать onClick при нажатии Space', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });
    button.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должна отображать иконку с aria-hidden', () => {
    const handleClick = vi.fn();
    const { container } = render(<AddCardButton onClick={handleClick} />);

    const icon = container.querySelector('.add-card-button__icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('должна применять parentClass из контекста', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <AddCardButton onClick={handleClick} />
      </ParentClassProvider>
    );

    const button = container.querySelector(
      `.${TEST_PARENT_CLASS}__add-card-button`
    );
    expect(button).toBeInTheDocument();
  });

  it('должна иметь базовый класс add-card-button', () => {
    const handleClick = vi.fn();
    const { container } = render(<AddCardButton onClick={handleClick} />);

    const button = container.querySelector('.add-card-button');
    expect(button).toBeInTheDocument();
  });

  it('должна быть доступна для навигации с клавиатуры', () => {
    const handleClick = vi.fn();

    render(<AddCardButton onClick={handleClick} />);

    const button = screen.getByRole('button', {
      name: ADD_CARD_BUTTON_ARIA_LABEL,
    });

    expect(button).toHaveProperty('tabIndex', 0);
  });
});
