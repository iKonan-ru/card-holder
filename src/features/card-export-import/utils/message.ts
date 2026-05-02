import {
  IMPORT_SUCCESS_MESSAGE_TEMPLATE,
  PLACEHOLDER_IMPORTED,
  PLACEHOLDER_REPLACED,
} from '../constants';
import type { IImportResult } from '../types';

export const createImportSuccessMessage = (stats: IImportResult): string => {
  return IMPORT_SUCCESS_MESSAGE_TEMPLATE.replace(
    PLACEHOLDER_IMPORTED,
    String(stats.imported),
  ).replace(PLACEHOLDER_REPLACED, String(stats.replaced));
};
