import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import * as sharedLib from '@shared/lib';
import * as utils from '../utils';
import { useImportCards } from './use-import-cards';

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    useModalContext: vi.fn(),
    uploadFile: vi.fn(),
    readFileAsText: vi.fn(),
    decryptData: vi.fn(),
    checkIsFileSelectionCancelled: vi.fn(),
  };
});

vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils');

  return {
    ...actual,
    parseImportedFile: vi.fn(),
    validateImportedPayload: vi.fn(),
    parseDecryptedCards: vi.fn(),
    mergeCards: vi.fn(),
    handleError: vi.fn(),
    createImportSuccessMessage: vi.fn(),
  };
});

const MOCK_PASSWORD = 'test-password-123';
const MOCK_FILE_CONTENT = JSON.stringify({
  version: 1,
  timestamp: 1699537845000,
  salt: 'test-salt',
  iv: 'test-iv',
  encrypted: 'test-encrypted',
});

const mockCards: IBankCard[] = [
  {
    pan: '1234567890123456',
    name: 'TEST HOLDER',
    expires: '12/25',
    cvv: '123',
    order: 0,
  },
];

const mockImportedCards: IBankCard[] = [
  {
    pan: '9876543210987654',
    name: 'IMPORTED HOLDER',
    expires: '01/26',
    cvv: '456',
    order: 1,
  },
];

const mockMergedCards: IBankCard[] = [...mockCards, ...mockImportedCards];

const mockPayload = {
  version: 1,
  timestamp: 1699537845000,
  salt: 'test-salt',
  iv: 'test-iv',
  encrypted: 'test-encrypted',
};

const mockStats = {
  imported: 1,
  replaced: 0,
  total: 1,
};

