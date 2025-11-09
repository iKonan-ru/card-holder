import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ModalProvider } from '@shared/lib';
import { useExportCards } from './use-export-cards';
import type { IBankCard } from '@entities/bank-card';
import * as crypto from '@shared/lib/crypto';
import * as fileSystem from '@shared/lib/file-system';
import * as exportUtils from '../utils/export-utils';
import * as errorUtils from '../utils/error-utils';

vi.mock('@shared/lib/crypto');
vi.mock('@shared/lib/file-system');
vi.mock('../utils/export-utils');
vi.mock('../utils/error-utils');

const wrapper = ({ children }: { children: ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
);

describe('useExportCards', () => {
  const mockCards: IBankCard[] = [
    {
      pan: '1111',
      expires: '12/25',
      name: 'Card 1',
      cvv: '111',
      pin: '1111',
      order: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exportUtils.validateCardsForExport).mockImplementation(() => {});
    vi.mocked(exportUtils.prepareCardsForExport).mockReturnValue(
      JSON.stringify(mockCards)
    );
    vi.mocked(crypto.encryptData).mockResolvedValue({
      version: 1,
      timestamp: Date.now(),
      salt: 'test-salt',
      iv: 'test-iv',
      encrypted: 'test-encrypted',
    });
    vi.mocked(fileSystem.createBlobFromPayload).mockReturnValue(
      new Blob(['test'])
    );
    vi.mocked(fileSystem.generateExportFileName).mockReturnValue(
      'test-export.cbk'
    );
    vi.mocked(fileSystem.downloadFile).mockImplementation(() => {});
    vi.mocked(errorUtils.handleError).mockImplementation(() => {});
  });

  it('должен возвращать isExporting и exportCards', () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }), {
      wrapper,
    });

    expect(result.current).toHaveProperty('isExporting');
    expect(result.current).toHaveProperty('exportCards');
    expect(typeof result.current.exportCards).toBe('function');
  });

  it('должен инициализировать isExporting как false', () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }), {
      wrapper,
    });

    expect(result.current.isExporting).toBe(false);
  });

  it('должен возвращать функцию exportCards', () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }), {
      wrapper,
    });

    expect(typeof result.current.exportCards).toBe('function');
  });

  it('exportCards должна быть async функцией', () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }), {
      wrapper,
    });

    const returnValue = result.current.exportCards();

    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('должен обрабатывать разные массивы карт', () => {
    const emptyCards: IBankCard[] = [];
    const { result: result1 } = renderHook(
      () => useExportCards({ cards: emptyCards }),
      { wrapper }
    );

    const { result: result2 } = renderHook(
      () => useExportCards({ cards: mockCards }),
      { wrapper }
    );

    expect(result1.current).toHaveProperty('exportCards');
    expect(result2.current).toHaveProperty('exportCards');
  });
});
