import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormProvider, useFormContext } from './form.tsx';

const TestComponent = () => {
  const { onChange, onValidate } = useFormContext();

  const handleTestChange = () => {
    if (onChange) {
      onChange('test-field', 'test-value');
    }
  };

  const handleTestValidate = () => {
    if (onValidate) {
      onValidate('test-field', 'test-error');
    }
  };

  return (
    <div>
      <button
        data-testid="change-button"
        onClick={handleTestChange}
      >
        Change
      </button>
      <button
        data-testid="validate-button"
        onClick={handleTestValidate}
      >
        Validate
      </button>
    </div>
  );
};

describe('FormContext', () => {
  it('должен предоставлять undefined значения по умолчанию', () => {
    render(<TestComponent />);

    const changeButton = screen.getByTestId('change-button');
    const validateButton = screen.getByTestId('validate-button');

    expect(changeButton).toBeInTheDocument();
    expect(validateButton).toBeInTheDocument();
  });

  it('должен передавать onChange из провайдера', () => {
    const handleChange = vi.fn();

    render(
      <FormProvider onChange={handleChange}>
        <TestComponent />
      </FormProvider>
    );

    const changeButton = screen.getByTestId('change-button');

    changeButton.click();

    expect(handleChange).toHaveBeenCalledWith('test-field', 'test-value');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('должен передавать onValidate из провайдера', () => {
    const handleValidate = vi.fn();

    render(
      <FormProvider onValidate={handleValidate}>
        <TestComponent />
      </FormProvider>
    );

    const validateButton = screen.getByTestId('validate-button');

    validateButton.click();

    expect(handleValidate).toHaveBeenCalledWith('test-field', 'test-error');
    expect(handleValidate).toHaveBeenCalledTimes(1);
  });

  it('должен передавать оба обработчика одновременно', () => {
    const handleChange = vi.fn();
    const handleValidate = vi.fn();

    render(
      <FormProvider
        onChange={handleChange}
        onValidate={handleValidate}
      >
        <TestComponent />
      </FormProvider>
    );

    const changeButton = screen.getByTestId('change-button');
    const validateButton = screen.getByTestId('validate-button');

    changeButton.click();
    validateButton.click();

    expect(handleChange).toHaveBeenCalledWith('test-field', 'test-value');
    expect(handleValidate).toHaveBeenCalledWith('test-field', 'test-error');
  });

  it('должен мемоизировать значения контекста', () => {
    const handleChange = vi.fn();
    const handleValidate = vi.fn();

    const { rerender } = render(
      <FormProvider
        onChange={handleChange}
        onValidate={handleValidate}
      >
        <TestComponent />
      </FormProvider>
    );

    const firstChange = handleChange;

    rerender(
      <FormProvider
        onChange={handleChange}
        onValidate={handleValidate}
      >
        <TestComponent />
      </FormProvider>
    );

    const changeButton = screen.getByTestId('change-button');

    changeButton.click();

    expect(firstChange).toHaveBeenCalled();
  });

  it('должен обновлять значения при изменении props', () => {
    const firstHandleChange = vi.fn();
    const secondHandleChange = vi.fn();

    const { rerender } = render(
      <FormProvider onChange={firstHandleChange}>
        <TestComponent />
      </FormProvider>
    );

    const changeButton = screen.getByTestId('change-button');

    changeButton.click();

    expect(firstHandleChange).toHaveBeenCalledTimes(1);

    rerender(
      <FormProvider onChange={secondHandleChange}>
        <TestComponent />
      </FormProvider>
    );

    changeButton.click();

    expect(firstHandleChange).toHaveBeenCalledTimes(1);
    expect(secondHandleChange).toHaveBeenCalledTimes(1);
  });

  it('должен возвращать контекст при вызове useFormContext внутри Provider', () => {
    const handleChange = vi.fn();
    const handleValidate = vi.fn();

    render(
      <FormProvider
        onChange={handleChange}
        onValidate={handleValidate}
      >
        <TestComponent />
      </FormProvider>
    );

    expect(handleChange).toBeDefined();
    expect(handleValidate).toBeDefined();
  });

  it('должен возвращать значение контекста при вызове useFormContext', () => {
    const TestContextComponent = () => {
      const context = useFormContext();

      return (
        <div>
          <div data-testid="has-onchange">
            {context.onChange ? 'has-onchange' : 'no-onchange'}
          </div>
          <div data-testid="has-onvalidate">
            {context.onValidate ? 'has-onvalidate' : 'no-onvalidate'}
          </div>
        </div>
      );
    };

    const handleChange = vi.fn();
    const handleValidate = vi.fn();

    render(
      <FormProvider
        onChange={handleChange}
        onValidate={handleValidate}
      >
        <TestContextComponent />
      </FormProvider>
    );

    expect(screen.getByTestId('has-onchange')).toHaveTextContent(
      'has-onchange'
    );
    expect(screen.getByTestId('has-onvalidate')).toHaveTextContent(
      'has-onvalidate'
    );
  });
});
