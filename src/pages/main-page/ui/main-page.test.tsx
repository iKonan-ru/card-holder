import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MainPage } from './main-page';

vi.mock('@widgets/card-list', () => ({
  CardList: () => <div data-testid="card-list">CardList Component</div>,
}));

vi.mock('@widgets/action-buttons', () => ({
  ActionButtons: () => (
    <div data-testid="action-buttons">ActionButtons Component</div>
  ),
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

  it('должна рендерить CardList', () => {
    render(<MainPage />);

    expect(screen.getByTestId('card-list')).toBeInTheDocument();
  });

  it('должна рендерить ActionButtons', () => {
    render(<MainPage />);

    expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
  });

  it('должна иметь корректную структуру вложенности', () => {
    const { container } = render(<MainPage />);

    const mainPage = container.querySelector('main.main-page');
    const contentElement = mainPage?.querySelector('.main-page__content');
    const cardList = contentElement?.querySelector('[data-testid="card-list"]');
    const actionButtons = contentElement?.querySelector(
      '[data-testid="action-buttons"]',
    );

    expect(mainPage).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(cardList).toBeInTheDocument();
    expect(actionButtons).toBeInTheDocument();
  });

  it('должна располагать ActionButtons после CardList', () => {
    const { container } = render(<MainPage />);

    const contentElement = container.querySelector('.main-page__content');
    const cardList = contentElement?.querySelector('[data-testid="card-list"]');
    const actionButtons = contentElement?.querySelector(
      '[data-testid="action-buttons"]',
    );

    expect(cardList).toBeInTheDocument();
    expect(actionButtons).toBeInTheDocument();

    const cardListIndex = Array.from(contentElement?.children || []).indexOf(
      cardList!,
    );
    const actionButtonsIndex = Array.from(
      contentElement?.children || [],
    ).indexOf(actionButtons!);

    expect(actionButtonsIndex).toBeGreaterThan(cardListIndex);
  });
});
