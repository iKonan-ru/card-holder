import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PasswordVisibilityToggle } from './password-visibility-toggle';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const MOCK_ARIA_LABEL = 'Toggle password visibility';
const MOCK_ON_CLICK = vi.fn();

describe('PasswordVisibilityToggle', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const button = screen.getByRole('button', { name: MOCK_ARIA_LABEL });

    expect(button).toBeInTheDocument();
  });

  it('должен вызывать onClick при клике', async () => {
    const user = userEvent.setup();

    render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const button = screen.getByRole('button', { name: MOCK_ARIA_LABEL });

    await user.click(button);

    expect(MOCK_ON_CLICK).toHaveBeenCalledTimes(1);
  });

  it('должен отображать переданную иконку', () => {
    const { container } = render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('должен отображать другую иконку при изменении Icon', () => {
    const { container, rerender } = render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const firstIcon = container.querySelector('svg');

    expect(firstIcon).toBeInTheDocument();

    rerender(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEyeOff}
      />
    );

    const secondIcon = container.querySelector('svg');

    expect(secondIcon).toBeInTheDocument();
  });

  it('должен иметь правильный aria-label', () => {
    render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const button = screen.getByRole('button', { name: MOCK_ARIA_LABEL });

    expect(button).toHaveAttribute('aria-label', MOCK_ARIA_LABEL);
  });

  it('должен иметь tabIndex = -1', () => {
    render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const button = screen.getByRole('button', { name: MOCK_ARIA_LABEL });

    expect(button).toHaveAttribute('tabIndex', '-1');
  });

  it('должен иметь правильный тип кнопки', () => {
    render(
      <PasswordVisibilityToggle
        onClick={MOCK_ON_CLICK}
        ariaLabel={MOCK_ARIA_LABEL}
        Icon={FiEye}
      />
    );

    const button = screen.getByRole('button', { name: MOCK_ARIA_LABEL });

    expect(button).toHaveAttribute('type', 'button');
  });
});
