import { type FC } from 'react';
import type { ICardFilters } from '@features/card-management';
import { CheckboxGroup } from '@shared/ui';
import type { IFilterSection as IFilterSectionData } from '../../hooks';

interface IFilterSectionProps {
  section: IFilterSectionData;
  onChange: (facet: keyof ICardFilters, next: string[]) => void;
}

export const FilterSection: FC<IFilterSectionProps> = ({
  section,
  onChange,
}) => {
  const handleChange = (next: string[]) => {
    onChange(section.key, next);
  };

  return (
    <CheckboxGroup
      title={section.title}
      options={section.options}
      value={section.selectedValues}
      onChange={handleChange}
    />
  );
};
