import { type FC } from 'react';
import { bem } from '@shared/lib';
import { BANK_CARD_BLOCK } from '../../lib';
import { BankCardHeader } from '../bank-card-header';
import { BankCardContent } from '../bank-card-content';
import type { IBankCardFrontProps } from './model';

export const BankCardFront: FC<IBankCardFrontProps> = ({
  card,
  bank,
  paymentSystem,
}) => {
  return (
    <div className={bem(BANK_CARD_BLOCK, 'front')}>
      <BankCardHeader
        bank={bank}
        paymentSystem={paymentSystem}
      />
      <BankCardContent card={card} />
    </div>
  );
};
