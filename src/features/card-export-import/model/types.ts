export type TPasswordModalMode = 'export' | 'import';

export interface IPasswordModalResult {
  password: string;
}

export interface IImportResult {
  imported: number;
  replaced: number;
  total: number;
}

export interface IPasswordModalProps {
  mode: TPasswordModalMode;
  onConfirm: (password: string, closeModal: () => void) => void;
  onCancel?: () => void;
}
