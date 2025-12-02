import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '@entities/bank-card';
import { CardFormModal } from './card-form-modal';

vi.mock('@shared/lib', () => ({
  useModalClose: vi.fn(),
}));

vi.mock('../card-form', () => ({
  CardForm: vi.fn(({ onSuccess, onCancel }) => (
    <div data-testid="card-form">
      <button
        onClick={onSuccess}
        data-testid="success-button"
      >
        Success
      </button>
      <button
        onClick={onCancel}
        data-testid="cancel-button"
      >
        Cancel
      </button>
    </div>
  )),
}));

const mockCard: IBankCard = {
  pan: '1234567890123456',
  name: 'TEST HOLDER',
  expires: '12/25',
  cvv: '123',
  order: 0,
};

describe('CardFormModal', () => {
  const mockCloseModal = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useModalClose } = vi.mocked(await import('@shared/lib'));
    useModalClose.mockReturnValue(mockCloseModal);
  });

  it('должен рендериться с CardForm', () => {
    render(<CardFormModal />);

    expect(screen.getByTestId('card-form')).toBeInTheDocument();
  });

  it('должен рендериться с initialCard', () => {
    render(<CardFormModal initialCard={mockCard} />);

    expect(screen.getByTestId('card-form')).toBeInTheDocument();
  });

  it('должен закрывать модальное окно при успехе', () => {
    render(<CardFormModal />);

    const successButton = screen.getByTestId('success-button');
    successButton.click();

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('должен вызывать onComplete после закрытия модального окна', () => {
    render(<CardFormModal onComplete={mockOnComplete} />);

    const successButton = screen.getByTestId('success-button');
    successButton.click();

    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('не должен вызывать onComplete если он не передан', () => {
    render(<CardFormModal />);

    const successButton = screen.getByTestId('success-button');
    successButton.click();

    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('должен закрывать модальное окно при отмене', () => {
    render(<CardFormModal />);

    const cancelButton = screen.getByTestId('cancel-button');
    cancelButton.click();

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('не должен вызывать onComplete при отмене', () => {
    render(<CardFormModal onComplete={mockOnComplete} />);

    const cancelButton = screen.getByTestId('cancel-button');
    cancelButton.click();

    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('должен работать без initialCard', () => {
    render(<CardFormModal />);

    expect(screen.getByTestId('card-form')).toBeInTheDocument();
  });
});
