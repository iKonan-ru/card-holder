import {
  type MouseEvent,
  type CSSProperties,
  useMemo,
  useCallback,
} from 'react';
import { BANKS_LIST, DEFAULT_BANK } from '@shared/data/banks-config';
import {
  bem,
  darkenColor,
  getBankByCardNumber,
  getPaymentSystem,
} from '@shared/lib';
import {
  BANK_CARD_BLOCK,
  BANK_CARD_MODIFIER_FLIPPED,
  BANK_CARD_MODIFIER_REORDER_MODE,
  CARD_COLOR_DARKEN_PERCENTAGE,
} from '../constants';
import type { IBankCard } from '../../model';

interface IUseBankCardParams {
  card: IBankCard;
  isFlipped: boolean;
  isReorderMode: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
}

export const useBankCard = ({
  card,
  isFlipped,
  isReorderMode,
  onFlip,
  onEdit,
}: IUseBankCardParams) => {
  const paymentSystem = useMemo(() => getPaymentSystem(card.pan), [card.pan]);

  const bankId = useMemo(() => getBankByCardNumber(card.pan), [card.pan]);

  const bank = useMemo(
    () => BANKS_LIST.find((bankItem) => bankItem.id === bankId) || DEFAULT_BANK,
    [bankId]
  );

  const handleCardClick = useCallback(
    (event: MouseEvent) => {
      if (isReorderMode) {
        return;
      }

      const isClickOnActions = (event.target as HTMLElement).closest(
        `.${bem(BANK_CARD_BLOCK, 'actions')}`
      );

      if (!isClickOnActions && onFlip) {
        onFlip(card.pan);
      }
    },
    [isReorderMode, onFlip, card.pan]
  );

  const handleEditClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();

      if (onEdit) {
        onEdit(card);
      }
    },
    [onEdit, card]
  );

  const cardStyle = useMemo(
    () =>
      ({
        '--color': bank.color,
        '--color-dark': darkenColor(bank.color, CARD_COLOR_DARKEN_PERCENTAGE),
      }) as CSSProperties,
    [bank.color]
  );

  const modifiers = useMemo(
    () =>
      [
        isFlipped && BANK_CARD_MODIFIER_FLIPPED,
        isReorderMode && BANK_CARD_MODIFIER_REORDER_MODE,
      ].filter(Boolean) as string[],
    [isFlipped, isReorderMode]
  );

  return {
    bank,
    paymentSystem,
    cardStyle,
    modifiers,
    handleCardClick,
    handleEditClick,
  };
};
