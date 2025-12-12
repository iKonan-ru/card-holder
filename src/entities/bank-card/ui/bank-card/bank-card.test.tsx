import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IBankCard } from '../../types';
import { BankCard } from './bank-card';

const MOCK_CARD: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
  type: 'Тестовая',
  phrase: 'test phrase',
};

const MOCK_CARD_WITHOUT_OPTIONAL: IBankCard = {
  pan: '4377723769243191',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

describe('BankCard', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должна рендериться с базовыми данными карты', () => {
    render(<BankCard card={MOCK_CARD} />);

    expect(screen.getByText(MOCK_CARD.name)).toBeInTheDocument();
  });

  it('должна отображать тип карты если он указан', () => {
    render(<BankCard card={MOCK_CARD} />);

    expect(screen.getByText('Тестовая')).toBeInTheDocument();
  });

  it('должна не отображать тип карты если он не указан', () => {
    render(<BankCard card={MOCK_CARD_WITHOUT_OPTIONAL} />);

    expect(screen.queryByText('Тестовая')).not.toBeInTheDocument();
  });

  it('должна добавлять класс flipped когда карта перевернута', () => {
    const { container } = render(
      <BankCard
        card={MOCK_CARD}
        isFlipped={true}
      />,
    );
    const cardElement = container.querySelector('.bank-card_flipped');

    expect(cardElement).toBeInTheDocument();
  });

  it('должна не добавлять класс flipped когда карта не перевернута', () => {
    const { container } = render(
      <BankCard
        card={MOCK_CARD}
        isFlipped={false}
      />,
    );
    const cardElement = container.querySelector('.bank-card_flipped');

    expect(cardElement).not.toBeInTheDocument();
  });

  it('должна отображать лейбл CVV на обратной стороне', () => {
    render(<BankCard card={MOCK_CARD} />);

    expect(screen.getByText('CVV')).toBeInTheDocument();
  });

  it('должна отображать кодовую фразу если она указана', () => {
    render(<BankCard card={MOCK_CARD} />);

    expect(screen.getByText('Кодовая фраза')).toBeInTheDocument();
  });

  it('должна отображать PIN если он указан', () => {
    render(<BankCard card={MOCK_CARD} />);

    expect(screen.getByText('PIN')).toBeInTheDocument();
  });

  it('должна не отображать кодовую фразу если она не указана', () => {
    render(<BankCard card={MOCK_CARD_WITHOUT_OPTIONAL} />);

    expect(screen.queryByText('Кодовая фраза')).not.toBeInTheDocument();
  });

  it('должна применять стили с цветом банка', () => {
    const { container } = render(<BankCard card={MOCK_CARD} />);
    const cardElement = container.querySelector('.bank-card') as HTMLElement;

    expect(cardElement).toBeInTheDocument();
    expect(cardElement.style.getPropertyValue('--color')).toBeTruthy();
  });

  it('должна отображать логотип платежной системы', () => {
    const { container } = render(<BankCard card={MOCK_CARD} />);
    const paymentSystemElement = container.querySelector(
      '.bank-card__payment-system',
    );

    expect(paymentSystemElement).toBeInTheDocument();
  });

  it('должна отображать логотип банка', () => {
    const { container } = render(<BankCard card={MOCK_CARD} />);
    const bankLogoElement = container.querySelector('.bank-card__logo');

    expect(bankLogoElement).toBeInTheDocument();
  });

  it('должна содержать front и back стороны', () => {
    const { container } = render(<BankCard card={MOCK_CARD} />);
    const frontElement = container.querySelector('.bank-card__front');
    const backElement = container.querySelector('.bank-card__back');

    expect(frontElement).toBeInTheDocument();
    expect(backElement).toBeInTheDocument();
  });

  it('должна отображать кнопку редактирования на обратной стороне', () => {
    const { container } = render(<BankCard card={MOCK_CARD} />);
    const editButton = container.querySelector('.bank-card__edit-button');

    expect(editButton).toBeInTheDocument();
  });

  it('должна добавлять класс reorder-mode в режиме переупорядочивания', () => {
    const { container } = render(
      <BankCard
        card={MOCK_CARD}
        isReorderMode={true}
      />,
    );

    const cardElement = container.querySelector('.bank-card_reorder-mode');
    expect(cardElement).toBeInTheDocument();
  });
});
