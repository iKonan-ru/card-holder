import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SUCCESS_MODAL_BUTTON_TEXT } from '../../lib';
import { SuccessModal } from './success-modal';

describe('SuccessModal', () => {
  it('должен отрисовываться с сообщением', () => {
    render(
      <SuccessModal
        message="Success message"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('должен иметь кнопку закрытия', () => {
    render(
      <SuccessModal
        message="Success message"
        onClose={vi.fn()}
      />
    );

    const closeButton = screen.getByRole('button', {
      name: SUCCESS_MODAL_BUTTON_TEXT,
    });

    expect(closeButton).toBeInTheDocument();
  });

  it('должен вызывать onClose при клике на кнопку', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <SuccessModal
        message="Success message"
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByRole('button', {
      name: SUCCESS_MODAL_BUTTON_TEXT,
    });
    await user.click(closeButton);

    await vi.waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('должен отображать разные сообщения', () => {
    const { rerender } = render(
      <SuccessModal
        message="First message"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('First message')).toBeInTheDocument();

    rerender(
      <SuccessModal
        message="Second message"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });
});
