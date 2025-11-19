import type { IBankCard, IBankCardCommonProps } from '@entities/bank-card';
import { type FC } from 'react';
import { bem } from '@shared/lib';
import { BANK_CARD_BLOCK } from '../../lib';
import { BankCardHeader } from '../bank-card-header';
import { BankCardContent } from '../bank-card-content';

interface IBankCardFrontProps extends IBankCardCommonProps {
  card: IBankCard;
}

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
