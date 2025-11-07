import type { IBankCard } from '@entities/bank-card';

export const MOCK_CARD: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
};

export const MOCK_CARD_WITH_OPTIONAL: IBankCard = {
  pan: '5559494202595236',
  expires: '0726',
  name: 'TEST USER',
  cvv: '123',
  pin: '1234',
  order: 0,
  type: 'Тестовая',
  phrase: 'test phrase',
};

export const MOCK_CARD_SECOND: IBankCard = {
  pan: '4377723769243191',
  expires: '0726',
  name: 'USER TWO',
  cvv: '456',
  pin: '5678',
  order: 1,
};

export const MOCK_CARD_THIRD: IBankCard = {
  pan: '9999888877776666',
  expires: '0725',
  name: 'USER THREE',
  cvv: '789',
  pin: '4321',
  order: 2,
};

export const MOCK_CARDS: IBankCard[] = [
  MOCK_CARD,
  MOCK_CARD_SECOND,
  MOCK_CARD_THIRD,
];

export const createMockCard = (
  overrides: Partial<IBankCard> = {}
): IBankCard => ({
  ...MOCK_CARD,
  ...overrides,
});
