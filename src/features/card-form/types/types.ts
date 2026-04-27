export interface IValidationErrors {
  pan?: string;
  expires?: string;
  name?: string;
  cvv?: string;
  pin?: string;
  phrase?: string;
  [key: string]: string | undefined;
}

export interface IFieldConfig {
  name: string;
  label: string;
  maxLength?: number;
  required?: boolean;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  autoComplete?: string;
  formatter?: (value: string) => string;
  validator?: (value: string) => string | undefined;
  instantValidateLength?: number;
  multiline?: boolean;
}
