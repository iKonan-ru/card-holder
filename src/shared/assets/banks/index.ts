import type { FC } from 'react';
import type { TBankKeys } from '@shared/data';
import Alfabank from './alfabank.svg?react';
import Citibank from './citibank.svg?react';
import Domrf from './domrf.svg?react';
import Gazprombank from './gazprombank.svg?react';
import Ibt from './ibt.svg?react';
import Mkb from './mkb.svg?react';
import Open from './open.svg?react';
import Ozon from './ozon.svg?react';
import Psbbank from './psbbank.svg?react';
import Raiffeisen from './raiffeisen.svg?react';
import Rosbank from './rosbank.svg?react';
import Sberbank from './sberbank.svg?react';
import Tbank from './tbank.svg?react';
import Unicredit from './unicredit.svg?react';
import Uralsib from './uralsib.svg?react';
import Vtb24 from './vtb24.svg?react';
import Wb from './wb.svg?react';

export const bankLogos: Partial<Record<TBankKeys, FC<{ className?: string }>>> =
  {
    alfabank: Alfabank,
    citibank: Citibank,
    domrf: Domrf,
    gazprombank: Gazprombank,
    ibt: Ibt,
    mkb: Mkb,
    open: Open,
    psbbank: Psbbank,
    raiffeisen: Raiffeisen,
    rosbank: Rosbank,
    sberbank: Sberbank,
    tbank: Tbank,
    unicredit: Unicredit,
    uralsib: Uralsib,
    vtb24: Vtb24,
    ozon: Ozon,
    wb: Wb,
  };
