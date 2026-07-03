import type { IOwner } from '@entities/card-owner';

export const matchOwners = (query: string, owners: IOwner[]): IOwner[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return owners;
  }

  return owners.filter((owner) => {
    const isRealNameMatch = owner.realName
      .toLowerCase()
      .includes(normalizedQuery);
    const isAliasMatch = owner.aliases.some((alias) =>
      alias.toLowerCase().includes(normalizedQuery),
    );

    return isRealNameMatch || isAliasMatch;
  });
};
