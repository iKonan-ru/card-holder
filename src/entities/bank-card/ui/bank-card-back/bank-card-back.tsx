import { type FC, type MouseEvent } from 'react';
import { FiEdit } from 'react-icons/fi';
import type { IBankCard } from '@entities/bank-card';
import {
  ARIA_HIDDEN_TRUE,
  bem,
  BUTTON_TYPE_BUTTON,
  maskValue,
} from '@shared/lib';
import { CopyableField } from '@shared/ui';
import { BANK_CARD_BLOCK, BANK_CARD_EDIT_LABEL } from '../../constants';

interface IBankCardBackProps {
  card: IBankCard;
  onEditClick: (event: MouseEvent) => void;
}

export const BankCardBack: FC<IBankCardBackProps> = ({ card, onEditClick }) => {
  return (
    <div className={bem(BANK_CARD_BLOCK, 'back')}>
      <div className={bem(BANK_CARD_BLOCK, 'stripe')} />

      <button
        onClick={onEditClick}
        className={bem(BANK_CARD_BLOCK, 'edit-button')}
        type={BUTTON_TYPE_BUTTON}
        aria-label={BANK_CARD_EDIT_LABEL}
      >
        <FiEdit
          className={bem(BANK_CARD_BLOCK, 'edit-icon')}
          aria-hidden={ARIA_HIDDEN_TRUE}
        />
      </button>

      <CopyableField
        value={card.cvv}
        maskFn={maskValue}
        modifier="cvv"
        label="CVV"
      />

      <div className={bem(BANK_CARD_BLOCK, 'bottom')}>
        {card.phrase && (
          <CopyableField
            value={card.phrase}
            maskFn={maskValue}
            modifier="phrase"
            label="Кодовая фраза"
          />
        )}

        {card.pin && (
          <CopyableField
            value={card.pin}
            maskFn={maskValue}
            modifier="pin"
            label="PIN"
          />
        )}
      </div>
    </div>
  );
};
