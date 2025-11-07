import { useCallback, type FC, type ChangeEvent } from 'react';
import type { IValidatedFieldProps } from './model';
import { FormField } from '../form-field';
import { NON_DIGIT_PATTERN } from './lib';

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
  formatter,
  validator,
  instantValidateLength,
  onChange,
  onValidate,
  parentClass,
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
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
          ''
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
    ]
  );

  return (
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
      parentClass={parentClass}
    />
  );
};
