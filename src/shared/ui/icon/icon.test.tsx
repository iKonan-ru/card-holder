import { type FC } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Icon } from './icon';

const MockIconComponent: FC<{ className?: string }> = ({ className }) => (
  <svg
    data-testid="mock-icon"
    className={className}
  />
);

describe('Icon', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен рендериться с компонентом', () => {
    render(<Icon component={MockIconComponent} />);

    const icon = screen.getByTestId('mock-icon');

    expect(icon).toBeInTheDocument();
  });

  it('должен применять className из useClassName', () => {
    render(<Icon component={MockIconComponent} />);

    const icon = screen.getByTestId('mock-icon');

    expect(icon).toHaveClass('icon');
  });

  it('не должен рендериться без component', () => {
    const { container } = render(<Icon />);

    expect(container.firstChild).toBeNull();
  });
});
