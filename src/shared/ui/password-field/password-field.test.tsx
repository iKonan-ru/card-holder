import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from './password-field';

describe('PasswordField', () => {
  it('должен рендериться с label', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
  });

  it('должен отображать поле с type="password" по умолчанию', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText('Пароль');

    expect(input).toHaveAttribute('type', 'password');
  });

  it('должен отображать кнопку переключения видимости по умолчанию', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Показать пароль')).toBeInTheDocument();
  });

  it('должен переключать видимость пароля при клике на кнопку', async () => {
    const user = userEvent.setup();

    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value="test123"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText('Пароль');
    const toggleButton = screen.getByLabelText('Показать пароль');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Скрыть пароль')).toBeInTheDocument();
  });

  it('должен вызывать onChange при вводе текста', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Пароль');

    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('должен отображать ошибку', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        error="Слишком короткий пароль"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('Слишком короткий пароль')).toBeInTheDocument();
  });

  it('не должен показывать кнопку переключения если showPasswordToggle=false', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        showPasswordToggle={false}
      />
    );

    expect(screen.queryByLabelText('Показать пароль')).not.toBeInTheDocument();
  });

  it('должен работать в контролируемом режиме', async () => {
    const handleVisibilityChange = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        isPasswordVisible={false}
        onPasswordVisibilityChange={handleVisibilityChange}
      />
    );

    const input = screen.getByLabelText('Пароль');
    const toggleButton = screen.getByLabelText('Показать пароль');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(handleVisibilityChange).toHaveBeenCalledWith(true);

    rerender(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        isPasswordVisible={true}
        onPasswordVisibilityChange={handleVisibilityChange}
      />
    );

    expect(input).toHaveAttribute('type', 'text');
  });

  it('должен применять autoFocus', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        autoFocus={true}
      />
    );

    const input = screen.getByLabelText('Пароль');

    expect(input).toHaveFocus();
  });

  it('должен быть disabled', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        disabled={true}
      />
    );

    const input = screen.getByLabelText('Пароль');

    expect(input).toBeDisabled();
  });

  it('должен быть required', () => {
    const { container } = render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        required={true}
      />
    );

    const input = container.querySelector('#password') as HTMLInputElement;

    expect(input).toBeRequired();
  });

  it('должен применять autoComplete', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value=""
        onChange={vi.fn()}
        autoComplete="new-password"
      />
    );

    const input = screen.getByLabelText('Пароль');

    expect(input).toHaveAttribute('autocomplete', 'new-password');
  });

  it('должен отображать значение', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Пароль"
        value="mypassword"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText('Пароль') as HTMLInputElement;

    expect(input.value).toBe('mypassword');
  });

  it('должен синхронизировать видимость между полями в контролируемом режиме', async () => {
    const user = userEvent.setup();
    let isVisible = false;
    const handleVisibilityChange = vi.fn((newValue: boolean) => {
      isVisible = newValue;
    });

    const { rerender } = render(
      <>
        <PasswordField
          id="password1"
          name="password1"
          label="Пароль 1"
          value=""
          onChange={vi.fn()}
          isPasswordVisible={isVisible}
          onPasswordVisibilityChange={handleVisibilityChange}
        />
        <PasswordField
          id="password2"
          name="password2"
          label="Пароль 2"
          value=""
          onChange={vi.fn()}
          isPasswordVisible={isVisible}
          onPasswordVisibilityChange={handleVisibilityChange}
        />
      </>
    );

    const toggleButton1 = screen.getAllByLabelText('Показать пароль')[0];

    await user.click(toggleButton1);

    expect(handleVisibilityChange).toHaveBeenCalledWith(true);

    rerender(
      <>
        <PasswordField
          id="password1"
          name="password1"
          label="Пароль 1"
          value=""
          onChange={vi.fn()}
          isPasswordVisible={true}
          onPasswordVisibilityChange={handleVisibilityChange}
        />
        <PasswordField
          id="password2"
          name="password2"
          label="Пароль 2"
          value=""
          onChange={vi.fn()}
          isPasswordVisible={true}
          onPasswordVisibilityChange={handleVisibilityChange}
        />
      </>
    );

    const input1 = screen.getByLabelText('Пароль 1');
    const input2 = screen.getByLabelText('Пароль 2');

    expect(input1).toHaveAttribute('type', 'text');
    expect(input2).toHaveAttribute('type', 'text');
  });
});
