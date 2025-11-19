import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PWAButton } from './pwa-button';
import * as pwaButtonLib from '../lib';

vi.mock('../lib', async () => {
  const actual = await vi.importActual('../lib');

  return {
    ...actual,
    usePWAInstall: vi.fn(),
  };
});

const BUTTON_TEXT = 'Установить приложение';

describe('PWAButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('должна рендериться когда canInstall true и isInstalled false', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(pwaButtonLib.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(screen.getByText(BUTTON_TEXT)).toBeInTheDocument();
  });

  it('не должна рендериться когда canInstall false', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(pwaButtonLib.usePWAInstall).mockReturnValue({
      canInstall: false,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(screen.queryByText(BUTTON_TEXT)).not.toBeInTheDocument();
  });

  it('не должна рендериться когда isInstalled true', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(pwaButtonLib.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: true,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(screen.queryByText(BUTTON_TEXT)).not.toBeInTheDocument();
  });

  it('не должна рендериться когда canInstall false и isInstalled true', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(pwaButtonLib.usePWAInstall).mockReturnValue({
      canInstall: false,
      isInstalled: true,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    expect(screen.queryByText(BUTTON_TEXT)).not.toBeInTheDocument();
  });

  it('должна вызывать handleInstall при клике', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(pwaButtonLib.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    const button = screen.getByText(BUTTON_TEXT);
    fireEvent.click(button);

    expect(handleInstallMock).toHaveBeenCalledTimes(1);
  });

  it('должна иметь корректный className', () => {
    const handleInstallMock = vi.fn();

    vi.mocked(pwaButtonLib.usePWAInstall).mockReturnValue({
      canInstall: true,
      isInstalled: false,
      handleInstall: handleInstallMock,
    });

    render(<PWAButton />);

    const button = screen.getByText(BUTTON_TEXT);
    expect(button).toHaveClass('pwa-button');
    expect(button).toHaveClass('pwa-button_primary');
  });
});
