import { type FC } from 'react';
import { bem, formatExpiryDate, maskPan } from '@shared/lib';
import { CopyableField } from '@shared/ui';
import { BANK_CARD_BLOCK } from '../../lib';
import type { IBankCardContentProps } from './model';

export const BankCardContent: FC<IBankCardContentProps> = ({ card }) => {
  return (
    <div className={bem(BANK_CARD_BLOCK, 'content')}>
      {card.type && (
        <div className={bem(BANK_CARD_BLOCK, 'type')}>{card.type}</div>
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
