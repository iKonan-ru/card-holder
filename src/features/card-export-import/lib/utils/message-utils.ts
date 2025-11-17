import type { IImportResult } from '../../model';
import { IMPORT_SUCCESS_MESSAGE_TEMPLATE } from '../constants';

const PLACEHOLDER_IMPORTED = '{imported}';
const PLACEHOLDER_REPLACED = '{replaced}';

export const createImportSuccessMessage = (stats: IImportResult): string => {
  const message = IMPORT_SUCCESS_MESSAGE_TEMPLATE.replace(
    PLACEHOLDER_IMPORTED,
    String(stats.imported)
  ).replace(PLACEHOLDER_REPLACED, String(stats.replaced));

  return message;
};
