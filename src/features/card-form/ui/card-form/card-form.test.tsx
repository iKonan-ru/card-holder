import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CardForm } from './card-form';

const { mockUseCardForm, mockUseCardFormDelete } = vi.hoisted(() => ({
  mockUseCardForm: vi.fn(),
  mockUseCardFormDelete: vi.fn(),
}));

vi.mock('../../hooks', () => ({
  useCardForm: mockUseCardForm,
  useCardFormDelete: mockUseCardFormDelete,
}));

vi.mock('@features/card-preview', () => ({
  CardPreview: () => null,
}));

const mockHandleFieldChange = vi.fn();
const mockHandleFieldValidation = vi.fn();
const mockHandleSubmit = vi.fn();
const mockHandleDelete = vi.fn();
const mockHandleDeleteClick = vi.fn();

const createCardFormValue = (overrides = {}) => ({
  formData: {
    pan: '',
    expires: '',
    name: '',
    cvv: '',
    pin: '',
    type: '',
    phrase: '',
    address: { line1: '', line2: '', city: '', state: '', county: '', zip: '' },
  },
  errors: {},
  isSubmitting: false,
  isSubmitEnabled: false,
  isEditMode: false,
  handleFieldChange: mockHandleFieldChange,
  handleFieldValidation: mockHandleFieldValidation,
  handleSubmit: mockHandleSubmit,
  handleDelete: mockHandleDelete,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUseCardForm.mockReturnValue(createCardFormValue());
  mockUseCardFormDelete.mockReturnValue({
    handleDeleteClick: mockHandleDeleteClick,
  });
});

describe('CardForm - поля формы', () => {
  it('должен отображать все поля формы', () => {
    render(<CardForm />);

    expect(screen.getByLabelText(/Номер карты/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Имя владельца/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Срок действия/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PIN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Тип карты/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Кодовая фраза/i)).toBeInTheDocument();
  });

  it('должен помечать форму как занятую при isSubmitting = true', () => {
    mockUseCardForm.mockReturnValue(
      createCardFormValue({ isSubmitting: true }),
    );

    const { container } = render(<CardForm />);

    expect(container.querySelector('form')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});

describe('CardForm - режим добавления', () => {
  it('должен отображать кнопку «Добавить карту»', () => {
    render(<CardForm />);

    expect(
      screen.getByRole('button', { name: 'Добавить карту' }),
    ).toBeInTheDocument();
  });

  it('должен отображать кнопку «Отмена»', () => {
    render(<CardForm />);

    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('не должен отображать кнопку удаления', () => {
    render(<CardForm />);

    expect(
      screen.queryByRole('button', { name: 'Удалить карту' }),
    ).not.toBeInTheDocument();
  });

  it('кнопка отправки недоступна когда isSubmitEnabled = false', () => {
    render(<CardForm />);

    expect(
      screen.getByRole('button', { name: 'Добавить карту' }),
    ).toBeDisabled();
  });

  it('кнопка отправки доступна когда isSubmitEnabled = true', () => {
    mockUseCardForm.mockReturnValue(
      createCardFormValue({ isSubmitEnabled: true }),
    );

    render(<CardForm />);

    expect(
      screen.getByRole('button', { name: 'Добавить карту' }),
    ).not.toBeDisabled();
  });
});

describe('CardForm - режим редактирования', () => {
  beforeEach(() => {
    mockUseCardForm.mockReturnValue(createCardFormValue({ isEditMode: true }));
  });

  it('должен отображать кнопку «Сохранить изменения»', () => {
    render(<CardForm />);

    expect(
      screen.getByRole('button', { name: 'Сохранить изменения' }),
    ).toBeInTheDocument();
  });

  it('должен отображать кнопку удаления', () => {
    render(<CardForm />);

    expect(
      screen.getByRole('button', { name: 'Удалить карту' }),
    ).toBeInTheDocument();
  });

  it('должен вызывать handleDeleteClick при клике на кнопку удаления', async () => {
    const user = userEvent.setup();

    render(<CardForm />);

    await user.click(screen.getByRole('button', { name: 'Удалить карту' }));

    expect(mockHandleDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('должен передавать handleDelete из useCardForm в useCardFormDelete', () => {
    render(<CardForm />);

    expect(mockUseCardFormDelete).toHaveBeenCalledWith({
      onDelete: mockHandleDelete,
    });
  });
});

describe('CardForm - обработчики', () => {
  it('должен вызывать onCancel при клике на кнопку отмены', async () => {
    const mockOnCancel = vi.fn();
    const user = userEvent.setup();

    render(<CardForm onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('не должен падать при клике на отмену без переданного onCancel', async () => {
    const user = userEvent.setup();

    render(<CardForm />);

    await expect(
      user.click(screen.getByRole('button', { name: 'Отмена' })),
    ).resolves.not.toThrow();
  });

  it('должен передавать initialCard и onSuccess в useCardForm', () => {
    const mockInitialCard = { pan: '5555555555554444' };
    const mockOnSuccess = vi.fn();

    render(
      <CardForm
        initialCard={mockInitialCard}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(mockUseCardForm).toHaveBeenCalledWith({
      initialCard: mockInitialCard,
      onSuccess: mockOnSuccess,
    });
  });
});
