import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setModalContext, showError } from './show-error';
import type { IModalContext } from '@shared/lib';

describe('setModalContext', () => {
  it('должен сохранять контекст модальных окон', () => {
    const mockContext: IModalContext = {
      modals: [],
      openModal: vi.fn(),
      closeModal: vi.fn(),
      closeAllModals: vi.fn(),
      updateModalPreventClose: vi.fn(),
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

    const mockContext: IModalContext = {
      modals: [],
      openModal: mockOpenModal as IModalContext['openModal'],
      closeModal: mockCloseModal as IModalContext['closeModal'],
      closeAllModals: vi.fn(),
      updateModalPreventClose: vi.fn(),
      userActionRef: { current: false },
    };

    setModalContext(mockContext);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('должен открывать модальное окно с переведенным сообщением', () => {
    showError({
      message: 'Не удалось добавить карту',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);

    const callArgs = mockOpenModal.mock.calls[0];

    expect(callArgs[0]).toMatch(/^error-content-/);
    expect(callArgs[2]).toBe('error-content-title');
    expect(callArgs[3]).toBe('error-content-message');
  });

  it('должен открывать модальное окно с контекстом', () => {
    showError({
      message: 'Не удалось загрузить карты',
      context: 'TestContext',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('должен открывать модальное окно с объектом ошибки', () => {
    const error = new Error('Test error');

    showError({
      message: 'Не удалось удалить карту',
      error,
      context: 'TestContext',
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('должен логировать ошибку если контекст не инициализирован', () => {
    setModalContext(null as unknown as IModalContext);

    showError({
      message: 'Не удалось добавить карту',
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
