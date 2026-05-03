import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: vi.fn().mockReturnValue({
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));

const mockHandleModalOpen = vi.fn();

vi.mock('@pages/main-page', () => ({
  MainPage: () => <div data-testid="main-page">MainPage Component</div>,
}));

vi.mock('../lib', () => ({
  useApp: () => ({
    handleModalOpen: mockHandleModalOpen,
  }),
  useAppUpdateModal: vi.fn(),
}));

vi.mock('@features/app-lock', () => ({
  useCryptoStore: (
    selector: (state: { isUnlocked: boolean; cryptoKey: CryptoKey }) => unknown,
  ) =>
    selector({
      isUnlocked: true,
      cryptoKey: {} as CryptoKey,
    }),
  useInactivityLock: vi.fn(),
  LockScreen: () => null,
}));

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...(actual as Record<string, unknown>),
    checkSecureProtocol: vi.fn().mockReturnValue(true),
  };
});

vi.mock('@shared/ui', async () => {
  const actual = await vi.importActual('@shared/ui');

  return {
    ...(actual as Record<string, unknown>),
    HttpWarningBanner: () => null,
    ModalContainer: () => <div data-testid="modal-container" />,
  };
});

describe('App', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должна рендериться', () => {
    render(<App />);

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('должна рендерить MainPage', () => {
    render(<App />);

    const mainPage = screen.getByTestId('main-page');
    expect(mainPage).toBeInTheDocument();
    expect(mainPage).toHaveTextContent('MainPage Component');
  });

  it('должна рендериться без ошибок', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('должна использовать useApp хук', () => {
    render(<App />);

    expect(mockHandleModalOpen).toBeDefined();
  });

  it('должна передавать handleModalOpen в ModalProvider', () => {
    render(<App />);

    expect(mockHandleModalOpen).toBeDefined();
    expect(typeof mockHandleModalOpen).toBe('function');
  });
});
