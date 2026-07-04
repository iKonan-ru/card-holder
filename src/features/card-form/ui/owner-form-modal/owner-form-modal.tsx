import { type FC } from 'react';
import type { IOwner } from '@entities/card-owner';
import { EntityFormModal } from '../entity-form-modal';
import { OWNER_FORM_TEXTS } from './constants';

interface IOwnerFormModalProps {
  owner?: IOwner;
  onSubmit: (realName: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const OwnerFormModal: FC<IOwnerFormModalProps> = ({
  owner,
  onSubmit,
  onDelete,
}) => (
  <EntityFormModal
    initialValue={owner?.realName ?? ''}
    isEditMode={Boolean(owner)}
    texts={OWNER_FORM_TEXTS}
    onSubmit={onSubmit}
    onDelete={onDelete}
  />
);
