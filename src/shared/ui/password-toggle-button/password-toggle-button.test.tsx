import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { describe, expect, it, vi } from 'vitest';
import { PasswordToggleButton } from './password-toggle-button';

describe('PasswordToggleButton', () => {
  it('должен рендериться с иконкой', () => {
    render(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('должен иметь правильный aria-label', () => {
    const ariaLabel = 'Показать пароль';

    render(
      <PasswordToggleButton
        ariaLabel={ariaLabel}
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', ariaLabel);
  });

  it('должен иметь type="button"', () => {
    render(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('должен иметь tabIndex={-1}', () => {
    render(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '-1');
  });

  it('должен вызывать onToggle при клике', async () => {
    const handleToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={handleToggle}
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('должен отображать переданную иконку', () => {
    render(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('должен отображать другую иконку при изменении Icon', () => {
    const { rerender } = render(
      <PasswordToggleButton
        ariaLabel="Скрыть пароль"
        Icon={FiEyeOff}
        onToggle={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();

    rerender(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const updatedIcon = button.querySelector('svg');
    expect(updatedIcon).toBeInTheDocument();
  });

  it('должен применять правильные CSS классы', () => {
    const { container } = render(
      <PasswordToggleButton
        ariaLabel="Показать пароль"
        Icon={FiEye}
        onToggle={vi.fn()}
      />
    );

    const button = container.querySelector('.password-toggle-button');
    expect(button).toBeInTheDocument();

    const icon = container.querySelector('.password-toggle-button__icon');
    expect(icon).toBeInTheDocument();
  });
});
