import { type FC } from 'react';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import { bem, ARIA_HIDDEN_TRUE } from '@shared/lib';
import { BANK_CARD_BLOCK } from '../../lib';
import type { IBankCardHeaderProps } from './model';

export const BankCardHeader: FC<IBankCardHeaderProps> = ({
  bank,
  paymentSystem,
}) => {
  const bankLogo = bankLogos[bank.id];
  const paymentSystemLogo = paymentSystem
    ? paymentSystemLogos[paymentSystem]
    : null;

  return (
    <div className={bem(BANK_CARD_BLOCK, 'header')}>
      {bank.name && (
        <>
          {bankLogo && (
            <div
              className={bem(BANK_CARD_BLOCK, 'logo')}
              aria-hidden={ARIA_HIDDEN_TRUE}
            >
              <img
                src={bankLogo}
                alt={bank.id}
              />
            </div>
          )}

          {bank.name && (
            <div className={bem(BANK_CARD_BLOCK, 'bank-name')}>{bank.name}</div>
          )}
        </>
      )}

      {paymentSystemLogo && paymentSystem && (
        <div
          className={bem(BANK_CARD_BLOCK, 'payment-system')}
          aria-hidden={ARIA_HIDDEN_TRUE}
        >
          <img
            src={paymentSystemLogo}
            alt={paymentSystem}
          />
        </div>
      )}
    </div>
  );
};
