import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValidatedField } from './validated-field';

describe('ValidatedField', () => {
  afterEach(() => {
    cleanup();
  });

  it('должен отображать поле с меткой', () => {
    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Тестовое поле/i)).toBeInTheDocument();
  });

  it('должен вызывать onChange с именем поля и значением', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="testField"
        label="Тестовое поле"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalledWith('testField', 'a');
  });

  it('должен применять форматтер к значению', async () => {
    const handleChange = vi.fn();
    const formatter = (value: string) => value.toUpperCase();
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        formatter={formatter}
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'c');

    expect(handleChange).toHaveBeenCalledWith('test', 'C');
  });

  it('должен применять валидатор при instantValidateLength', async () => {
    const handleChange = vi.fn();
    const handleValidate = vi.fn();
    const validator = (value: string) =>
      value.length === 3 ? undefined : 'Должно быть 3 символа';
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        validator={validator}
        instantValidateLength={3}
        onChange={handleChange}
        onValidate={handleValidate}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '123');

    expect(handleValidate).toHaveBeenCalledWith('test', undefined);
  });

  it('должен очищать ошибку при неполном вводе', async () => {
    const handleChange = vi.fn();
    const handleValidate = vi.fn();
    const validator = vi.fn();
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        validator={validator}
        instantValidateLength={4}
        onChange={handleChange}
        onValidate={handleValidate}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '12');

    expect(handleValidate).toHaveBeenCalledWith('test', undefined);
    expect(validator).not.toHaveBeenCalled();
  });

  it('должен применять валидатор без instantValidateLength', async () => {
    const handleChange = vi.fn();
    const handleValidate = vi.fn();
    const validator = (value: string) =>
      value ? undefined : 'Обязательное поле';
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        validator={validator}
        onChange={handleChange}
        onValidate={handleValidate}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleValidate).toHaveBeenCalledWith('test', undefined);
  });

  it('не должен применять валидатор без onValidate', async () => {
    const handleChange = vi.fn();
    const validator = vi.fn();
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        validator={validator}
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');

    expect(validator).not.toHaveBeenCalled();
  });

  it('должен ограничивать длину по maxLength', () => {
    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        maxLength={3}
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(3);
  });

  it('должен передавать disabled в FormField', () => {
    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        disabled={true}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('должен передавать required в FormField', () => {
    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        required={true}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Тестовое поле \*/)).toBeInTheDocument();
  });

  it('должен отображать ошибку', () => {
    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        error="Ошибка валидации"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Ошибка валидации')).toBeInTheDocument();
  });

  it('не должен вызывать onChange если он не передан', async () => {
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'test');

    expect(input.value).toBe('');
  });

  it('должен ограничивать ввод при превышении maxLength', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        maxLength={3}
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '1234');

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).not.toHaveBeenCalledWith('test', '1234');

    const allCalls = handleChange.mock.calls;
    const allValues = allCalls.map((call) => call[1]).filter(Boolean);
    const maxLengthValue = Math.max(
      ...allValues.map((value) =>
        typeof value === 'string' ? value.length : 0,
      ),
    );
    expect(maxLengthValue).toBeLessThanOrEqual(3);
  });

  it('должен обрабатывать случай когда onChange не передан и maxLength превышен', async () => {
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        maxLength={3}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, '1234');

    expect(input.value).toBe('');
  });

  it('должен предотвращать ввод при превышении maxLength даже после форматирования', async () => {
    const handleChange = vi.fn();
    const formatter = (value: string) => value.replace(/\s/g, '');
    const user = userEvent.setup();

    render(
      <ValidatedField
        name="test"
        label="Тестовое поле"
        value=""
        maxLength={3}
        formatter={formatter}
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '1234');

    const allValues = handleChange.mock.calls.map((call) => call[1]);
    const maxLengthValue = Math.max(
      ...allValues.map((value) =>
        typeof value === 'string' ? value.length : 0,
      ),
    );

    expect(maxLengthValue).toBeLessThanOrEqual(3);
  });
});
