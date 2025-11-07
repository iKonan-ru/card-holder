import type { PropsWithParentClass } from '@shared/types';

export interface IConfirmModalProps extends PropsWithParentClass {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
