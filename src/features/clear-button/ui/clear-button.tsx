import { type FC } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useCardsStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import { CLEAR_BUTTON_ARIA_LABEL } from '../constants';
import { useClearData } from '../hooks';

export const ClearButton: FC = () => {
  const clearAllCards = useCardsStore((state) => state.clearAllCards);

  const { isClearing, clearData } = useClearData({
    onClear: clearAllCards,
  });

  return (
    <FabButton
      icon={FiTrash2}
      ariaLabel={CLEAR_BUTTON_ARIA_LABEL}
      onClick={clearData}
      disabled={isClearing}
    />
  );
};
