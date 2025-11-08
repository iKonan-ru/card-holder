export interface IBankCard {
  pan: string;
  expires: string;
  name: string;
  cvv: string;
  pin?: string;
  order: number;
  type?: string;
  phrase?: string;
}
