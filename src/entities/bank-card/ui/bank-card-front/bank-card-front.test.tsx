import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BankCardFront } from './bank-card-front';
import { MOCK_CARD } from '@test';
import type { IBank } from '@entities/bank';
import type { PaymentSystem } from '@shared/lib';

const MOCK_BANK: IBank = {
  id: 'sberbank',
  name: 'Сбербанк',
  color: '#000000',
};

const MOCK_PAYMENT_SYSTEM: PaymentSystem = 'visa';

vi.mock('../bank-card-header', () => ({
  BankCardHeader: ({
    bank,
    paymentSystem,
  }: {
    bank: IBank;
    paymentSystem: PaymentSystem | null;
  }) => (
    <div data-testid="bank-card-header">
      {bank.name} - {paymentSystem}
    </div>
  ),
}));

vi.mock('../bank-card-content', () => ({
  BankCardContent: ({ card }: { card: typeof MOCK_CARD }) => (
    <div data-testid="bank-card-content">{card.pan}</div>
  ),
}));

describe('BankCardFront', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(
      <BankCardFront
        card={MOCK_CARD}
        bank={MOCK_BANK}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    expect(screen.getByTestId('bank-card-header')).toBeInTheDocument();
  });

  it('должен рендерить BankCardHeader', () => {
    render(
      <BankCardFront
        card={MOCK_CARD}
        bank={MOCK_BANK}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    expect(screen.getByTestId('bank-card-header')).toBeInTheDocument();
  });

  it('должен рендерить BankCardContent', () => {
    render(
      <BankCardFront
        card={MOCK_CARD}
        bank={MOCK_BANK}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    expect(screen.getByTestId('bank-card-content')).toBeInTheDocument();
  });

  it('должен передавать правильные пропсы в BankCardHeader', () => {
    render(
      <BankCardFront
        card={MOCK_CARD}
        bank={MOCK_BANK}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    expect(
      screen.getByText(`${MOCK_BANK.name} - ${MOCK_PAYMENT_SYSTEM}`)
    ).toBeInTheDocument();
  });

  it('должен передавать правильные пропсы в BankCardContent', () => {
    render(
      <BankCardFront
        card={MOCK_CARD}
        bank={MOCK_BANK}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    expect(screen.getByText(MOCK_CARD.pan)).toBeInTheDocument();
  });

  it('должен работать с paymentSystem = null', () => {
    render(
      <BankCardFront
        card={MOCK_CARD}
        bank={MOCK_BANK}
        paymentSystem={null}
      />
    );

    expect(screen.getByTestId('bank-card-header')).toBeInTheDocument();
  });
});
