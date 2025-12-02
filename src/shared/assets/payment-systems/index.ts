import type { FC } from 'react';
import Humo from './humo.svg?react';
import Jcb from './jcb.svg?react';
import Mastercard from './mastercard.svg?react';
import Mir from './mir.svg?react';
import Uzcard from './uzcard.svg?react';
import Visa from './visa.svg?react';

export const paymentSystemLogos: Record<string, FC<{ className?: string }>> = {
  humo: Humo,
  jcb: Jcb,
  mastercard: Mastercard,
  mir: Mir,
  uzcard: Uzcard,
  visa: Visa,
};
