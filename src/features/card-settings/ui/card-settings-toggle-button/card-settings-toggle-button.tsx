import { type FC } from 'react';
import { FiSliders } from 'react-icons/fi';
import { canReorder, useCardViewStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import { CARD_SETTINGS_TOGGLE_BUTTON_ARIA_LABEL } from '../../constants';
import { useCardSettingsStore } from '../../store';

export const CardSettingsToggleButton: FC = () => {
  const isOpen = useCardSettingsStore((state) => state.isOpen);
  const toggle = useCardSettingsStore((state) => state.toggle);
  const sortKey = useCardViewStore((state) => state.sortKey);
  const groupBy = useCardViewStore((state) => state.groupBy);
  const filters = useCardViewStore((state) => state.filters);

  const hasActiveModifiers = !canReorder({ sortKey, groupBy, filters });

  return (
    <FabButton
      icon={FiSliders}
      ariaLabel={CARD_SETTINGS_TOGGLE_BUTTON_ARIA_LABEL}
      onClick={toggle}
      isActive={isOpen}
      hasIndicator={hasActiveModifiers}
    />
  );
};
