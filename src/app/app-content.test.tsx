import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AppContent } from './app-content';

vi.mock('@pages/main-page', () => ({
  MainPage: () => <div data-testid="main-page">MainPage</div>,
}));

vi.mock('@shared/ui', () => ({
  ModalContainer: () => <div data-testid="modal-container">ModalContainer</div>,
}));

vi.mock('@features/error-handling', () => ({
  ErrorHandlerProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-handler-provider">{children}</div>
  ),
}));

const mockUseAppUpdateModal = vi.fn();

vi.mock('./lib', () => ({
  useAppUpdateModal: () => mockUseAppUpdateModal(),
}));

describe('AppContent', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(<AppContent />);

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('должен рендерить MainPage', () => {
    render(<AppContent />);

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('должен рендерить ModalContainer', () => {
    render(<AppContent />);

    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
  });

  it('должен рендерить ErrorHandlerProvider', () => {
    render(<AppContent />);

    expect(screen.getByTestId('error-handler-provider')).toBeInTheDocument();
  });

  it('должен вызывать useAppUpdateModal', () => {
    render(<AppContent />);

    expect(mockUseAppUpdateModal).toHaveBeenCalled();
  });

  it('должен оборачивать MainPage и ModalContainer в ErrorHandlerProvider', () => {
    render(<AppContent />);

    const errorHandler = screen.getByTestId('error-handler-provider');
    const mainPage = screen.getByTestId('main-page');
    const modalContainer = screen.getByTestId('modal-container');

    expect(errorHandler).toContainElement(mainPage);
    expect(errorHandler).toContainElement(modalContainer);
  });
});
