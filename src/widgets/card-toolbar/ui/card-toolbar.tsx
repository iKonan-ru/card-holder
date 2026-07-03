import { useCallback, useMemo, type FC, type ReactElement } from 'react';
import { FiArrowDown, FiArrowUp, FiFilter } from 'react-icons/fi';
import { SortDirection } from '@features/card-management';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import {
  BottomSheet,
  CheckboxGroup,
  Chip,
  IconButton,
  Select,
} from '@shared/ui';
import {
  CARD_TOOLBAR_BLOCK,
  FILTER_BUTTON_LABEL,
  FILTER_SHEET_TITLE,
  GROUP_BY_OPTIONS,
  GROUP_BY_PLACEHOLDER,
  GROUP_CHIP_REMOVE_ARIA_LABEL,
  RESET_ALL_LABEL,
  SORT_CHIP_REMOVE_ARIA_LABEL,
  SORT_DIRECTION_ARROW,
  SORT_DIRECTION_LABEL_ASC,
  SORT_DIRECTION_LABEL_DESC,
  SORT_KEY_OPTIONS,
  SORT_KEY_PLACEHOLDER,
} from '../constants';
import {
  useCardToolbar,
  type IActiveFilterChip,
  type IFilterSection,
} from '../hooks';
import './card-toolbar.less';

export const CardToolbar: FC = () => {
  const {
    sortKey,
    sortDirection,
    isSortActive,
    handleSortKeyChange,
    handleToggleDirection,
    handleResetSort,
    groupBy,
    isGroupActive,
    handleGroupByChange,
    handleResetGroup,
    filterSections,
    activeFilterCount,
    activeFilterChips,
    isFilterSheetOpen,
    handleOpenFilterSheet,
    handleCloseFilterSheet,
    handleFilterChange,
    handleRemoveFilterValue,
    hasActiveModifiers,
    handleResetAll,
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

  const activeGroupLabel = useMemo(() => {
    const option = GROUP_BY_OPTIONS.find((item) => item.value === groupBy);

    return option?.label ?? groupBy;
  }, [groupBy]);

  const renderFilterChip = useCallback(
    (chip: IActiveFilterChip): ReactElement => {
      const handleRemove = () => {
        handleRemoveFilterValue(chip.facet, chip.value);
      };

      return (
        <Chip
          key={`${chip.facet}:${chip.value}`}
          label={chip.label}
          onRemove={handleRemove}
        />
      );
    },
    [handleRemoveFilterValue],
  );

  const renderFilterSection = useCallback(
    (section: IFilterSection): ReactElement => {
      const handleChange = (next: string[]) => {
        handleFilterChange(section.key, next);
      };

      return (
        <CheckboxGroup
          key={section.key}
          title={section.title}
          options={section.options}
          value={section.selectedValues}
          onChange={handleChange}
        />
      );
    },
    [handleFilterChange],
  );

  const className = useClassName({ blockName: CARD_TOOLBAR_BLOCK });
  const hasChipsRow =
    isSortActive || isGroupActive || activeFilterChips.length > 0;

  return (
    <div className={className}>
      <ParentClassProvider parentClass={CARD_TOOLBAR_BLOCK}>
        <div className={bem(CARD_TOOLBAR_BLOCK, 'controls')}>
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
          <Select
            value={groupBy}
            options={GROUP_BY_OPTIONS}
            onChange={handleGroupByChange}
            placeholder={GROUP_BY_PLACEHOLDER}
          />
          <IconButton
            icon={FiFilter}
            label={FILTER_BUTTON_LABEL}
            badge={activeFilterCount}
            onClick={handleOpenFilterSheet}
          />
        </div>

        {hasChipsRow && (
          <div className={bem(CARD_TOOLBAR_BLOCK, 'chips')}>
            {isSortActive && (
              <Chip
                label={activeSortLabel}
                onRemove={handleResetSort}
                ariaLabel={SORT_CHIP_REMOVE_ARIA_LABEL}
              />
            )}
            {isGroupActive && (
              <Chip
                label={activeGroupLabel}
                onRemove={handleResetGroup}
                ariaLabel={GROUP_CHIP_REMOVE_ARIA_LABEL}
              />
            )}
            {activeFilterChips.map(renderFilterChip)}
            {hasActiveModifiers && (
              <button
                type="button"
                className={bem(CARD_TOOLBAR_BLOCK, 'reset-all')}
                onClick={handleResetAll}
              >
                {RESET_ALL_LABEL}
              </button>
            )}
          </div>
        )}

        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={handleCloseFilterSheet}
          title={FILTER_SHEET_TITLE}
        >
          {filterSections.map(renderFilterSection)}
        </BottomSheet>
      </ParentClassProvider>
    </div>
  );
};
