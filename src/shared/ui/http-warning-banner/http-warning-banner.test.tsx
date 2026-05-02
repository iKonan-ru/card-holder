import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HTTP_WARNING_MESSAGE } from '@shared/lib';
import { HttpWarningBanner } from './http-warning-banner';

describe('HttpWarningBanner', () => {
  it('должен отображать предупреждающее сообщение', () => {
    render(<HttpWarningBanner />);

    expect(screen.getByText(HTTP_WARNING_MESSAGE)).toBeInTheDocument();
  });

  it('должен иметь role="alert"', () => {
    render(<HttpWarningBanner />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('текст предупреждения должен быть внутри alert-элемента', () => {
    render(<HttpWarningBanner />);

    expect(screen.getByRole('alert')).toHaveTextContent(HTTP_WARNING_MESSAGE);
  });
});
