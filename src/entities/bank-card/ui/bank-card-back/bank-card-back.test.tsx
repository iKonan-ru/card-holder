import { MOCK_CARD } from '@test';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BankCardBack } from './bank-card-back';

const mockOnEditClick = vi.fn();

vi.mock('@shared/ui', () => ({
  CopyableField: ({ value, label }: { value: string; label: string }) => (
    <div data-testid={`copyable-field-${label}`}>{value}</div>
  ),
}));

describe('BankCardBack', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.getByTestId('copyable-field-CVV')).toBeInTheDocument();
  });

  it('должен отображать CVV', () => {
    render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.getByTestId('copyable-field-CVV')).toBeInTheDocument();
    expect(screen.getByText(MOCK_CARD.cvv)).toBeInTheDocument();
  });

  it('должен отображать кнопку редактирования', () => {
    const { container } = render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    const editButton = container.querySelector('.bank-card__edit-button');

    expect(editButton).toBeInTheDocument();
  });

  it('должен вызывать onEditClick при клике на кнопку редактирования', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    const editButton = container.querySelector('.bank-card__edit-button');

    if (editButton) {
      await user.click(editButton);
      expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    }
  });

  it('должен отображать кодовую фразу если она указана', () => {
    render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    if (MOCK_CARD.phrase) {
      expect(
        screen.getByTestId('copyable-field-Кодовая фраза'),
      ).toBeInTheDocument();
      expect(screen.getByText(MOCK_CARD.phrase)).toBeInTheDocument();
    }
  });

  it('не должен отображать кодовую фразу если она не указана', () => {
    const cardWithoutPhrase = {
      ...MOCK_CARD,
      phrase: undefined,
    };

    render(
      <BankCardBack
        card={cardWithoutPhrase}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(
      screen.queryByTestId('copyable-field-Кодовая фраза'),
    ).not.toBeInTheDocument();
  });

  it('должен отображать PIN если он указан', () => {
    render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    if (MOCK_CARD.pin) {
      expect(screen.getByTestId('copyable-field-PIN')).toBeInTheDocument();
      expect(screen.getByText(MOCK_CARD.pin)).toBeInTheDocument();
    }
  });

  it('не должен отображать PIN если он не указан', () => {
    const cardWithoutPin = {
      ...MOCK_CARD,
      pin: undefined,
    };

    render(
      <BankCardBack
        card={cardWithoutPin}
        onEditClick={mockOnEditClick}
      />,
    );

    expect(screen.queryByTestId('copyable-field-PIN')).not.toBeInTheDocument();
  });

  it('должен отображать stripe', () => {
    const { container } = render(
      <BankCardBack
        card={MOCK_CARD}
        onEditClick={mockOnEditClick}
      />,
    );

    const stripeElement = container.querySelector('.bank-card__stripe');

    expect(stripeElement).toBeInTheDocument();
  });
});
