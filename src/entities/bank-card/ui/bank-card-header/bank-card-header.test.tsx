import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BankCardHeader } from './bank-card-header';
import type { IBank } from '@entities/bank';
import type { PaymentSystem } from '@shared/lib';

const MOCK_BANK_WITH_NAME: IBank = {
  id: 'sberbank',
  name: 'Сбербанк',
  color: '#000000',
};

const MOCK_BANK_WITHOUT_NAME: IBank = {
  id: 'sberbank',
  name: '',
  color: '#000000',
};

const MOCK_PAYMENT_SYSTEM: PaymentSystem = 'visa';

const mockBankLogos: Partial<Record<string, string>> = {
  sberbank: '/path/to/sberbank.svg',
};

vi.mock('@shared/assets/banks', () => ({
  get bankLogos() {
    return mockBankLogos;
  },
}));

vi.mock('@shared/assets/payment-systems', () => ({
  paymentSystemLogos: {
    visa: '/path/to/visa.svg',
  },
}));

describe('BankCardHeader', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(
      <BankCardHeader
        bank={MOCK_BANK_WITH_NAME}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    if (MOCK_BANK_WITH_NAME.name) {
      expect(screen.getByText(MOCK_BANK_WITH_NAME.name)).toBeInTheDocument();
    }
  });

  it('должен отображать название банка', () => {
    render(
      <BankCardHeader
        bank={MOCK_BANK_WITH_NAME}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    if (MOCK_BANK_WITH_NAME.name) {
      expect(screen.getByText(MOCK_BANK_WITH_NAME.name)).toBeInTheDocument();
    }
  });

  it('не должен отображать название банка если оно пустое', () => {
    const { container } = render(
      <BankCardHeader
        bank={MOCK_BANK_WITHOUT_NAME}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    const bankNameElement = container.querySelector('.bank-card__bank-name');

    expect(bankNameElement).not.toBeInTheDocument();
  });

  it('должен отображать логотип банка если он доступен', () => {
    const { container } = render(
      <BankCardHeader
        bank={MOCK_BANK_WITH_NAME}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    const logoElement = container.querySelector(
      '.bank-card__logo img'
    ) as HTMLImageElement | null;

    expect(logoElement).toBeInTheDocument();
    if (logoElement) {
      expect(logoElement).toHaveAttribute('src', '/path/to/sberbank.svg');
      expect(logoElement).toHaveAttribute('alt', MOCK_BANK_WITH_NAME.id);
    }
  });

  it('должен отображать логотип платежной системы если он доступен', () => {
    const { container } = render(
      <BankCardHeader
        bank={MOCK_BANK_WITH_NAME}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    const paymentSystemElement = container.querySelector(
      '.bank-card__payment-system img'
    ) as HTMLImageElement | null;

    expect(paymentSystemElement).toBeInTheDocument();
    if (paymentSystemElement) {
      expect(paymentSystemElement).toHaveAttribute('src', '/path/to/visa.svg');
      expect(paymentSystemElement).toHaveAttribute('alt', MOCK_PAYMENT_SYSTEM);
    }
  });

  it('не должен отображать логотип платежной системы если paymentSystem = null', () => {
    const { container } = render(
      <BankCardHeader
        bank={MOCK_BANK_WITH_NAME}
        paymentSystem={null}
      />
    );

    const paymentSystemElement = container.querySelector(
      '.bank-card__payment-system'
    );

    expect(paymentSystemElement).not.toBeInTheDocument();
  });

  it('не должен отображать логотип банка если он недоступен', () => {
    const originalBankLogos = mockBankLogos.sberbank;
    delete mockBankLogos.sberbank;

    const bankWithoutLogo: IBank = {
      id: 'sberbank',
      name: 'Unknown Bank',
      color: '#000000',
    };

    const { container } = render(
      <BankCardHeader
        bank={bankWithoutLogo}
        paymentSystem={MOCK_PAYMENT_SYSTEM}
      />
    );

    const logoElement = container.querySelector('.bank-card__logo');

    expect(logoElement).not.toBeInTheDocument();

    if (originalBankLogos) {
      mockBankLogos.sberbank = originalBankLogos;
    }
  });
});
