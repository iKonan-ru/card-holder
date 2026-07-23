import { type FC } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useCardsStore } from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';
import { FabButton } from '@shared/ui';
import { EXPORT_BUTTON_ARIA_LABEL } from '../../constants';
import { useExportCards } from '../../hooks';

export const ExportButton: FC = () => {
  const cards = useCardsStore((state) => state.cards);
  const cardTypes = useCardTypesManagementStore((state) => state.cardTypes);
  const owners = useOwnersManagementStore((state) => state.owners);
  const { isExporting, exportCards } = useExportCards({
    cards,
    cardTypes,
    owners,
  });

  return (
    <FabButton
      icon={FiUpload}
      ariaLabel={EXPORT_BUTTON_ARIA_LABEL}
      onClick={exportCards}
      disabled={isExporting}
    />
  );
};
