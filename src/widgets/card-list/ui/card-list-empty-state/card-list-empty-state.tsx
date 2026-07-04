import { type FC } from 'react';
import { useClassName } from '@shared/lib';
import {
  CARD_LIST_EMPTY_STATE_BLOCK,
  CARD_LIST_FILTER_EMPTY_MESSAGE,
} from '../../constants';
import './card-list-empty-state.less';

export const CardListEmptyState: FC = () => {
  const className = useClassName({ blockName: CARD_LIST_EMPTY_STATE_BLOCK });

  return <div className={className}>{CARD_LIST_FILTER_EMPTY_MESSAGE}</div>;
};
