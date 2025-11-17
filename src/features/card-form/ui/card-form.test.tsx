import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CardForm } from './card-form';
import * as sharedLib from '@shared/lib';
import { ModalProvider } from '@shared/lib';
import { ModalContainer } from '@shared/ui';
import type { FC, ReactNode } from 'react';

const { mockUseCardManagementStore } = vi.hoisted(() => ({
  mockUseCardManagementStore: vi.fn(),
}));

vi.mock('@features/card-management', () => ({
  useCardManagementStore: mockUseCardManagementStore,
}));

vi.mock('@shared/lib', async () => {
  const actual = await vi.importActual('@shared/lib');

  return {
    ...actual,
    checkCardExists: vi.fn(),
  };
});

vi.mock('@features/card-preview', () => ({
  CardPreview: () => null,
}));

const TestWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalContainer />
    </ModalProvider>
  );
};

const createMockStore = (overrides = {}) => ({
  cards: [],
  isLoading: false,
  flippedPan: null,
  isReorderMode: false,
  loadCards: vi.fn(),
  addCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
  flipCard: vi.fn(),
  unflipCards: vi.fn(),
  setCards: vi.fn(),
  reorderCards: vi.fn(),
  setReorderMode: vi.fn(),
  toggleReorderMode: vi.fn(),
  ...overrides,
});

describe('CardForm', () => {
  const mockAddCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockStoreValue = createMockStore({ addCard: mockAddCard });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    vi.mocked(sharedLib.checkCardExists).mockResolvedValue(false);
  });

  afterEach(() => {
    cleanup();
  });

  it('должен отображать все поля формы', () => {
    render(<CardForm />, { wrapper: TestWrapper });

    expect(screen.getByLabelText(/Номер карты/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Имя владельца/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Срок действия/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PIN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Тип карты/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Кодовая фраза/i)).toBeInTheDocument();
  });

  it('должен отображать кнопки действий', () => {
    render(<CardForm />, { wrapper: TestWrapper });

    expect(
      screen.getByRole('button', { name: 'Добавить карту' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('должен вызывать onCancel при клике на кнопку отмены', async () => {
    const handleCancel = vi.fn();
    const user = userEvent.setup();

    render(<CardForm onCancel={handleCancel} />, { wrapper: TestWrapper });

    const cancelButton = screen.getByRole('button', { name: 'Отмена' });
    await user.click(cancelButton);

    await vi.waitFor(() => {
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('должен применять маску к номеру карты', async () => {
    const user = userEvent.setup();

    render(<CardForm />, { wrapper: TestWrapper });

    const panInput = screen.getByLabelText(/Номер карты/i);
    await user.type(panInput, '5536914125525541');

    expect(panInput).toHaveValue('5536 9141 2552 5541');
  });

  it('должен применять маску к сроку действия', async () => {
    const user = userEvent.setup();

    render(<CardForm />, { wrapper: TestWrapper });

    const expiresInput = screen.getByLabelText(/Срок действия/i);
    await user.type(expiresInput, '1225');

    expect(expiresInput).toHaveValue('12/25');
  });

  it('должен конвертировать имя в верхний регистр', async () => {
    const user = userEvent.setup();

    render(<CardForm />, { wrapper: TestWrapper });

    const nameInput = screen.getByLabelText(/Имя владельца/i);
    await user.type(nameInput, 'john doe');

    expect(nameInput).toHaveValue('JOHN DOE');
  });

  it('должен отображать все обязательные поля', () => {
    render(<CardForm />, { wrapper: TestWrapper });

    const panField = screen
      .getByLabelText(/Номер карты/i)
      .closest('.form-field');
    const nameField = screen
      .getByLabelText(/Имя владельца/i)
      .closest('.form-field');

    expect(panField?.querySelector('label')).toHaveTextContent('*');
    expect(nameField?.querySelector('label')).toHaveTextContent('*');
  });

  it('должен отображать кнопку удаления в режиме редактирования', () => {
    const mockCard = {
      pan: '4111111111111111',
      name: 'TEST USER',
      expires: '12/25',
      cvv: '123',
      pin: '1234',
    };

    render(<CardForm initialCard={mockCard} />, { wrapper: TestWrapper });

    expect(
      screen.getByRole('button', { name: 'Удалить карту' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Сохранить изменения' })
    ).toBeInTheDocument();
  });

  it('должен открывать модальное окно подтверждения при клике на кнопку удаления', async () => {
    const user = userEvent.setup();
    const mockCard = {
      pan: '4111111111111111',
      name: 'TEST USER',
      expires: '12/25',
      cvv: '123',
      pin: '1234',
    };

    render(<CardForm initialCard={mockCard} />, { wrapper: TestWrapper });

    const deleteButton = screen.getByRole('button', { name: 'Удалить карту' });
    await user.click(deleteButton);

    expect(
      screen.getByText('Вы уверены, что хотите удалить эту карту?')
    ).toBeInTheDocument();
  });

  it('должен удалять карту при подтверждении', async () => {
    const user = userEvent.setup();
    const mockDeleteCard = vi.fn().mockResolvedValue(undefined);
    const mockCard = {
      pan: '4111111111111111',
      name: 'TEST USER',
      expires: '12/25',
      cvv: '123',
      pin: '1234',
    };

    const mockStoreValue = createMockStore({
      addCard: mockAddCard,
      deleteCard: mockDeleteCard,
    });

    mockUseCardManagementStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStoreValue);
      }

      return mockStoreValue;
    });

    render(<CardForm initialCard={mockCard} />, { wrapper: TestWrapper });

    const deleteButton = screen.getByRole('button', { name: 'Удалить карту' });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', {
      name: 'Удалить: Удаление карты',
    });
    await user.click(confirmButton);

    await vi.waitFor(() => {
      expect(mockDeleteCard).toHaveBeenCalledWith('4111111111111111');
    });
  });

  it('не должен вызывать onCancel если он не передан', async () => {
    const user = userEvent.setup();

    render(<CardForm />, { wrapper: TestWrapper });

    const cancelButton = screen.getByRole('button', { name: 'Отмена' });
    await user.click(cancelButton);

    await vi.waitFor(() => {
      expect(cancelButton).toBeInTheDocument();
    });
  });
});
