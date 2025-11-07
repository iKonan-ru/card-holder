import { type FC, type MouseEvent } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { BANKS_LIST, DEFAULT_BANK } from '@shared/data/banks-config';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import {
  bem,
  createClassName,
  darkenColor,
  formatExpiryDate,
  getBankByCardNumber,
  getPaymentSystem,
  maskPan,
  maskValue,
} from '@shared/lib';
import { CopyableField } from '@shared/ui';
import {
  BANK_CARD_BLOCK,
  BANK_CARD_ACTIONS_BLOCK,
  BANK_CARD_FLIP_LABEL,
  BANK_CARD_EDIT_LABEL,
  CARD_COLOR_DARKEN_PERCENTAGE,
} from '../lib/constants';
import type { IBankCardProps } from './model';
import './bank-card.less';

export const BankCard: FC<IBankCardProps> = ({
  card,
  isFlipped = false,
  onFlip,
  onEdit,
  parentClass,
  isReorderMode = false,
}) => {
  const bankId = getBankByCardNumber(card.pan);
  const paymentSystem = getPaymentSystem(card.pan);
  const bank = BANKS_LIST.find((bank) => bank.id === bankId) || DEFAULT_BANK;

  const handleCardClick = (event: MouseEvent) => {
    if (isReorderMode) {
      return;
    }

    const isClickOnActions = (event.target as HTMLElement).closest(
      `.${BANK_CARD_ACTIONS_BLOCK}`
    );

    if (!isClickOnActions && onFlip) {
      onFlip(card.pan);
    }
  };

  const handleEditClick = (event: MouseEvent) => {
    event.stopPropagation();

    if (onEdit) {
      onEdit(card);
    }
  };

  const cardStyle = {
    '--color': bank.color,
    '--color-dark': darkenColor(bank.color, CARD_COLOR_DARKEN_PERCENTAGE),
  } as React.CSSProperties;

  const modifiers = [];

  if (isFlipped) {
    modifiers.push('flipped');
  }

  if (isReorderMode) {
    modifiers.push('reorder-mode');
  }

  const className = createClassName({
    blockName: BANK_CARD_BLOCK,
    modifiers,
    parentClass,
  });

  const maskedPan = maskPan(card.pan, false);
  const cardAriaLabel = `Банковская карта ${bank.name || ''} ${maskedPan}. ${BANK_CARD_FLIP_LABEL}`;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={className}
        style={cardStyle}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          const isEnterOrSpace = event.key === 'Enter' || event.key === ' ';

          if (isEnterOrSpace && onFlip) {
            event.preventDefault();
            onFlip(card.pan);
          }
        }}
        aria-label={cardAriaLabel}
        aria-pressed={isFlipped}
      >
        <div className={bem(BANK_CARD_BLOCK, 'front')}>
          <div className={bem(BANK_CARD_BLOCK, 'header')}>
            {bank.name && (
              <>
                {bankLogos[bank.id] && (
                  <div
                    className={bem(BANK_CARD_BLOCK, 'logo')}
                    aria-hidden="true"
                  >
                    <img
                      src={bankLogos[bank.id]}
                      alt=""
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
                aria-hidden="true"
              >
                <img
                  src={paymentSystemLogos[paymentSystem]}
                  alt=""
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
              parentClass={BANK_CARD_BLOCK}
              modifier="pan"
            />

            <div className={bem(BANK_CARD_BLOCK, 'footer')}>
              <CopyableField
                value={card.name}
                parentClass={BANK_CARD_BLOCK}
                modifier="name"
              />
              <CopyableField
                value={formatExpiryDate(card.expires)}
                parentClass={BANK_CARD_BLOCK}
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
            type="button"
            aria-label={BANK_CARD_EDIT_LABEL}
          >
            <FiEdit2
              className={bem(BANK_CARD_BLOCK, 'edit-icon')}
              aria-hidden="true"
            />
          </button>

          <CopyableField
            value={card.cvv}
            maskFn={maskValue}
            parentClass={BANK_CARD_BLOCK}
            modifier="cvv"
            label="CVV"
          />

          <div className={bem(BANK_CARD_BLOCK, 'bottom')}>
            {card.phrase && (
              <CopyableField
                value={card.phrase}
                maskFn={maskValue}
                parentClass={BANK_CARD_BLOCK}
                modifier="phrase"
                label="Кодовая фраза"
              />
            )}

            {card.pin && (
              <CopyableField
                value={card.pin}
                maskFn={maskValue}
                parentClass={BANK_CARD_BLOCK}
                modifier="pin"
                label="PIN"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
