import { type FC, useMemo } from 'react';
import type { ICardPreviewProps } from './model';
import { BANKS_LIST, DEFAULT_BANK, type TBankKeys } from '@shared/data';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import {
  bem,
  useClassName,
  getBankByCardNumber,
  getPaymentSystem,
  SPACE_REMOVAL_PATTERN,
  EMPTY_STRING,
} from '@shared/lib';
import { CARD_PREVIEW_BLOCK } from './lib/constants';
import './card-preview.less';

export const CardPreview: FC<ICardPreviewProps> = ({ pan }) => {
  const cleanPan = useMemo(
    () => pan.replace(SPACE_REMOVAL_PATTERN, EMPTY_STRING),
    [pan]
  );
  const paymentSystem = useMemo(() => getPaymentSystem(cleanPan), [cleanPan]);
  const bankId = useMemo(() => getBankByCardNumber(cleanPan), [cleanPan]);
  const bank = useMemo(
    () => BANKS_LIST.find((bank) => bank.id === bankId) || DEFAULT_BANK,
    [bankId]
  );

  const hasPaymentSystem = Boolean(paymentSystem);
  const hasBank = Boolean(bankId);
  const hasAnyInfo = hasPaymentSystem || hasBank;

  const paymentSystemLogoUrl = useMemo(
    () => (paymentSystem ? paymentSystemLogos[paymentSystem] : null),
    [paymentSystem]
  );
  const bankLogoUrl = useMemo(
    () =>
      bankId && bankId in bankLogos ? bankLogos[bankId as TBankKeys] : null,
    [bankId]
  );

  const className = useClassName({
    blockName: CARD_PREVIEW_BLOCK,
  });

  if (!hasAnyInfo) {
    return null;
  }

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
