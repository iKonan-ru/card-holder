import { type FC } from 'react';
import { ParentClassProvider, useClassName } from '@shared/lib';
import {
  BANK_CARD_BLOCK,
  DEFAULT_IS_FLIPPED,
  DEFAULT_IS_REORDER_MODE,
} from '../../constants';
import { useBankCard } from '../../hooks';
import type { IBankCard } from '../../types';
import { BankCardBack } from '../bank-card-back';
import { BankCardFront } from '../bank-card-front';
import './bank-card.less';

interface IBankCardProps {
  card: IBankCard;
  isFlipped?: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
  isReorderMode?: boolean;
}

export const BankCard: FC<IBankCardProps> = ({
  card,
  isFlipped = DEFAULT_IS_FLIPPED,
  onFlip,
  onEdit,
  isReorderMode = DEFAULT_IS_REORDER_MODE,
}) => {
  const {
    bank,
    paymentSystem,
    cardStyle,
    modifiers,
    handleCardClick,
    handleEditClick,
  } = useBankCard({
    card,
    isFlipped,
    isReorderMode,
    onFlip,
    onEdit,
  });

  const className = useClassName({
    blockName: BANK_CARD_BLOCK,
    modifiers,
  });

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={handleCardClick}
    >
      <ParentClassProvider parentClass={BANK_CARD_BLOCK}>
        <BankCardFront
          card={card}
          bank={bank}
          paymentSystem={paymentSystem}
        />
        <BankCardBack
          card={card}
          onEditClick={handleEditClick}
        />
      </ParentClassProvider>
    </div>
  );
};
