import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('должен рендериться с текстом', () => {
    render(<Button>Нажми меня</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('Нажми меня');
  });

  it('должен применять variant primary по умолчанию', () => {
    render(<Button>Кнопка</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button_primary');
  });

  it('должен применять указанный variant', () => {
    render(<Button variant="secondary">Кнопка</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('button_secondary');
  });

  it('должен применять variant danger', () => {
    render(<Button variant="danger">Удалить</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('button_danger');
  });

  it('должен обрабатывать клики', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Кнопка</Button>);

    const button = screen.getByRole('button');

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('должен быть disabled при передаче пропа disabled', () => {
    render(<Button disabled={true}>Кнопка</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('должен быть disabled при isLoading', () => {
    render(<Button isLoading={true}>Кнопка</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('должен показывать лоадер при isLoading', () => {
    render(<Button isLoading={true}>Кнопка</Button>);

    expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
  });

  it('должен скрывать текст при isLoading', () => {
    render(<Button isLoading={true}>Кнопка</Button>);

    const textElement = screen.getByText('Кнопка');

    expect(textElement).toHaveClass('button__text');
    expect(textElement).toHaveClass('button__text_hidden');
  });

  it('не должен показывать лоадер когда isLoading = false', () => {
    render(<Button isLoading={false}>Кнопка</Button>);

    expect(screen.queryByLabelText('Загрузка')).not.toBeInTheDocument();
  });

  it('должен применять класс full-width', () => {
    render(<Button fullWidth={true}>Кнопка</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('button_full-width');
  });

  it('должен передавать type кнопки', () => {
    render(<Button type="submit">Отправить</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
  });

  it('должен использовать type="button" по умолчанию', () => {
    render(<Button>Кнопка</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
  });

  it('должен передавать aria-label', () => {
    render(<Button aria-label="Закрыть окно">X</Button>);

    const button = screen.getByRole('button', { name: 'Закрыть окно' });

    expect(button).toBeInTheDocument();
  });

  it('не должен вызывать onClick при disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button
        onClick={handleClick}
        disabled={true}
      >
        Кнопка
      </Button>
    );

    const button = screen.getByRole('button');

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('не должен вызывать onClick при isLoading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button
        onClick={handleClick}
        isLoading={true}
      >
        Кнопка
      </Button>
    );

    const button = screen.getByRole('button');

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
