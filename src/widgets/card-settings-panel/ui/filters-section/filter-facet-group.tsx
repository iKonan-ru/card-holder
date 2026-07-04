import { type FC } from 'react';
import type { ICardFilters } from '@features/card-management';
import { CheckboxGroup } from '@shared/ui';
import type { IFilterSection } from '../../hooks';

interface IFilterFacetGroupProps {
  section: IFilterSection;
  onChange: (facet: keyof ICardFilters, next: string[]) => void;
}

export const FilterFacetGroup: FC<IFilterFacetGroupProps> = ({
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
