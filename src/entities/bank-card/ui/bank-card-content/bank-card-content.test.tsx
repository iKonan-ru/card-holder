import { MOCK_CARD } from '@test';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BankCardContent } from './bank-card-content';

vi.mock('@shared/ui', () => ({
  CopyableField: ({
    value,
    modifier,
  }: {
    value: string;
    modifier?: string;
  }) => (
    <div data-testid={`copyable-field-${modifier || 'no-modifier'}`}>
      {value}
    </div>
  ),
}));

describe('BankCardContent', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('должен рендериться', () => {
    render(<BankCardContent card={MOCK_CARD} />);

    expect(screen.getByTestId('copyable-field-pan')).toBeInTheDocument();
  });

  it('должен отображать номер карты', () => {
    render(<BankCardContent card={MOCK_CARD} />);

    expect(screen.getByTestId('copyable-field-pan')).toBeInTheDocument();
  });

  it('должен отображать имя держателя карты', () => {
    render(<BankCardContent card={MOCK_CARD} />);

    expect(screen.getByTestId('copyable-field-name')).toBeInTheDocument();
    expect(screen.getByText(MOCK_CARD.name)).toBeInTheDocument();
  });

  it('должен отображать дату истечения', () => {
    render(<BankCardContent card={MOCK_CARD} />);

    expect(screen.getByTestId('copyable-field-expires')).toBeInTheDocument();
  });

  it('должен отображать footer с именем и датой истечения', () => {
    render(<BankCardContent card={MOCK_CARD} />);

    expect(screen.getByTestId('copyable-field-name')).toBeInTheDocument();
    expect(screen.getByTestId('copyable-field-expires')).toBeInTheDocument();
  });
});
