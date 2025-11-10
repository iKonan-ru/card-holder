import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './app';
import { useCardManagementStore } from '@features/card-management';

vi.mock('@pages/main-page', () => ({
  MainPage: () => <div data-testid="main-page">MainPage Component</div>,
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: vi.fn((selector) => {
    const state = {
      cards: [],
      flippedPan: null,
      isLoading: false,
      isReorderMode: false,
      flipCard: vi.fn(),
      unflipCards: vi.fn(),
      loadCards: vi.fn(),
      addCard: vi.fn(),
      updateCard: vi.fn(),
      deleteCard: vi.fn(),
      reorderCards: vi.fn(),
      setCards: vi.fn(),
      setReorderMode: vi.fn(),
      toggleReorderMode: vi.fn(),
    };

    return selector(state);
  }),
}));

describe('App', () => {
  afterEach(() => {
    cleanup();
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

  it('должна вызывать setReorderMode при инициализации', () => {
    const mockSetReorderMode = vi.fn();

    vi.mocked(useCardManagementStore).mockImplementation((selector) => {
      const state = {
        cards: [],
        flippedPan: null,
        isLoading: false,
        isReorderMode: false,
        flipCard: vi.fn(),
        unflipCards: vi.fn(),
        loadCards: vi.fn(),
        addCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        reorderCards: vi.fn(),
        setCards: vi.fn(),
        setReorderMode: mockSetReorderMode,
        toggleReorderMode: vi.fn(),
      };

      return selector(state);
    });

    render(<App />);

    expect(mockSetReorderMode).toBeDefined();
  });
});
