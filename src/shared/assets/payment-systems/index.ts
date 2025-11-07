import humoRaw from './humo.svg?raw';
import jcbRaw from './jcb.svg?raw';
import mastercardRaw from './mastercard.svg?raw';
import mirRaw from './mir.svg?raw';
import uzcardRaw from './uzcard.svg?raw';
import visaRaw from './visa.svg?raw';
import { svgToDataUrl } from '@shared/lib';

export const paymentSystemLogos: Record<string, string> = {
  humo: svgToDataUrl(humoRaw),
  jcb: svgToDataUrl(jcbRaw),
  mastercard: svgToDataUrl(mastercardRaw),
  mir: svgToDataUrl(mirRaw),
  uzcard: svgToDataUrl(uzcardRaw),
  visa: svgToDataUrl(visaRaw),
};
