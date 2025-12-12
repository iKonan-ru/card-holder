import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PWA_BUTTON_ARIA_LABEL, PWA_BUTTON_TEXT } from '../constants';
import * as hooks from '../hooks';
import { PWAButton } from './pwa-button';

vi.mock('../hooks', async () => {
  const actual = await vi.importActual('../hooks');

  return {
    ...actual,
    usePWAInstall: vi.fn(),
  };
});

describe('PWAButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('должна рендериться когда canInstall true и isInstalled false', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(
      screen.getByRole('button', { name: PWA_BUTTON_ARIA_LABEL }),
    ).toBeInTheDocument();
    expect(screen.getByText(PWA_BUTTON_TEXT)).toBeInTheDocument();
  });

  it('не должна рендериться когда canInstall false', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: false,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(
      screen.queryByRole('button', { name: PWA_BUTTON_ARIA_LABEL }),
    ).not.toBeInTheDocument();
  });

  it('не должна рендериться когда isInstalled true', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: true,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(
      screen.queryByRole('button', { name: PWA_BUTTON_ARIA_LABEL }),
    ).not.toBeInTheDocument();
  });

  it('не должна рендериться когда canInstall false и isInstalled true', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: false,
      isInstalled: true,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(
      screen.queryByRole('button', { name: PWA_BUTTON_ARIA_LABEL }),
    ).not.toBeInTheDocument();
  });

  it('должна вызывать handleInstall при клике', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    const button = screen.getByRole('button', { name: PWA_BUTTON_ARIA_LABEL });
    fireEvent.click(button);

    expect(handleInstallMock).toHaveBeenCalledTimes(1);
  });

  it('должна иметь корректный className', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    const button = screen.getByRole('button', { name: PWA_BUTTON_ARIA_LABEL });
    expect(button).toHaveClass('pwa-button');
    expect(button).toHaveClass('pwa-button_primary');
  });

  it('должна иметь корректный aria-label', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    const button = screen.getByRole('button', { name: PWA_BUTTON_ARIA_LABEL });
    expect(button).toHaveAttribute('aria-label', PWA_BUTTON_ARIA_LABEL);
  });

  it('должна иметь иконку с aria-hidden', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(hooks.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    const icon = screen
      .getByRole('button', { name: PWA_BUTTON_ARIA_LABEL })
      .querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
