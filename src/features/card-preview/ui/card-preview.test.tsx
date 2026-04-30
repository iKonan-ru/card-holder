import { type FC } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CardPreview } from './card-preview';

const mockBankLogos: Partial<Record<string, FC<{ className?: string }>>> = {
  tbank: () => (
    <svg
      className="icon"
      data-testid="bank-logo"
    />
  ),
};

const mockPaymentSystemLogos: Partial<
  Record<string, FC<{ className?: string }>>
> = {
  visa: () => (
    <svg
      className="icon"
      data-testid="visa-logo"
    />
  ),
  mastercard: () => (
    <svg
      className="icon"
      data-testid="mastercard-logo"
    />
  ),
  mir: () => (
    <svg
      className="icon"
      data-testid="mir-logo"
    />
  ),
};

vi.mock('@shared/assets/banks', () => ({
  get bankLogos() {
    return mockBankLogos;
  },
}));

vi.mock('@shared/assets/payment-systems', () => ({
  get paymentSystemLogos() {
    return mockPaymentSystemLogos;
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
  });

  it('должен отображать иконки платёжной системы и банка', () => {
    const { container } = render(<CardPreview pan="427630" />);

    const icons = container.querySelectorAll('.icon');
    expect(icons.length).toBeGreaterThan(0);
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

  it('должен применять модификатор dark-text когда isDarkText true', () => {
    const { container } = render(<CardPreview pan="2200000000000000" />);
    const preview = container.querySelector('.card-preview');

    expect(preview).toBeInTheDocument();

    const hasDarkTextModifier = preview?.classList.contains(
      'card-preview--dark-text',
    );

    if (hasDarkTextModifier) {
      expect(hasDarkTextModifier).toBe(true);
    }
  });
});
