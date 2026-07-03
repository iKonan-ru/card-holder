import type { IOwner } from '@entities/card-owner';

export interface IOwnersManagementState {
  owners: IOwner[];
  isLoading: boolean;
}

export interface IOwnersManagementActions {
  loadOwners: () => Promise<void>;
  addOwner: (realName: string, aliases: string[]) => Promise<void>;
  updateOwner: (owner: IOwner) => Promise<void>;
  deleteOwner: (id: string) => Promise<void>;
}
