import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './app';

vi.mock('@pages/main-page', () => ({
  MainPage: () => <div data-testid="main-page">MainPage Component</div>,
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
});
