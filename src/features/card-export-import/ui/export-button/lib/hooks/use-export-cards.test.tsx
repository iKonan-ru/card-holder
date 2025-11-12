import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useExportCards } from './use-export-cards';
import type { IBankCard } from '@entities/bank-card';
import * as sharedLib from '@shared/lib';
import * as exportUtils from '../utils';
import * as errorUtils from '../../../../lib/utils';

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    useModalContext: vi.fn(),
    encryptData: vi.fn(),
    generateExportFileName: vi.fn(),
    createBlobFromPayload: vi.fn(),
    downloadFile: vi.fn(),
  };
});

vi.mock('../utils', () => ({
  validateCardsForExport: vi.fn(),
  prepareCardsForExport: vi.fn(),
}));

vi.mock('../../../../lib/utils', () => ({
  handleError: vi.fn(),
}));

const MOCK_PASSWORD = 'test-password-123';
const MOCK_FILE_NAME = 'cards-export-2025-11-10.json';
const MOCK_ENCRYPTED_PAYLOAD = {
  version: 1,
  timestamp: 1699537845000,
  salt: 'test-salt',
  iv: 'test-iv',
  encrypted: 'test-encrypted',
};
const MOCK_BLOB = new Blob(['test'], { type: 'application/json' });

const mockCards: IBankCard[] = [
  {
    pan: '1234567890123456',
    name: 'TEST HOLDER',
    expires: '12/25',
    cvv: '123',
    order: 0,
  },
];

describe('useExportCards', () => {
  const mockOpenModal = vi.fn();
  const mockCloseModal = vi.fn();
  const mockClosePasswordModal = vi.fn();
  const mockSetPasswordError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(sharedLib.useModalContext).mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      closeAllModals: vi.fn(),
      updateModalPreventClose: vi.fn(),
      modals: [],
      userActionRef: { current: false },
    });

    vi.mocked(sharedLib.generateExportFileName).mockReturnValue(MOCK_FILE_NAME);
    vi.mocked(sharedLib.createBlobFromPayload).mockReturnValue(MOCK_BLOB);
    vi.mocked(sharedLib.downloadFile).mockResolvedValue(undefined);
    vi.mocked(exportUtils.validateCardsForExport).mockReturnValue(undefined);
    vi.mocked(exportUtils.prepareCardsForExport).mockReturnValue('[]');
    vi.mocked(sharedLib.encryptData).mockResolvedValue(MOCK_ENCRYPTED_PAYLOAD);
  });

  it('должен инициализироваться с isExporting = false', () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    expect(result.current.isExporting).toBe(false);
  });

  it('должен открывать модальное окно при вызове exportCards', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(exportUtils.validateCardsForExport).toHaveBeenCalledWith(mockCards);
  });

  it('должен валидировать карты перед открытием модального окна', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    expect(exportUtils.validateCardsForExport).toHaveBeenCalledWith(mockCards);
  });

  it('должен обрабатывать ошибку при валидации', async () => {
    const mockError = new Error('Validation error');
    vi.mocked(exportUtils.validateCardsForExport).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    expect(errorUtils.handleError).toHaveBeenCalledWith(
      mockError,
      expect.any(String)
    );
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('должен экспортировать карты с паролем', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(exportUtils.validateCardsForExport).toHaveBeenCalledWith(
        mockCards
      );
      expect(exportUtils.prepareCardsForExport).toHaveBeenCalledWith(mockCards);
      expect(sharedLib.encryptData).toHaveBeenCalledWith('[]', MOCK_PASSWORD);
    });
  });

  it('должен создавать blob и скачивать файл', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(sharedLib.createBlobFromPayload).toHaveBeenCalledWith(
        MOCK_ENCRYPTED_PAYLOAD
      );
      expect(sharedLib.downloadFile).toHaveBeenCalledWith(
        MOCK_BLOB,
        MOCK_FILE_NAME
      );
    });
  });

  it('должен выполнять полный процесс экспорта', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(sharedLib.generateExportFileName).toHaveBeenCalled();
    });
  });

  it('должен сбрасывать isExporting после успешного экспорта', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(result.current.isExporting).toBe(false);
    });
  });

  it('должен обрабатывать ошибку при экспорте с паролем', async () => {
    const mockError = new Error('Export error');
    vi.mocked(sharedLib.encryptData).mockRejectedValue(mockError);

    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(mockSetPasswordError).toHaveBeenCalledWith('Export error');
      expect(result.current.isExporting).toBe(false);
    });
  });

  it('должен сбрасывать isExporting после ошибки', async () => {
    const mockError = new Error('Export error');
    vi.mocked(exportUtils.prepareCardsForExport).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(result.current.isExporting).toBe(false);
    });
  });

  it('должен закрывать модалку пароля после успешного экспорта', async () => {
    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(mockClosePasswordModal).toHaveBeenCalled();
    });
  });

  it('должен закрывать модалку пароля при ошибке экспорта', async () => {
    const mockError = new Error('Export error');
    vi.mocked(sharedLib.encryptData).mockRejectedValue(mockError);

    const { result } = renderHook(() => useExportCards({ cards: mockCards }));

    await act(async () => {
      await result.current.exportCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError
      );
    });

    await waitFor(() => {
      expect(mockClosePasswordModal).toHaveBeenCalled();
    });
  });
});
