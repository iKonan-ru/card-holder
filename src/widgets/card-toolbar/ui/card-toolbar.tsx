import { useCallback, type FC, type ReactElement } from 'react';
import { FiFilter } from 'react-icons/fi';
import { bem, ParentClassProvider, useClassName } from '@shared/lib';
import { BottomSheet, Chip, IconButton, Select } from '@shared/ui';
import {
  CARD_TOOLBAR_BLOCK,
  FILTER_BUTTON_LABEL,
  FILTER_SHEET_TITLE,
  GROUP_BY_OPTIONS,
  GROUP_BY_PLACEHOLDER,
  GROUP_CHIP_REMOVE_ARIA_LABEL,
  RESET_ALL_LABEL,
  SORT_CHIP_REMOVE_ARIA_LABEL,
  SORT_KEY_OPTIONS,
  SORT_KEY_PLACEHOLDER,
} from '../constants';
import {
  useCardToolbar,
  type IActiveFilterChip,
  type IFilterSection,
} from '../hooks';
import { FilterChip } from './filter-chip';
import { FilterSection } from './filter-section';
import './card-toolbar.less';

export const CardToolbar: FC = () => {
  const {
    sortKey,
    isSortActive,
    directionIcon,
    directionLabel,
    activeSortLabel,
    handleSortKeyChange,
    handleToggleDirection,
    handleResetSort,
    groupBy,
    isGroupActive,
    activeGroupLabel,
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
    hasChipsRow,
    hasActiveModifiers,
    handleResetAll,
  } = useCardToolbar();

  const renderFilterChip = useCallback(
    (chip: IActiveFilterChip): ReactElement => (
      <FilterChip
        key={`${chip.facet}:${chip.value}`}
        chip={chip}
        onRemove={handleRemoveFilterValue}
      />
    ),
    [handleRemoveFilterValue],
  );

  const renderFilterSection = useCallback(
    (section: IFilterSection): ReactElement => (
      <FilterSection
        key={section.key}
        section={section}
        onChange={handleFilterChange}
      />
    ),
    [handleFilterChange],
  );

  const className = useClassName({ blockName: CARD_TOOLBAR_BLOCK });

  return (
    <div className={className}>
      <ParentClassProvider parentClass={CARD_TOOLBAR_BLOCK}>
        <div className={bem(CARD_TOOLBAR_BLOCK, 'controls')}>
          <Select
            value={sortKey}
            options={SORT_KEY_OPTIONS}
            onChange={handleSortKeyChange}
            placeholder={SORT_KEY_PLACEHOLDER}
            ariaLabel={SORT_KEY_PLACEHOLDER}
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
            ariaLabel={GROUP_BY_PLACEHOLDER}
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
