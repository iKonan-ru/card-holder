import type { FC } from 'react';
import type { ICardPreviewProps } from './model';
import { BANKS_LIST, DEFAULT_BANK, type TBankKeys } from '@shared/data';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import {
  bem,
  createClassName,
  getBankByCardNumber,
  getPaymentSystem,
  SPACE_REMOVAL_PATTERN,
  EMPTY_STRING,
} from '@shared/lib';
import { CARD_PREVIEW_BLOCK } from './lib/constants';
import './card-preview.less';

export const CardPreview: FC<ICardPreviewProps> = ({ pan, parentClass }) => {
  const cleanPan = pan.replace(SPACE_REMOVAL_PATTERN, EMPTY_STRING);
  const paymentSystem = getPaymentSystem(cleanPan);
  const bankId = getBankByCardNumber(cleanPan);
  const bank = BANKS_LIST.find((bank) => bank.id === bankId) || DEFAULT_BANK;

  const hasPaymentSystem = Boolean(paymentSystem);
  const hasBank = Boolean(bankId);
  const hasAnyInfo = hasPaymentSystem || hasBank;

  if (!hasAnyInfo) {
    return null;
  }

  const paymentSystemLogoUrl = paymentSystem
    ? paymentSystemLogos[paymentSystem]
    : null;
  const bankLogoUrl =
    bankId && bankId in bankLogos ? bankLogos[bankId as TBankKeys] : null;

  const className = createClassName({
    blockName: CARD_PREVIEW_BLOCK,
    parentClass,
  });

  return (
    <div
      className={className}
      aria-hidden="true"
    >
      <div
        className={bem(CARD_PREVIEW_BLOCK, 'color-indicator')}
        style={{ backgroundColor: bank.color }}
        title={bank.name}
      />

      {bankLogoUrl && (
        <div className={bem(CARD_PREVIEW_BLOCK, 'icon')}>
          <img
            src={bankLogoUrl}
            alt=""
          />
        </div>
      )}

      {paymentSystemLogoUrl && (
        <div className={bem(CARD_PREVIEW_BLOCK, 'icon')}>
          <img
            src={paymentSystemLogoUrl}
            alt=""
          />
        </div>
      )}
    </div>
  );
};
