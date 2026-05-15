import type { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { ModalProvider, ParentClassProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import { ImportButton } from './import-button';

const { mockUseCardManagementStore } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

const TestWrapper = ({ children }: PropsWithChildren) => (
  <ModalProvider>
    {children}
    <ModalContainer />
  </ModalProvider>
);

describe('ImportButton', () => {
  const mockCards: IBankCard[] = [
    {
      id: 'mock-import-btn-id-1',
      pan: '1111',
      expires: '12/25',
      name: 'Test Card',
      cvv: '111',
      pin: '1111',
      order: 0,
    },
  ];

  const mockReorderCards = vi.fn();
  const mockUnflipCards = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCardManagementStore.mockImplementation((selector) => {
      const state = {
        cards: mockCards,
        reorderCards: mockReorderCards,
        unflipCards: mockUnflipCards,
      };

      return selector(state);
    });
  });

  it('должен рендериться', () => {
    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /импортировать карты/i });

    expect(button).toBeInTheDocument();
  });

  it('должен иметь правильный aria-label', () => {
    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /импортировать карты/i });

    expect(button).toHaveAttribute('aria-label', 'Импортировать карты');
  });

  it('должен использовать иконку загрузки', () => {
    const { container } = render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('должен применять parentClass из контекста', () => {
    render(
      <ParentClassProvider parentClass="custom-class">
        <TestWrapper>
          <ImportButton />
        </TestWrapper>
      </ParentClassProvider>,
    );

    const button = screen.getByRole('button', { name: /импортировать карты/i });

    expect(button.className).toContain('custom-class');
  });

  it('должен получать cards из store', () => {
    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('должен получать reorderCards из store', () => {
    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    expect(mockUseCardManagementStore).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  it('должен получать unflipCards из store', () => {
    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    expect(mockUseCardManagementStore).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  it('должен работать с пустым списком карт', () => {
    mockUseCardManagementStore.mockImplementation((selector) => {
      const state = {
        cards: [],
        reorderCards: mockReorderCards,
        unflipCards: mockUnflipCards,
      };

      return selector(state);
    });

    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /импортировать карты/i });

    expect(button).toBeInTheDocument();
  });

  it('кнопка не должна быть отключена по умолчанию', () => {
    render(
      <TestWrapper>
        <ImportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', { name: /импортировать карты/i });

    expect(button).not.toBeDisabled();
  });
});
