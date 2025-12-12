import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as sharedLib from '@shared/lib';
import { executeCardOperation } from './utils';

vi.mock('@shared/lib', async () => {
  const actual =
    await vi.importActual<typeof import('@shared/lib')>('@shared/lib');

  return {
    ...actual,
    getAllCards: vi.fn(),
    logError: vi.fn(),
  };
});

describe('executeCardOperation', () => {
  const mockCards = [
    {
      pan: '5536914125525541',
      expires: '1225',
      name: 'TEST USER',
      cvv: '123',
      pin: '1234',
      order: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должна успешно выполнить операцию и вызвать onSuccess', async () => {
    const mockOperation = vi.fn().mockResolvedValue(undefined);
    const mockOnSuccess = vi.fn();

    vi.mocked(sharedLib.getAllCards).mockResolvedValue(mockCards);

    await executeCardOperation({
      operation: mockOperation,
      errorMessage: 'Test error',
      context: 'TestContext',
      onSuccess: mockOnSuccess,
    });

    expect(mockOperation).toHaveBeenCalled();
    expect(sharedLib.getAllCards).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith(mockCards);
  });

  it('должна логировать ошибку и пробрасывать её дальше', async () => {
    const testError = new Error('Operation failed');
    const mockOperation = vi.fn().mockRejectedValue(testError);
    const mockOnSuccess = vi.fn();

    await expect(
      executeCardOperation({
        operation: mockOperation,
        errorMessage: 'Failed to execute',
        context: 'TestContext',
        onSuccess: mockOnSuccess,
      }),
    ).rejects.toThrow(testError);

    expect(mockOperation).toHaveBeenCalled();
    expect(sharedLib.logError).toHaveBeenCalledWith({
      message: 'Failed to execute',
      error: testError,
      context: 'TestContext',
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(sharedLib.getAllCards).not.toHaveBeenCalled();
  });

  it('должна передавать обновленные карты в onSuccess', async () => {
    const updatedCards = [
      ...mockCards,
      {
        pan: '4276300015876543',
        expires: '0626',
        name: 'ANOTHER USER',
        cvv: '456',
        pin: '5678',
        order: 1,
      },
    ];

    const mockOperation = vi.fn().mockResolvedValue(undefined);
    const mockOnSuccess = vi.fn();

    vi.mocked(sharedLib.getAllCards).mockResolvedValue(updatedCards);

    await executeCardOperation({
      operation: mockOperation,
      errorMessage: 'Test error',
      context: 'AddCard',
      onSuccess: mockOnSuccess,
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(updatedCards);
  });
});
