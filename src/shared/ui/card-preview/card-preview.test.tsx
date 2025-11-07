import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { CardPreview } from './card-preview';

vi.mock('@shared/assets/banks', () => ({
  bankLogos: {
    tbank: 'data:image/svg+xml,test-bank-logo',
  },
}));

vi.mock('@shared/assets/payment-systems', () => ({
  paymentSystemLogos: {
    visa: 'data:image/svg+xml,test-visa-logo',
    mastercard: 'data:image/svg+xml,test-mastercard-logo',
    mir: 'data:image/svg+xml,test-mir-logo',
  },
}));

describe('CardPreview', () => {
  afterEach(() => {
    cleanup();
  });

  it('не должен отображаться без номера карты', () => {
    const { container } = render(<CardPreview pan="" />);
    expect(container.firstChild).toBeNull();
  });

  it('должен отображать превью для Visa', () => {
    const { container } = render(<CardPreview pan="4276300000000001" />);
    expect(container.querySelector('.card-preview')).toBeInTheDocument();
    expect(
      container.querySelector('.card-preview__color-indicator')
    ).toBeInTheDocument();
  });

  it('должен отображать иконки платёжной системы и банка', () => {
    const { container } = render(<CardPreview pan="427630" />);

    const icons = container.querySelectorAll('.card-preview__icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('должен отображать цветовой индикатор банка', () => {
    const { container } = render(<CardPreview pan="4276300000000001" />);

    const colorIndicator = container.querySelector(
      '.card-preview__color-indicator'
    );
    expect(colorIndicator).toBeInTheDocument();
    expect(colorIndicator).toHaveAttribute('style');
  });

  it('должен работать с номерами карт с пробелами', () => {
    const { container } = render(<CardPreview pan="4276 3000 0000 0001" />);
    expect(container.querySelector('.card-preview')).toBeInTheDocument();
  });

  it('должен отображать превью для Mastercard', () => {
    const { container } = render(<CardPreview pan="5536914125525541" />);
    expect(container.querySelector('.card-preview')).toBeInTheDocument();
  });

  it('должен отображать превью для Mir', () => {
    const { container } = render(<CardPreview pan="2200000000000000" />);
    expect(container.querySelector('.card-preview')).toBeInTheDocument();
  });
});
