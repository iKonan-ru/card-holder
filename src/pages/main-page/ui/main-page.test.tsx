import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MainPage } from './main-page';

vi.mock('@widgets/card-list', () => ({
  CardList: () => <div data-testid="card-list">CardList Component</div>,
}));

vi.mock('@features/pwa-button', () => ({
  PWAButton: () => <div data-testid="pwa-button">PWA Button</div>,
}));

describe('MainPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('должна рендериться', () => {
    render(<MainPage />);

    const mainPage = document.querySelector('.main-page');
    expect(mainPage).toBeInTheDocument();
  });

  it('должна содержать main элемент', () => {
    render(<MainPage />);

    const mainElement = document.querySelector('main.main-page');
    expect(mainElement).toBeInTheDocument();
  });

  it('должна содержать content блок', () => {
    render(<MainPage />);

    const contentElement = document.querySelector('.main-page__content');
    expect(contentElement).toBeInTheDocument();
  });

  it('должна содержать header блок', () => {
    render(<MainPage />);

    const headerElement = document.querySelector('.main-page__header');
    expect(headerElement).toBeInTheDocument();
  });

  it('должна рендерить CardList', () => {
    render(<MainPage />);

    expect(screen.getByTestId('card-list')).toBeInTheDocument();
  });

  it('должна иметь корректную структуру вложенности', () => {
    const { container } = render(<MainPage />);

    const mainPage = container.querySelector('main.main-page');
    const contentElement = mainPage?.querySelector('.main-page__content');
    const cardList = contentElement?.querySelector('[data-testid="card-list"]');

    expect(mainPage).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(cardList).toBeInTheDocument();
  });
});
