import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as utils from '@shared/lib/utils';
import { CopyButton } from './copy-button';

vi.mock('@shared/lib/utils', async () => {
  const actual = await vi.importActual('@shared/lib/utils');

  return {
    ...actual,
    copyToClipboard: vi.fn().mockResolvedValue(undefined),
    logError: vi.fn(),
  };
});

describe('CopyButton', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен быть disabled при пустом значении', () => {
    render(<CopyButton value="" />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('должен быть активным при непустом значении', () => {
    render(<CopyButton value="hello" />);

    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('должен оставаться disabled если передан disabled=true', () => {
    render(
      <CopyButton
        value="hello"
        disabled={true}
      />,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('должен копировать значение в буфер обмена при клике', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="copied-text" />);

    await user.click(screen.getByRole('button'));

    expect(utils.copyToClipboard).toHaveBeenCalledWith('copied-text');
  });
});
