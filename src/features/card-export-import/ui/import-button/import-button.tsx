import { type FC } from 'react';
import { MdFileUpload } from 'react-icons/md';
import { useCardManagementStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import type { PropsWithParentClass } from '@shared/types';
import { useImportCards } from '../../lib/hooks';

const IMPORT_BUTTON_ARIA_LABEL = 'Импортировать карты';

export const ImportButton: FC<PropsWithParentClass> = ({ parentClass }) => {
  const cards = useCardManagementStore((state) => state.cards);
  const reorderCards = useCardManagementStore((state) => state.reorderCards);
  const unflipCards = useCardManagementStore((state) => state.unflipCards);

  const { isImporting, importCards } = useImportCards({
    cards,
    onImport: reorderCards,
    onUnflipCards: unflipCards,
  });

  return (
    <FabButton
      icon={MdFileUpload}
      ariaLabel={IMPORT_BUTTON_ARIA_LABEL}
      onClick={importCards}
      disabled={isImporting}
      parentClass={parentClass}
    />
  );
};
