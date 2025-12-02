import { useMemo, type FC } from 'react';
import { bankLogos } from '@shared/assets/banks';
import { paymentSystemLogos } from '@shared/assets/payment-systems';
import { BANKS_LIST, DEFAULT_BANK } from '@shared/data';
import {
  bem,
  EMPTY_STRING,
  getBankByCardNumber,
  getPaymentSystem,
  getTextColorStyle,
  ParentClassProvider,
  SPACE_REMOVAL_PATTERN,
  useClassName,
} from '@shared/lib';
import { Icon } from '@shared/ui/icon';
import { CARD_PREVIEW_BLOCK } from '../lib';
import './card-preview.less';

interface ICardPreviewProps {
  pan: string;
}

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
  const isDarkText = Boolean(bank.isDarkText);

  const bankLogo = bankLogos[bank.id];
  const paymentSystemLogo = paymentSystem
    ? paymentSystemLogos[paymentSystem]
    : null;

  const modifiers = useMemo(
    () => (isDarkText ? ['dark-text'] : []),
    [isDarkText]
  );

  const className = useClassName({
    blockName: CARD_PREVIEW_BLOCK,
    modifiers,
  });

  const style = useMemo(() => getTextColorStyle(isDarkText), [isDarkText]);

  if (!hasAnyInfo) {
    return null;
  }

  return (
    <div
      className={className}
      style={style}
      aria-hidden="true"
    >
      <ParentClassProvider parentClass={CARD_PREVIEW_BLOCK}>
        <div
          className={bem(CARD_PREVIEW_BLOCK, 'color-indicator')}
          style={{ backgroundColor: bank.color }}
          title={bank.name}
        />
        {bankLogo && <Icon component={bankLogo} />}
        {paymentSystemLogo && <Icon component={paymentSystemLogo} />}
      </ParentClassProvider>
    </div>
  );
};
