import { type FC } from 'react';
import { MdFileDownload } from 'react-icons/md';
import { useCardManagementStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import type { PropsWithParentClass } from '@shared/types';
import { useExportCards } from '../../lib/hooks';

const EXPORT_BUTTON_ARIA_LABEL = 'Экспортировать карты';

export const ExportButton: FC<PropsWithParentClass> = ({ parentClass }) => {
  const cards = useCardManagementStore((state) => state.cards);
  const { isExporting, exportCards } = useExportCards({ cards });

  return (
    <FabButton
      icon={MdFileDownload}
      ariaLabel={EXPORT_BUTTON_ARIA_LABEL}
      onClick={exportCards}
      disabled={isExporting}
      parentClass={parentClass}
    />
  );
};
