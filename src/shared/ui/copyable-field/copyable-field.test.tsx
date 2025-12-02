import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentClassProvider } from '@shared/lib';
import { CopyableField } from './copyable-field';

const TEST_VALUE = 'test-value';
const TEST_PARENT_CLASS = 'parent-class';
const TEST_LABEL = 'Test Label';
const TEST_TITLE = 'Test Title';

describe('CopyableField', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('должна рендериться с базовыми пропсами', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    expect(screen.getByText(TEST_VALUE)).toBeInTheDocument();
  });

  it('должна отображать label если он передан', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          label={TEST_LABEL}
        />
      </ParentClassProvider>
    );

    expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
  });

  it('должна не отображать label если он не передан', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    expect(screen.queryByText(TEST_LABEL)).not.toBeInTheDocument();
  });

  it('должна использовать кастомный title', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          title={TEST_TITLE}
        />
      </ParentClassProvider>
    );

    const element = screen.getByTitle(TEST_TITLE);
    expect(element).toBeInTheDocument();
  });

  it('должна использовать maskFn для отображения значения', () => {
    const maskFn = (value: string) => `masked-${value}`;

    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField
          value={TEST_VALUE}
          maskFn={maskFn}
        />
      </ParentClassProvider>
    );

    expect(screen.getByText(`masked-${TEST_VALUE}`)).toBeInTheDocument();
  });

  it('должна применять правильные CSS классы', () => {
    const { container } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = container.querySelector('.copyable-field');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('parent-class__copyable-field');
  });

  it('должна иметь правильные атрибуты для доступности', () => {
    render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('tabIndex', '0');
    expect(element).toHaveAttribute('aria-label');
  });

  it('должна отображать индикатор копирования после клика', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ParentClassProvider parentClass={TEST_PARENT_CLASS}>
        <CopyableField value={TEST_VALUE} />
      </ParentClassProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    const indicator = container.querySelector('.copyable-field__indicator');
    expect(indicator).toBeInTheDocument();
  });
});
