import { useCallback } from 'react';
import { MasterPasswordConfirmModal } from '@features/app-lock';
import { useModal } from '@shared/lib';
import type { Procedure } from '@shared/types';
import { DELETE_MODAL_MESSAGE, DELETE_MODAL_TITLE } from '../constants';

interface IUseCardFormDeleteParams {
  onDelete: () => Promise<void>;
}

interface IUseCardFormDeleteResult {
  handleDeleteClick: Procedure;
}

export const useCardFormDelete = ({
  onDelete,
}: IUseCardFormDeleteParams): IUseCardFormDeleteResult => {
  const { open } = useModal();

  const handleDeleteClick = useCallback(() => {
    open(
      <MasterPasswordConfirmModal
        message={DELETE_MODAL_MESSAGE}
        onConfirm={onDelete}
      />,
      DELETE_MODAL_TITLE,
    );
  }, [open, onDelete]);

  return { handleDeleteClick };
};
