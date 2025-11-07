import type { IBank } from '@entities/bank';

export const BANKS_LIST: IBank[] = [
  {
    id: 'sberbank',
    name: 'Сбербанк',
    color: '#1a9f29',
  },
  {
    id: 'vtb24',
    name: 'ВТБ',
    color: '#0a2972',
  },
  {
    id: 'gazprombank',
    name: 'Газпромбанк',
    color: '#02356c',
  },
  {
    id: 'alfabank',
    name: 'Альфа-Банк',
    color: '#f03226',
  },
  {
    id: 'tbank',
    name: 'Т-Банк',
    color: '#231f20',
  },
  {
    id: 'raiffeisen',
    name: 'Райффайзенбанк',
    color: '#fff104',
    isDarkText: true,
  },
  {
    id: 'rosbank',
    name: 'Росбанк',
    color: '#e7002a',
  },
  {
    id: 'open',
    name: 'Открытие',
    color: '#00bbe4',
  },
  {
    id: 'citibank',
    name: 'Ситибанк',
    color: '#003b70',
  },
  {
    id: 'mkb',
    name: 'МКБ',
    color: '#b3002d',
  },
  {
    id: 'uralsib',
    name: 'УралСиб',
    color: '#1e398d',
  },
  {
    id: 'unicredit',
    name: 'ЮниКредит Банк',
    color: '#e30613',
  },
  {
    id: 'psbbank',
    name: 'ПСБ',
    color: '#2647a3',
  },
  {
    id: 'ibt',
    name: 'МБТ',
    color: '#145f85',
  },
  {
    id: 'domrf',
    name: 'Дом РФ',
    color: '#2f444e',
  },
];

export const DEFAULT_BANK: IBank = {
  id: 'default',
  color: '#7c7397',
};
