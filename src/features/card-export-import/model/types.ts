export type TPasswordModalMode = 'export' | 'import';

export interface IImportResult {
  imported: number;
  replaced: number;
  total: number;
}
