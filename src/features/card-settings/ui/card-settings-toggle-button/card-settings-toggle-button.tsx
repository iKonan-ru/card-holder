import { type FC } from 'react';
import { FiSliders } from 'react-icons/fi';
import { canReorder, useCardViewStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import { CARD_SETTINGS_TOGGLE_BUTTON_ARIA_LABEL } from '../../constants';
import { useCardSettingsStore } from '../../store';

export const CardSettingsToggleButton: FC = () => {
  const { isOpen, toggle } = useCardSettingsStore();
  const { sortKey, groupBy, filters } = useCardViewStore();

  const hasActiveModifiers = !canReorder({ sortKey, groupBy, filters });

  return (
    <FabButton
      icon={FiSliders}
      ariaLabel={CARD_SETTINGS_TOGGLE_BUTTON_ARIA_LABEL}
      onClick={toggle}
      isActive={isOpen}
      ariaPressed={isOpen}
      hasIndicator={hasActiveModifiers}
    />
  );
};
