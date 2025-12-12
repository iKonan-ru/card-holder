import { useCallback, type ChangeEvent, type FC } from 'react';
import {
  NON_DIGIT_PATTERN,
  ParentClassProvider,
  useFormContext,
} from '@shared/lib';
import type {
  IFormFieldChangeHandler,
  TPropsWithParentClass,
} from '@shared/types';
import { FormField, type IFormFieldProps } from '@shared/ui';

type TFieldFormatter = (value: string) => string;
type TFieldValidator = (value: string) => string | undefined;

interface IValidatedFieldProps
  extends Omit<IFormFieldProps, 'id' | 'onChange' | 'type' | 'autoFocus'>,
    Partial<IFormFieldChangeHandler>,
    TPropsWithParentClass {
  formatter?: TFieldFormatter;
  validator?: TFieldValidator;
  instantValidateLength?: number;
  onValidate?: (name: string, error: string | undefined) => void;
}

export const ValidatedField: FC<IValidatedFieldProps> = ({
  name,
  label,
  value,
  error,
  maxLength,
  disabled,
  required,
  rightContent,
  inputMode,
  autoComplete,
  formatter,
  validator,
  instantValidateLength,
  onChange: onChangeProp,
  onValidate: onValidateProp,
  parentClass,
}) => {
  const { onChange: onChangeContext, onValidate: onValidateContext } =
    useFormContext();

  const onChange = onChangeProp ?? onChangeContext;
  const onValidate = onValidateProp ?? onValidateContext;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!onChange) {
        return;
      }

      const inputValue = event.target.value;
      let processedValue = inputValue;

      if (formatter) {
        processedValue = formatter(inputValue);
      }

      if (maxLength && processedValue.length > maxLength) {
        return;
      }

      onChange(name, processedValue);

      if (!onValidate) {
        return;
      }

      if (instantValidateLength) {
        const unformattedLength = processedValue.replace(
          NON_DIGIT_PATTERN,
          '',
        ).length;
        const shouldInstantValidate =
          validator && unformattedLength === instantValidateLength;
        const shouldClearError = unformattedLength < instantValidateLength;

        if (shouldInstantValidate) {
          const validationError = validator(processedValue);
          onValidate(name, validationError);
        } else if (shouldClearError) {
          onValidate(name, undefined);
        }
      } else if (validator) {
        const validationError = validator(processedValue);
        onValidate(name, validationError);
      }
    },
    [
      name,
      formatter,
      maxLength,
      onChange,
      instantValidateLength,
      validator,
      onValidate,
    ],
  );

  return (
    <ParentClassProvider parentClass={parentClass}>
      <FormField
        id={name}
        name={name}
        label={label}
        value={value}
        error={error}
        onChange={handleChange}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        rightContent={rightContent}
        inputMode={inputMode}
        autoComplete={autoComplete}
      />
    </ParentClassProvider>
  );
};
