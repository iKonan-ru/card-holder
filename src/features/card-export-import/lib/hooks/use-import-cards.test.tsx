import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ModalProvider } from '@shared/lib';
import { useImportCards } from './use-import-cards';
import type { IBankCard } from '@entities/bank-card';
import * as crypto from '@shared/lib/crypto';
import * as fileSystem from '@shared/lib/file-system';
import * as importUtils from '../utils/import-utils';
import * as errorUtils from '../utils/error-utils';

vi.mock('@shared/lib/crypto');
vi.mock('@shared/lib/file-system');
vi.mock('../utils/import-utils');
vi.mock('../utils/error-utils');
vi.mock('../utils/message-utils');

const wrapper = ({ children }: { children: ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
);

describe('useImportCards', () => {
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

  const mockImportedCards: IBankCard[] = [
    {
      pan: '2222',
      expires: '11/26',
      name: 'Card 2',
      cvv: '222',
      pin: '2222',
      order: 1,
    },
  ];

  const mockOnImport = vi.fn();
  const mockOnUnflipCards = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(fileSystem.uploadFile).mockResolvedValue(
      new File(['test content'], 'test.cbk')
    );
    vi.mocked(fileSystem.readFileAsText).mockResolvedValue('{"test":"data"}');
    vi.mocked(importUtils.parseImportedFile).mockReturnValue({
      version: 1,
      timestamp: Date.now(),
      salt: 'test-salt',
      iv: 'test-iv',
      encrypted: 'test-encrypted',
    });
    vi.mocked(importUtils.validateImportedPayload).mockImplementation(() => {});
    vi.mocked(crypto.decryptData).mockResolvedValue(
      JSON.stringify(mockImportedCards)
    );
    vi.mocked(importUtils.parseDecryptedCards).mockReturnValue(
      mockImportedCards
    );
    vi.mocked(importUtils.mergeCards).mockReturnValue({
      cards: [...mockCards, ...mockImportedCards],
      stats: {
        imported: 1,
        replaced: 0,
        total: 1,
      },
    });
    vi.mocked(errorUtils.handleError).mockImplementation(() => {});
    mockOnImport.mockResolvedValue(undefined);
  });

  it('должен возвращать isImporting и importCards', () => {
    const { result } = renderHook(
      () =>
        useImportCards({
          cards: mockCards,
          onImport: mockOnImport,
          onUnflipCards: mockOnUnflipCards,
        }),
      { wrapper }
    );

    expect(result.current).toHaveProperty('isImporting');
    expect(result.current).toHaveProperty('importCards');
    expect(typeof result.current.importCards).toBe('function');
  });

  it('должен инициализировать isImporting как false', () => {
    const { result } = renderHook(
      () =>
        useImportCards({
          cards: mockCards,
          onImport: mockOnImport,
          onUnflipCards: mockOnUnflipCards,
        }),
      { wrapper }
    );

    expect(result.current.isImporting).toBe(false);
  });

  it('должен возвращать функцию importCards', () => {
    const { result } = renderHook(
      () =>
        useImportCards({
          cards: mockCards,
          onImport: mockOnImport,
          onUnflipCards: mockOnUnflipCards,
        }),
      { wrapper }
    );

    expect(typeof result.current.importCards).toBe('function');
  });

  it('importCards должна быть async функцией', () => {
    const { result } = renderHook(
      () =>
        useImportCards({
          cards: mockCards,
          onImport: mockOnImport,
          onUnflipCards: mockOnUnflipCards,
        }),
      { wrapper }
    );

    const returnValue = result.current.importCards();

    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('должен обрабатывать разные параметры', () => {
    const { result: result1 } = renderHook(
      () =>
        useImportCards({
          cards: [],
          onImport: mockOnImport,
          onUnflipCards: mockOnUnflipCards,
        }),
      { wrapper }
    );

    const { result: result2 } = renderHook(
      () =>
        useImportCards({
          cards: mockCards,
          onImport: mockOnImport,
          onUnflipCards: mockOnUnflipCards,
        }),
      { wrapper }
    );

    expect(result1.current).toHaveProperty('importCards');
    expect(result2.current).toHaveProperty('importCards');
  });
});
