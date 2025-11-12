import { type FC } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useCardManagementStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import { CLEAR_BUTTON_ARIA_LABEL } from './lib/constants';
import { useClearData } from './lib/hooks';

export const ClearButton: FC = () => {
  const clearAllCards = useCardManagementStore((state) => state.clearAllCards);

  const { isClearing, clearData } = useClearData({
    onClear: clearAllCards,
  });

  return (
    <FabButton
      icon={MdDeleteForever}
      ariaLabel={CLEAR_BUTTON_ARIA_LABEL}
      onClick={clearData}
      disabled={isClearing}
    />
  );
};
