import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormField } from './form-field';
import { ParentClassProvider } from '../../lib';

describe('FormField', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать поле ввода с меткой', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Тестовое поле/i)).toBeInTheDocument();
  });

  it('должен отображать значение поля', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value="Тестовое значение"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('Тестовое значение');
  });

  it('должен вызывать onChange при вводе текста', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');

    expect(handleChange).toHaveBeenCalled();
  });

  it('должен отображать сообщение об ошибке', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        error="Ошибка валидации"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('Ошибка валидации')).toBeInTheDocument();
  });

  it('должен добавлять модификатор has-value при наличии значения', () => {
    const { container } = render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value="Значение"
        onChange={vi.fn()}
      />
    );

    expect(
      container.querySelector('.form-field_has-value')
    ).toBeInTheDocument();
  });

  it('должен добавлять модификатор has-error при наличии ошибки', () => {
    const { container } = render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        error="Ошибка"
        onChange={vi.fn()}
      />
    );

    expect(
      container.querySelector('.form-field_has-error')
    ).toBeInTheDocument();
  });

  it('должен учитывать maxLength', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        maxLength={5}
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(5);
  });

  it('должен быть disabled при передаче disabled prop', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        disabled={true}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('должен отображать символ * для обязательных полей', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        required={true}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Тестовое поле \*/)).toBeInTheDocument();
  });

  it('не должен отображать символ * при наличии ошибки', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        error="Ошибка"
        required={true}
        onChange={vi.fn()}
      />
    );

    expect(screen.queryByText(/Тестовое поле \*/)).not.toBeInTheDocument();
    expect(screen.getByText('Ошибка')).toBeInTheDocument();
  });

  it('должен отображать rightContent если передан', () => {
    const { container } = render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        rightContent={<span data-testid="right-content">Right</span>}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('right-content')).toBeInTheDocument();
    expect(
      container.querySelector('.form-field__right-content')
    ).toBeInTheDocument();
  });

  it('должен добавлять модификатор has-right-content при наличии rightContent', () => {
    const { container } = render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        rightContent={<span>Right</span>}
        onChange={vi.fn()}
      />
    );

    expect(
      container.querySelector('.form-field_has-right-content')
    ).toBeInTheDocument();
  });

  it('должен устанавливать inputMode для поля ввода', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        inputMode="numeric"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.inputMode).toBe('numeric');
  });

  it('должен устанавливать aria-invalid при наличии ошибки', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        error="Ошибка валидации"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('не должен устанавливать aria-invalid при отсутствии ошибки', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('должен устанавливать aria-required для обязательных полей', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        required={true}
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('должен устанавливать aria-describedby при наличии ошибки', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        error="Ошибка валидации"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-field-error');
  });

  it('не должен устанавливать aria-describedby при отсутствии ошибки', () => {
    render(
      <FormField
        id="test-field"
        name="test"
        label="Тестовое поле"
        value=""
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('должен добавлять parentClass к корневому элементу из контекста', () => {
    const { container } = render(
      <ParentClassProvider parentClass="custom-parent">
        <FormField
          id="test-field"
          name="test"
          label="Тестовое поле"
          value=""
          onChange={vi.fn()}
        />
      </ParentClassProvider>
    );

    expect(
      container.querySelector('.custom-parent__form-field')
    ).toBeInTheDocument();
  });
});
