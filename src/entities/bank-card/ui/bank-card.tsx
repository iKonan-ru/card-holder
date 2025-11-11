import {
  type FC,
  type MouseEvent,
  type CSSProperties,
  useMemo,
  useCallback,
} from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { BANKS_LIST, DEFAULT_BANK } from '@shared/data/banks-config';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import {
  bem,
  useClassName,
  ParentClassProvider,
  darkenColor,
  formatExpiryDate,
  getBankByCardNumber,
  getPaymentSystem,
  maskPan,
  maskValue,
  INITIAL_FALSE,
  KEY_ENTER,
  KEY_SPACE,
  ARIA_ROLE_BUTTON,
  ARIA_HIDDEN_TRUE,
  ARIA_TABINDEX_INTERACTIVE,
  BUTTON_TYPE_BUTTON,
} from '@shared/lib';
import { CopyableField } from '@shared/ui';
import {
  BANK_CARD_BLOCK,
  BANK_CARD_ACTIONS_BLOCK,
  BANK_CARD_FLIP_LABEL,
  BANK_CARD_EDIT_LABEL,
  CARD_COLOR_DARKEN_PERCENTAGE,
  BANK_CARD_MODIFIER_FLIPPED,
  BANK_CARD_MODIFIER_REORDER_MODE,
  DEFAULT_IS_FLIPPED,
  DEFAULT_IS_REORDER_MODE,
} from '../lib/constants';
import type { IBankCardProps } from './model';
import './bank-card.less';

export const BankCard: FC<IBankCardProps> = ({
  card,
  isFlipped = DEFAULT_IS_FLIPPED,
  onFlip,
  onEdit,
  isReorderMode = DEFAULT_IS_REORDER_MODE,
}) => {
  const paymentSystem = useMemo(() => getPaymentSystem(card.pan), [card.pan]);
  const bankId = useMemo(() => getBankByCardNumber(card.pan), [card.pan]);
  const bank = useMemo(
    () => BANKS_LIST.find((bank) => bank.id === bankId) || DEFAULT_BANK,
    [bankId]
  );

  const handleCardClick = useCallback(
    (event: MouseEvent) => {
      if (isReorderMode) {
        return;
      }

      const isClickOnActions = (event.target as HTMLElement).closest(
        `.${BANK_CARD_ACTIONS_BLOCK}`
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

  const className = useClassName({
    blockName: BANK_CARD_BLOCK,
    modifiers,
  });

  const maskedPan = useMemo(() => maskPan(card.pan, INITIAL_FALSE), [card.pan]);
  const cardAriaLabel = useMemo(
    () =>
      `Банковская карта ${bank.name || ''} ${maskedPan}. ${BANK_CARD_FLIP_LABEL}`,
    [bank.name, maskedPan]
  );

  return (
    <>
      <div
        role={ARIA_ROLE_BUTTON}
        tabIndex={ARIA_TABINDEX_INTERACTIVE}
        className={className}
        style={cardStyle}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          const isEnterOrSpace =
            event.key === KEY_ENTER || event.key === KEY_SPACE;

          if (isEnterOrSpace && onFlip) {
            event.preventDefault();
            onFlip(card.pan);
          }
        }}
        aria-label={cardAriaLabel}
        aria-pressed={isFlipped}
      >
        <ParentClassProvider parentClass={BANK_CARD_BLOCK}>
          <div className={bem(BANK_CARD_BLOCK, 'front')}>
            <div className={bem(BANK_CARD_BLOCK, 'header')}>
              {bank.name && (
                <>
                  {bankLogos[bank.id] && (
                    <div
                      className={bem(BANK_CARD_BLOCK, 'logo')}
                      aria-hidden={ARIA_HIDDEN_TRUE}
                    >
                      <img
                        src={bankLogos[bank.id]}
                        alt={bank.id}
                      />
                    </div>
                  )}

                  {bank.name && (
                    <div className={bem(BANK_CARD_BLOCK, 'bank-name')}>
                      {bank.name}
                    </div>
                  )}
                </>
              )}

              {paymentSystem && (
                <div
                  className={bem(BANK_CARD_BLOCK, 'payment-system')}
                  aria-hidden={ARIA_HIDDEN_TRUE}
                >
                  <img
                    src={paymentSystemLogos[paymentSystem]}
                    alt={paymentSystem}
                  />
                </div>
              )}
            </div>

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
          </div>

          <div className={bem(BANK_CARD_BLOCK, 'back')}>
            <div className={bem(BANK_CARD_BLOCK, 'stripe')} />

            <button
              onClick={handleEditClick}
              className={bem(BANK_CARD_BLOCK, 'edit-button')}
              type={BUTTON_TYPE_BUTTON}
              aria-label={BANK_CARD_EDIT_LABEL}
            >
              <FiEdit2
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
        </ParentClassProvider>
      </div>
    </>
  );
};
