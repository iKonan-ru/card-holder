import {
  useCallback,
  useMemo,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import type { IBank } from '@entities/bank';
import type { TPaymentSystem } from '@entities/payment-system';
import { BANKS_LIST, DEFAULT_BANK } from '@shared/data';
import {
  bem,
  buildModifiers,
  darkenColor,
  getBankByCardNumber,
  getPaymentSystem,
  getTextColorStyle,
} from '@shared/lib';
import {
  BANK_CARD_BLOCK,
  BANK_CARD_MODIFIER_DARK_TEXT,
  BANK_CARD_MODIFIER_FLIPPED,
  BANK_CARD_MODIFIER_REORDER_MODE,
  CARD_COLOR_DARKEN_PERCENTAGE,
} from '../constants';
import type { IBankCard } from '../types';

interface IUseBankCardParams {
  card: IBankCard;
  isFlipped: boolean;
  isReorderMode: boolean;
  onFlip?: (pan: string) => void;
  onEdit?: (card: IBankCard) => void;
}

interface IUseBankCardResult {
  bank: IBank;
  paymentSystem: TPaymentSystem | null;
  cardStyle: CSSProperties;
  modifiers: string[];
  handleCardClick: (event: MouseEvent) => void;
  handleEditClick: (event: MouseEvent) => void;
}

export const useBankCard = ({
  card,
  isFlipped,
  isReorderMode,
  onFlip,
  onEdit,
}: IUseBankCardParams): IUseBankCardResult => {
  const paymentSystem = useMemo(() => getPaymentSystem(card.pan), [card.pan]);

  const bankId = useMemo(() => getBankByCardNumber(card.pan), [card.pan]);

  const bank = useMemo(
    () => BANKS_LIST.find((bankItem) => bankItem.id === bankId) || DEFAULT_BANK,
    [bankId],
  );

  const { color, isDarkText } = bank;

  const handleCardClick = useCallback(
    (event: MouseEvent) => {
      if (isReorderMode) {
        return;
      }

      const isClickOnActions = (event.target as HTMLElement).closest(
        `.${bem(BANK_CARD_BLOCK, 'actions')}`,
      );

      if (!isClickOnActions && onFlip) {
        onFlip(card.pan);
      }
    },
    [isReorderMode, onFlip, card.pan],
  );

  const handleEditClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();

      if (onEdit) {
        onEdit(card);
      }
    },
    [onEdit, card],
  );

  const cardStyle = useMemo(
    () =>
      ({
        '--color': color,
        '--color-dark': darkenColor(color, CARD_COLOR_DARKEN_PERCENTAGE),
        ...getTextColorStyle(isDarkText),
      }) as CSSProperties,
    [color, isDarkText],
  );

  const modifiers = useMemo(
    () =>
      buildModifiers(
        isFlipped && BANK_CARD_MODIFIER_FLIPPED,
        isReorderMode && BANK_CARD_MODIFIER_REORDER_MODE,
        isDarkText && BANK_CARD_MODIFIER_DARK_TEXT,
      ),
    [isFlipped, isReorderMode, isDarkText],
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
