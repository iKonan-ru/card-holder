import { type FC } from 'react';
import { Chip } from '@shared/ui';
import type { IActiveFilterChip } from '../../hooks';

interface IFilterChipProps {
  chip: IActiveFilterChip;
  onRemove: (facet: IActiveFilterChip['facet'], value: string) => void;
}

export const FilterChip: FC<IFilterChipProps> = ({ chip, onRemove }) => {
  const handleRemove = () => {
    onRemove(chip.facet, chip.value);
  };

  return (
    <Chip
      label={chip.label}
      onRemove={handleRemove}
    />
  );
};
