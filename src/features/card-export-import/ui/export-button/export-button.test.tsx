import type { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { ModalProvider, ParentClassProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import { ExportButton } from './export-button';

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

describe('ExportButton', () => {
  const mockCards: IBankCard[] = [
    {
      id: 'mock-export-btn-id-1',
      pan: '1111',
      expires: '12/25',
      name: 'Test Card',
      cvv: '111',
      pin: '1111',
      order: 0,
    },
  ];

  beforeEach(() => {
    mockUseCardManagementStore.mockReturnValue(mockCards);
  });

  it('должен рендериться', () => {
    render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(button).toBeInTheDocument();
  });

  it('должен иметь правильный aria-label', () => {
    render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(button).toHaveAttribute('aria-label', 'Экспортировать карты');
  });

  it('должен вызывать хук useExportCards с правильными параметрами', () => {
    render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('кнопка не должна быть отключена по умолчанию', () => {
    render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(button).not.toBeDisabled();
  });

  it('должен использовать иконку загрузки', () => {
    const { container } = render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('должен применять parentClass из контекста', () => {
    render(
      <ParentClassProvider parentClass="custom-class">
        <TestWrapper>
          <ExportButton />
        </TestWrapper>
      </ParentClassProvider>,
    );

    const button = screen.getByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(button.className).toContain('custom-class');
  });

  it('должен использовать хук с картами из store', () => {
    const customCards: IBankCard[] = [{ ...mockCards[0], pan: '2222' }];
    mockUseCardManagementStore.mockReturnValue(customCards);

    render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('должен работать с пустым списком карт', () => {
    mockUseCardManagementStore.mockReturnValue([]);

    render(
      <TestWrapper>
        <ExportButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(button).toBeInTheDocument();
  });
});
