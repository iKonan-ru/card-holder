import { type FC } from 'react';
import {
  BankCardContent,
  type IBankCard,
  type IBankCardCommonProps,
} from '@entities/bank-card';
import { bem } from '@shared/lib';
import { BANK_CARD_BLOCK } from '../../constants';
import { BankCardHeader } from '../bank-card-header';

interface IBankCardFrontProps extends IBankCardCommonProps {
  card: IBankCard;
  typeName?: string | null;
}

export const BankCardFront: FC<IBankCardFrontProps> = ({
  card,
  bank,
  paymentSystem,
  typeName,
}) => {
  return (
    <div className={bem(BANK_CARD_BLOCK, 'front')}>
      <BankCardHeader
        bank={bank}
        paymentSystem={paymentSystem}
      />
      <BankCardContent
        card={card}
        typeName={typeName}
      />
    </div>
  );
};
