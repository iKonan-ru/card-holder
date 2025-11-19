import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ParentClassProvider } from '@shared/lib';
import { Modal } from './modal';

describe('Modal', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать содержимое', () => {
    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
      >
        <div>Содержимое модального окна</div>
      </Modal>
    );

    expect(screen.getByText('Содержимое модального окна')).toBeInTheDocument();
  });

  it('должен вызывать onClose при клике на overlay когда модальное окно верхнее', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <Modal
        onClose={handleClose}
        isTopModal={true}
      >
        <div>Содержимое</div>
      </Modal>
    );

    const overlay = container.querySelector('.modal');
    if (overlay) {
      await user.click(overlay);

      const animationEndEvent = new Event('animationend', {
        bubbles: true,
        cancelable: false,
      });
      Object.defineProperty(animationEndEvent, 'animationName', {
        value: 'fadeOutModal',
        writable: false,
      });
      overlay.dispatchEvent(animationEndEvent);
    }

    await vi.waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('не должен вызывать onClose при клике на контент', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal
        onClose={handleClose}
        isTopModal={true}
      >
        <div>Содержимое</div>
      </Modal>
    );

    const content = screen.getByText('Содержимое');
    await user.click(content);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('не должен вызывать onClose при клике на overlay когда preventClose=true', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <Modal
        onClose={handleClose}
        isTopModal={true}
        preventClose={true}
      >
        <div>Содержимое</div>
      </Modal>
    );

    const overlay = container.querySelector('.modal');
    if (overlay) {
      await user.click(overlay);
    }

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('должен рендерить сложное содержимое', () => {
    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
      >
        <div>
          <h1>Заголовок</h1>
          <p>Текст</p>
          <button>Кнопка</button>
        </div>
      </Modal>
    );

    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Текст')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Кнопка' })).toBeInTheDocument();
  });

  it('не должен вызывать onClose при клике на overlay когда модальное окно не верхнее', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <Modal
        onClose={handleClose}
        isTopModal={false}
      >
        <div>Содержимое</div>
      </Modal>
    );

    const overlay = container.querySelector('.modal');
    if (overlay) {
      await user.click(overlay);
    }

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('должен устанавливать фокус на первый элемент при открытии', () => {
    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
      >
        <div>
          <button>Первая кнопка</button>
          <button>Вторая кнопка</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByRole('button', { name: 'Первая кнопка' });
    expect(firstButton).toHaveFocus();
  });

  it('должен управлять фокусом с помощью Tab', async () => {
    const user = userEvent.setup();

    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
      >
        <div>
          <button>Первая кнопка</button>
          <button>Вторая кнопка</button>
          <button>Третья кнопка</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByRole('button', { name: 'Первая кнопка' });
    const lastButton = screen.getByRole('button', { name: 'Третья кнопка' });

    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Вторая кнопка' })).toHaveFocus();

    await user.tab();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();
  });

  it('должен управлять фокусом с помощью Shift+Tab', async () => {
    const user = userEvent.setup();

    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
      >
        <div>
          <button>Первая кнопка</button>
          <button>Вторая кнопка</button>
          <button>Третья кнопка</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByRole('button', { name: 'Первая кнопка' });
    const lastButton = screen.getByRole('button', { name: 'Третья кнопка' });

    expect(firstButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Вторая кнопка' })).toHaveFocus();
  });

  it('должен устанавливать aria-атрибуты', () => {
    const { container } = render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
        ariaLabelledBy="modal-title"
        ariaDescribedBy="modal-description"
      >
        <div>Содержимое</div>
      </Modal>
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('не должен управлять фокусом если модальное окно не верхнее', () => {
    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={false}
      >
        <div>
          <button>Первая кнопка</button>
          <button>Вторая кнопка</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByRole('button', { name: 'Первая кнопка' });
    expect(firstButton).not.toHaveFocus();
  });

  it('должен добавлять parentClass к корневому элементу из контекста', () => {
    const { container } = render(
      <ParentClassProvider parentClass="custom-parent">
        <Modal
          onClose={vi.fn()}
          isTopModal={true}
        >
          <div>Содержимое</div>
        </Modal>
      </ParentClassProvider>
    );

    expect(
      container.querySelector('.custom-parent__modal')
    ).toBeInTheDocument();
  });

  it('не должен вызывать onClose при mousedown на контенте и mouseup на overlay', async () => {
    const handleClose = vi.fn();

    const { container } = render(
      <Modal
        onClose={handleClose}
        isTopModal={true}
      >
        <div>Содержимое</div>
      </Modal>
    );

    const content = screen.getByText('Содержимое');
    const overlay = container.querySelector('.modal');

    if (overlay && content) {
      content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      overlay.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('должен отображать title если он передан', () => {
    render(
      <Modal
        onClose={vi.fn()}
        isTopModal={true}
        title="Тестовый заголовок"
        ariaLabelledBy="modal-title"
      >
        <div>Содержимое</div>
      </Modal>
    );

    expect(screen.getByText('Тестовый заголовок')).toBeInTheDocument();
  });
});
