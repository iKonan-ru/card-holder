import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { ModalProvider } from '@shared/lib';
import { AppContent } from './app-content';

vi.mock('@pages/main-page', () => ({
  MainPage: () => <div data-testid="main-page">MainPage</div>,
}));

vi.mock('@shared/ui', () => ({
  ModalContainer: () => <div data-testid="modal-container">ModalContainer</div>,
}));

vi.mock('@features/error-handling', () => ({
  ErrorHandlerProvider: ({ children }: PropsWithChildren) => (
    <div data-testid="error-handler-provider">{children}</div>
  ),
}));

const { mockUseAppUpdateModal } = vi.hoisted(() => ({
  mockUseAppUpdateModal: vi.fn(),
}));

vi.mock('../../lib', () => ({
  useAppUpdateModal: () => {
    mockUseAppUpdateModal();
  },
}));

const TestWrapper = ({ children }: PropsWithChildren) => {
  return <ModalProvider>{children}</ModalProvider>;
};

describe('AppContent', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(<AppContent />, { wrapper: TestWrapper });

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('должен рендерить MainPage', () => {
    render(<AppContent />, { wrapper: TestWrapper });

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('должен рендерить ModalContainer', () => {
    render(<AppContent />, { wrapper: TestWrapper });

    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
  });

  it('должен рендерить ErrorHandlerProvider', () => {
    render(<AppContent />, { wrapper: TestWrapper });

    expect(screen.getByTestId('error-handler-provider')).toBeInTheDocument();
  });

  it('должен вызывать useAppUpdateModal', () => {
    render(<AppContent />, { wrapper: TestWrapper });

    expect(mockUseAppUpdateModal).toHaveBeenCalled();
  });

  it('должен оборачивать MainPage и ModalContainer в ErrorHandlerProvider', () => {
    render(<AppContent />, { wrapper: TestWrapper });

    const errorHandler = screen.getByTestId('error-handler-provider');
    const mainPage = screen.getByTestId('main-page');
    const modalContainer = screen.getByTestId('modal-container');

    expect(errorHandler).toContainElement(mainPage);
    expect(errorHandler).toContainElement(modalContainer);
  });
});