describe('useImportCards', () => {
  const mockOpenModal = vi.fn();
  const mockCloseModal = vi.fn();
  const mockClosePasswordModal = vi.fn();
  const mockSetPasswordError = vi.fn();
  const mockOnImport = vi.fn();
  const mockOnUnflipCards = vi.fn();
  const mockFile = new File([MOCK_FILE_CONTENT], 'test.json', {
    type: 'application/json',
  });

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

    vi.mocked(sharedLib.uploadFile).mockResolvedValue(mockFile);
    vi.mocked(sharedLib.readFileAsText).mockResolvedValue(MOCK_FILE_CONTENT);
    vi.mocked(utils.parseImportedFile).mockReturnValue(mockPayload);
    vi.mocked(utils.validateImportedPayload).mockReturnValue(mockPayload);
    vi.mocked(sharedLib.decryptData).mockResolvedValue('[]');
    vi.mocked(utils.parseDecryptedCards).mockReturnValue(mockImportedCards);
    vi.mocked(utils.mergeCards).mockReturnValue({
      cards: mockMergedCards,
      stats: mockStats,
    });
    vi.mocked(utils.createImportSuccessMessage).mockReturnValue(
      'Successfully imported 1 card(s)',
    );
    vi.mocked(sharedLib.checkIsFileSelectionCancelled).mockReturnValue(false);
    mockOnImport.mockResolvedValue(undefined);
  });

  it('должен инициализироваться корректно', () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    expect(result.current.importCards).toBeDefined();
    expect(result.current.isImporting).toBe(false);
  });

  it('должен загружать файл при вызове importCards', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    expect(sharedLib.uploadFile).toHaveBeenCalledWith(expect.any(String));
  });

  it('должен читать содержимое файла', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    expect(sharedLib.readFileAsText).toHaveBeenCalledWith(mockFile);
  });

  it('должен парсить и валидировать payload', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    expect(utils.parseImportedFile).toHaveBeenCalledWith(MOCK_FILE_CONTENT);
    expect(utils.validateImportedPayload).toHaveBeenCalledWith(mockPayload);
  });

  it('должен открывать модальное окно пароля после загрузки файла', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('должен импортировать карты с паролем', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(sharedLib.decryptData).toHaveBeenCalledWith(
        mockPayload,
        MOCK_PASSWORD,
      );
    });
  });

  it('должен парсить расшифрованные карты', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(utils.parseDecryptedCards).toHaveBeenCalledWith('[]');
    });
  });

  it('должен объединять карты', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(utils.mergeCards).toHaveBeenCalledWith(
        mockCards,
        mockImportedCards,
      );
    });
  });

  it('должен вызывать onImport с объединенными картами', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(mockOnImport).toHaveBeenCalledWith(mockMergedCards);
    });
  });

  it('должен вызывать onUnflipCards после импорта', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(mockOnUnflipCards).toHaveBeenCalled();
    });
  });

  it('должен открывать модальное окно успеха после импорта', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledTimes(2);
    });
  });

  it('должен выполнять полный процесс импорта', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(mockOnImport).toHaveBeenCalled();
    });
  });

  it('должен завершаться после успешного импорта', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(mockClosePasswordModal).toHaveBeenCalled();
    });
  });

  it('должен обрабатывать ошибку при расшифровке', async () => {
    const mockError = new Error('Decryption error');
    vi.mocked(sharedLib.decryptData).mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await expect(
        onConfirm(MOCK_PASSWORD, mockClosePasswordModal, mockSetPasswordError),
      ).rejects.toThrow('Decryption error');
    });

    await waitFor(() => {
      expect(mockSetPasswordError).toHaveBeenCalledWith('Decryption error');
    });
  });

  it('должен обрабатывать ошибку и закрывать модалку после ошибки', async () => {
    const mockError = new Error('Import error');
    vi.mocked(utils.parseDecryptedCards).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await expect(
        onConfirm(MOCK_PASSWORD, mockClosePasswordModal, mockSetPasswordError),
      ).rejects.toThrow('Import error');
    });

    await waitFor(() => {
      expect(mockSetPasswordError).toHaveBeenCalledWith('Import error');
    });
  });

  it('должен игнорировать отмену выбора файла', async () => {
    vi.mocked(sharedLib.uploadFile).mockRejectedValue(
      new Error('User cancelled'),
    );
    vi.mocked(sharedLib.checkIsFileSelectionCancelled).mockReturnValue(true);

    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    expect(utils.handleError).not.toHaveBeenCalled();
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('должен обрабатывать ошибку при загрузке файла', async () => {
    const mockError = new Error('File upload error');
    vi.mocked(sharedLib.uploadFile).mockRejectedValue(mockError);
    vi.mocked(sharedLib.checkIsFileSelectionCancelled).mockReturnValue(false);

    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    expect(utils.handleError).toHaveBeenCalledWith(
      mockError,
      expect.any(String),
    );
  });

  it('должен закрывать модалку пароля после успешного импорта', async () => {
    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await onConfirm(
        MOCK_PASSWORD,
        mockClosePasswordModal,
        mockSetPasswordError,
      );
    });

    await waitFor(() => {
      expect(mockClosePasswordModal).toHaveBeenCalled();
    });
  });

  it('должен показывать ошибку пароля при ошибке импорта', async () => {
    const mockError = new Error('Decryption error');
    vi.mocked(sharedLib.decryptData).mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useImportCards({
        cards: mockCards,
        onImport: mockOnImport,
        onUnflipCards: mockOnUnflipCards,
      }),
    );

    await act(async () => {
      await result.current.importCards();
    });

    const passwordModalCall = mockOpenModal.mock.calls[0];
    const modalContent = passwordModalCall[1];
    const onConfirm = modalContent.props.onConfirm;

    await act(async () => {
      await expect(
        onConfirm(MOCK_PASSWORD, mockClosePasswordModal, mockSetPasswordError),
      ).rejects.toThrow('Decryption error');
    });

    await waitFor(() => {
      expect(mockSetPasswordError).toHaveBeenCalledWith('Decryption error');
    });
  });
});
