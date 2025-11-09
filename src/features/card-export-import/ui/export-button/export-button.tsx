import { type FC } from 'react';
import { MdFileDownload } from 'react-icons/md';
import { useCardManagementStore } from '@features/card-management';
import { FabButton } from '@shared/ui';
import { EXPORT_BUTTON_ARIA_LABEL } from './lib/constants';
import { useExportCards } from './lib/hooks';

export const ExportButton: FC = () => {
  const cards = useCardManagementStore((state) => state.cards);
  const { isExporting, exportCards } = useExportCards({ cards });

  return (
    <FabButton
      icon={MdFileDownload}
      ariaLabel={EXPORT_BUTTON_ARIA_LABEL}
      onClick={exportCards}
      disabled={isExporting}
    />
  );
};
