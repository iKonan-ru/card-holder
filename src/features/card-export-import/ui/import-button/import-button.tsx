import { type FC } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useCardsStore } from '@features/card-management';
import { useCardTypesManagementStore } from '@features/card-types-management';
import { useOwnersManagementStore } from '@features/owners-management';
import { FabButton } from '@shared/ui';
import { IMPORT_BUTTON_ARIA_LABEL } from '../../constants';
import { useImportCards } from '../../hooks';

export const ImportButton: FC = () => {
  const cards = useCardsStore((state) => state.cards);
  const reorderCards = useCardsStore((state) => state.reorderCards);
  const unflipCards = useCardsStore((state) => state.unflipCards);

  const cardTypes = useCardTypesManagementStore((state) => state.items);
  const importCardTypes = useCardTypesManagementStore(
    (state) => state.importItems,
  );
  const owners = useOwnersManagementStore((state) => state.items);
  const importOwners = useOwnersManagementStore((state) => state.importItems);

  const { isImporting, importCards } = useImportCards({
    cards,
    cardTypes,
    owners,
    onImport: reorderCards,
    onImportCardTypes: importCardTypes,
    onImportOwners: importOwners,
    onUnflipCards: unflipCards,
  });

  return (
    <FabButton
      icon={FiDownload}
      ariaLabel={IMPORT_BUTTON_ARIA_LABEL}
      onClick={importCards}
      disabled={isImporting}
    />
  );
};
