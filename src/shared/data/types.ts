export type TBankKeys =
  | 'sberbank'
  | 'vtb24'
  | 'gazprombank'
  | 'alfabank'
  | 'tbank'
  | 'raiffeisen'
  | 'rosbank'
  | 'open'
  | 'citibank'
  | 'mkb'
  | 'uralsib'
  | 'unicredit'
  | 'psbbank'
  | 'ibt'
  | 'domrf'
  | 'ozon'
  | 'wb'
  | 'mts'
  | 'default';

export type TBanksRecord = Record<Exclude<TBankKeys, 'default'>, string[]>;
