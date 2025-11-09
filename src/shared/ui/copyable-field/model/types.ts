export interface ICopyableFieldProps {
  value: string;
  title?: string;
  label?: string;
  modifier?: string;
  maskFn?: (value: string, showValue?: boolean) => string;
}
