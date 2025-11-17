import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ModalProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import { ActionButtons } from './action-buttons';
import { MOCK_CARDS } from '@test';

const { mockUseCardManagementStore } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ModalProvider>
    {children}
    <ModalContainer />
  </ModalProvider>
);

describe('ActionButtons', () => {
  const mockToggleReorderMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockStoreValue = {
      cards: MOCK_CARDS,
      isReorderMode: false,
      toggleReorderMode: mockToggleReorderMode,
    };

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('должен рендериться', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const container = document.querySelector('.action-buttons');
    expect(container).toBeInTheDocument();
  });

  it('должен всегда отображать ImportButton', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const importButton = screen.getByRole('button', {
      name: /импортировать карты/i,
    });

    expect(importButton).toBeInTheDocument();
  });

  it('должен отображать ExportButton когда есть карты', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const exportButton = screen.getByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(exportButton).toBeInTheDocument();
  });

  it('должен отображать ReorderToggleButton когда есть карты', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const reorderButton = screen.getByRole('button', {
      name: /включить режим сортировки/i,
    });

    expect(reorderButton).toBeInTheDocument();
  });

  it('должен отображать ClearButton когда есть карты', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const clearButton = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    expect(clearButton).toBeInTheDocument();
  });

  it('не должен отображать ExportButton когда нет карт', () => {
    const mockStoreValue = {
      cards: [],
      isReorderMode: false,
      toggleReorderMode: mockToggleReorderMode,
    };

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const exportButton = screen.queryByRole('button', {
      name: /экспортировать карты/i,
    });

    expect(exportButton).not.toBeInTheDocument();
  });

  it('не должен отображать ReorderToggleButton когда нет карт', () => {
    const mockStoreValue = {
      cards: [],
      isReorderMode: false,
      toggleReorderMode: mockToggleReorderMode,
    };

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const reorderButton = screen.queryByRole('button', {
      name: /включить режим сортировки/i,
    });

    expect(reorderButton).not.toBeInTheDocument();
  });

  it('не должен отображать ClearButton когда нет карт', () => {
    const mockStoreValue = {
      cards: [],
      isReorderMode: false,
      toggleReorderMode: mockToggleReorderMode,
    };

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const clearButton = screen.queryByRole('button', {
      name: /очистить все данные/i,
    });

    expect(clearButton).not.toBeInTheDocument();
  });

  it('должен передавать isActive=false в ReorderToggleButton когда isReorderMode=false', () => {
    const mockStoreValue = {
      cards: MOCK_CARDS,
      isReorderMode: false,
      toggleReorderMode: mockToggleReorderMode,
    };

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const reorderButton = screen.getByRole('button', {
      name: /включить режим сортировки/i,
    });

    expect(reorderButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('должен передавать isActive=true в ReorderToggleButton когда isReorderMode=true', () => {
    const mockStoreValue = {
      cards: MOCK_CARDS,
      isReorderMode: true,
      toggleReorderMode: mockToggleReorderMode,
    };

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const reorderButton = screen.getByRole('button', {
      name: /выключить режим сортировки/i,
    });

    expect(reorderButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('должен вызывать toggleReorderMode при клике на ReorderToggleButton', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const reorderButton = screen.getByRole('button', {
      name: /включить режим сортировки/i,
    });

    await user.click(reorderButton);

    expect(mockToggleReorderMode).toHaveBeenCalledTimes(1);
  });

  it('должен использовать useCardManagementStore для получения cards', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('должен использовать useCardManagementStore для получения isReorderMode', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('должен использовать useCardManagementStore для получения toggleReorderMode', () => {
    render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    expect(mockUseCardManagementStore).toHaveBeenCalled();
  });

  it('должен применять правильный класс контейнера', () => {
    const { container } = render(
      <TestWrapper>
        <ActionButtons />
      </TestWrapper>
    );

    const actionButtonsContainer = container.querySelector('.action-buttons');
    expect(actionButtonsContainer).toBeInTheDocument();
  });
});
