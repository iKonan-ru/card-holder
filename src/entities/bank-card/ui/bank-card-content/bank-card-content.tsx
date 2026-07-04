import { type FC } from 'react';
import type { IBankCard } from '@entities/bank-card';
import { bem, formatExpiryDate, maskPan } from '@shared/lib';
import { CopyableField } from '@shared/ui';
import { BANK_CARD_BLOCK } from '../../constants';

interface IBankCardContentProps {
  card: IBankCard;
  typeName?: string | null;
}

export const BankCardContent: FC<IBankCardContentProps> = ({
  card,
  typeName,
}) => {
  return (
    <div className={bem(BANK_CARD_BLOCK, 'content')}>
      {typeName && (
        <div className={bem(BANK_CARD_BLOCK, 'type')}>{typeName}</div>
      )}

      <CopyableField
        value={card.pan}
        maskFn={maskPan}
        modifier="pan"
      />
      <div className={bem(BANK_CARD_BLOCK, 'footer')}>
        <CopyableField
          value={card.name}
          modifier="name"
        />
        <CopyableField
          value={formatExpiryDate(card.expires)}
          modifier="expires"
        />
      </div>
    </div>
  );
};
