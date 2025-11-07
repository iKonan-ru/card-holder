import alfabankRaw from './alfabank.svg?raw';
import citibankRaw from './citibank.svg?raw';
import domrfRaw from './domrf.svg?raw';
import gazprombankRaw from './gazprombank.svg?raw';
import ibtRaw from './ibt.svg?raw';
import mkbRaw from './mkb.svg?raw';
import openRaw from './open.svg?raw';
import psbbankRaw from './psbbank.svg?raw';
import raiffeisenRaw from './raiffeisen.svg?raw';
import rosbankRaw from './rosbank.svg?raw';
import sberbankRaw from './sberbank.svg?raw';
import tbankRaw from './tbank.svg?raw';
import unicreditRaw from './unicredit.svg?raw';
import uralsibRaw from './uralsib.svg?raw';
import vtb24Raw from './vtb24.svg?raw';
import { svgToDataUrl } from '@shared/lib';
import type { TBankKeys } from '@shared/data';

export const bankLogos: Partial<Record<TBankKeys, string>> = {
  alfabank: svgToDataUrl(alfabankRaw),
  citibank: svgToDataUrl(citibankRaw),
  domrf: svgToDataUrl(domrfRaw),
  gazprombank: svgToDataUrl(gazprombankRaw),
  ibt: svgToDataUrl(ibtRaw),
  mkb: svgToDataUrl(mkbRaw),
  open: svgToDataUrl(openRaw),
  psbbank: svgToDataUrl(psbbankRaw),
  raiffeisen: svgToDataUrl(raiffeisenRaw),
  rosbank: svgToDataUrl(rosbankRaw),
  sberbank: svgToDataUrl(sberbankRaw),
  tbank: svgToDataUrl(tbankRaw),
  unicredit: svgToDataUrl(unicreditRaw),
  uralsib: svgToDataUrl(uralsibRaw),
  vtb24: svgToDataUrl(vtb24Raw),
};
