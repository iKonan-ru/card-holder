import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setModalContext, showError } from './show-error';
import type { IModalContextValue } from '@shared/lib';

describe('setModalContext', () => {
  it('должен сохранять контекст модальных окон', () => {
    const mockContext: IModalContextValue = {
      modals: [],
      openModal: vi.fn(),
      closeModal: vi.fn(),
      closeAllModals: vi.fn(),
      userActionRef: { current: false },
    };

    expect(() => {
      setModalContext(mockContext);
    }).not.toThrow();
  });
});

describe('showError', () => {
  let mockOpenModal: ReturnType<typeof vi.fn>;
  let mockCloseModal: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOpenModal = vi.fn();
    mockCloseModal = vi.fn();
    consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}) as ReturnType<typeof vi.fn>;

    const mockContext: IModalContextValue = {
      modals: [],
      openModal: mockOpenModal as IModalContextValue['openModal'],
      closeModal: mockCloseModal as IModalContextValue['closeModal'],
      closeAllModals: vi.fn(),
      userActionRef: { current: false },
    };

    setModalContext(mockContext);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('должен открывать модальное окно с переведенным сообщением', () => {
    showError({
      message: 'Failed to add card',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);

    const callArgs = mockOpenModal.mock.calls[0];

    expect(callArgs[0]).toMatch(/^error-modal-/);
    expect(callArgs[2]).toBeTypeOf('function');
    expect(callArgs[3]).toBe('error-modal-title');
    expect(callArgs[4]).toBe('error-modal-message');
  });

  it('должен открывать модальное окно с контекстом', () => {
    showError({
      message: 'Failed to load cards',
      context: 'TestContext',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('должен открывать модальное окно с объектом ошибки', () => {
    const error = new Error('Test error');

    showError({
      message: 'Failed to delete card',
      error,
      context: 'TestContext',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('должен закрывать модальное окно при вызове onClose', () => {
    showError({
      message: 'Failed to update card',
    });

    const callArgs = mockOpenModal.mock.calls[0];
    const onClose = callArgs[2];

    onClose();

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('должен логировать ошибку если контекст не инициализирован', () => {
    setModalContext(null as unknown as IModalContextValue);

    showError({
      message: 'Failed to add card',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Error Handler] Modal context not initialized'
    );
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('должен переводить неизвестные ошибки в дефолтное сообщение', () => {
    showError({
      message: 'Unknown error message',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});
