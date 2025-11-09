export interface IValidationErrors {
  pan?: string;
  expires?: string;
  name?: string;
  cvv?: string;
  pin?: string;
  phrase?: string;
  [key: string]: string | undefined;
}
