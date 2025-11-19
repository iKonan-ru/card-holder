import { describe, it, expect, vi } from 'vitest';
import { handleError } from './error';
import * as errorHandling from '@features/error-handling';

vi.mock('@features/error-handling', () => ({
  showError: vi.fn(),
}));

describe('handleError', () => {
  it('должен вызывать showError с сообщением об ошибке', () => {
    const error = new Error('Test error');
    const fallbackMessage = 'Fallback message';

    handleError(error, fallbackMessage);

    expect(errorHandling.showError).toHaveBeenCalledWith({
      message: 'Test error',
      error,
    });
  });

  it('должен использовать fallback сообщение для неизвестных ошибок', () => {
    const error = { unknown: 'error' };
    const fallbackMessage = 'Fallback message';

    handleError(error, fallbackMessage);

    expect(errorHandling.showError).toHaveBeenCalledWith({
      message: fallbackMessage,
      error,
    });
  });

  it('должен использовать fallback сообщение для null', () => {
    const fallbackMessage = 'Fallback message';

    handleError(null, fallbackMessage);

    expect(errorHandling.showError).toHaveBeenCalledWith({
      message: fallbackMessage,
      error: null,
    });
  });

  it('должен использовать fallback сообщение для undefined', () => {
    const fallbackMessage = 'Fallback message';

    handleError(undefined, fallbackMessage);

    expect(errorHandling.showError).toHaveBeenCalledWith({
      message: fallbackMessage,
      error: undefined,
    });
  });
});
