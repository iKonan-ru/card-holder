import {
  type MouseEvent,
  type CSSProperties,
  useMemo,
  useCallback,
} from 'react';
import { BANKS_LIST, DEFAULT_BANK } from '@shared/data';
import {
  bem,
  darkenColor,
  getBankByCardNumber,
  getPaymentSystem,
  getTextColorStyle,
} from '@shared/lib';
import {
  BANK_CARD_BLOCK,
  BANK_CARD_MODIFIER_FLIPPED,
  BANK_CARD_MODIFIER_REORDER_MODE,
  BANK_CARD_MODIFIER_DARK_TEXT,
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

  const { color, isDarkText } = bank;

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
        '--color': color,
        '--color-dark': darkenColor(color, CARD_COLOR_DARKEN_PERCENTAGE),
        ...getTextColorStyle(isDarkText),
      }) as CSSProperties,
    [color, isDarkText]
  );

  const modifiers = useMemo(
    () =>
      [
        isFlipped && BANK_CARD_MODIFIER_FLIPPED,
        isReorderMode && BANK_CARD_MODIFIER_REORDER_MODE,
        isDarkText && BANK_CARD_MODIFIER_DARK_TEXT,
      ].filter(Boolean) as string[],
    [isFlipped, isReorderMode, isDarkText]
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
