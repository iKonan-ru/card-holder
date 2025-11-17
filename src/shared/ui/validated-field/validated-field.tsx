import { useCallback, type FC, type ChangeEvent } from 'react';
import type { IValidatedFieldProps } from './model';
import { FormField } from '@shared/ui';
import { ParentClassProvider, useFormContext } from '@shared/lib';
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
