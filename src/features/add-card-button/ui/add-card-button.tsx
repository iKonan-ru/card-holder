import type { FC } from 'react';
import type { IAddCardButtonProps } from '../model';
import { IoAdd } from 'react-icons/io5';
import { bem, useClassName } from '@shared/lib';
import { ADD_CARD_BUTTON_BLOCK, ADD_CARD_BUTTON_ARIA_LABEL } from '../lib';
import './add-card-button.less';

export const AddCardButton: FC<IAddCardButtonProps> = ({ onClick }) => {
  const className = useClassName({
    blockName: ADD_CARD_BUTTON_BLOCK,
  });

  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
      aria-label={ADD_CARD_BUTTON_ARIA_LABEL}
    >
      <IoAdd
        className={bem(ADD_CARD_BUTTON_BLOCK, 'icon')}
        aria-hidden="true"
      />
    </button>
  );
};
