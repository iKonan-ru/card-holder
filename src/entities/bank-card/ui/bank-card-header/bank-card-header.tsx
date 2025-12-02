import { type FC } from 'react';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import { ARIA_HIDDEN_TRUE, bem } from '@shared/lib';
import { Icon } from '@shared/ui/icon';
import { BANK_CARD_BLOCK } from '../../lib';
import type { IBankCardCommonProps } from '../../model';

type TBankCardHeaderProps = IBankCardCommonProps;

export const BankCardHeader: FC<TBankCardHeaderProps> = ({
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
              <Icon component={bankLogo} />
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
          <Icon component={paymentSystemLogo} />
        </div>
      )}
    </div>
  );
};
