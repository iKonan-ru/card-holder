import { useMemo, type FC } from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { SortDirection } from '@features/card-management';
import { ParentClassProvider, useClassName } from '@shared/lib';
import { Chip, IconButton, Select } from '@shared/ui';
import {
  CARD_TOOLBAR_BLOCK,
  SORT_CHIP_REMOVE_ARIA_LABEL,
  SORT_DIRECTION_ARROW,
  SORT_DIRECTION_LABEL_ASC,
  SORT_DIRECTION_LABEL_DESC,
  SORT_KEY_OPTIONS,
  SORT_KEY_PLACEHOLDER,
} from '../constants';
import { useCardToolbar } from '../hooks';
import './card-toolbar.less';

export const CardToolbar: FC = () => {
  const {
    sortKey,
    sortDirection,
    isSortActive,
    handleSortKeyChange,
    handleToggleDirection,
    handleResetSort,
  } = useCardToolbar();

  const directionIcon = useMemo(
    () => (sortDirection === SortDirection.Asc ? FiArrowUp : FiArrowDown),
    [sortDirection],
  );

  const directionLabel = useMemo(
    () =>
      sortDirection === SortDirection.Asc
        ? SORT_DIRECTION_LABEL_ASC
        : SORT_DIRECTION_LABEL_DESC,
    [sortDirection],
  );

  const activeSortLabel = useMemo(() => {
    const option = SORT_KEY_OPTIONS.find((item) => item.value === sortKey);

    return `${option?.label} ${SORT_DIRECTION_ARROW[sortDirection]}`;
  }, [sortKey, sortDirection]);

  const className = useClassName({ blockName: CARD_TOOLBAR_BLOCK });

  return (
    <div className={className}>
      <ParentClassProvider parentClass={CARD_TOOLBAR_BLOCK}>
        <Select
          value={sortKey}
          options={SORT_KEY_OPTIONS}
          onChange={handleSortKeyChange}
          placeholder={SORT_KEY_PLACEHOLDER}
        />
        <IconButton
          icon={directionIcon}
          title={directionLabel}
          onClick={handleToggleDirection}
        />
        {isSortActive && (
          <Chip
            label={activeSortLabel}
            onRemove={handleResetSort}
            ariaLabel={SORT_CHIP_REMOVE_ARIA_LABEL}
          />
        )}
      </ParentClassProvider>
    </div>
  );
};
