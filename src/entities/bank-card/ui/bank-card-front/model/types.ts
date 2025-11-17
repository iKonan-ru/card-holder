import type { IBankCard } from '../../../model';
import type { IBankCardCommonProps } from '../../model';

export interface IBankCardFrontProps extends IBankCardCommonProps {
  card: IBankCard;
}
