import type { MouseEvent } from 'react';
import type { IBankCard } from '../../../model';

export interface IBankCardBackProps {
  card: IBankCard;
  onEditClick: (event: MouseEvent) => void;
}
